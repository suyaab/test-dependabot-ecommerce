import { app, InvocationContext } from "@azure/functions";

import { customerSchema, ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";
import {
  EmailTemplate,
  ServiceLocator as SLNotifications,
} from "@ecommerce/notifications";
import {
  RecurPayAuthException,
  SchemaException,
  SMEmailException,
} from "@ecommerce/utils";

import { handlePrepaidOrders } from "./handlePrepaidOrders";
import { handleRecurringOrders } from "./handleRecurringOrders";
import { sendSubscriptionConfirmationEmail } from "./sendSubscriptionConfirmationEmail";

export default async function smProcessOrder(
  message: unknown,
  context: InvocationContext,
) {
  const logger = getLogger({
    correlationId: context.invocationId,
    prefix: "sm-process-subscription",
  });

  logger.info({ message }, "Received Message!");
  const productService = ServiceLocator.getProductService();
  const subscriptionService = ServiceLocator.getSubscriptionService();

  // This needs to be in sync with the ServiceBus retry count
  const MAX_RETRIES = 10;

  const deliveryCount = context?.triggerMetadata?.deliveryCount as number;
  logger.info({ deliveryCount }, "Received subscription process order message");

  const parse = customerSchema.safeParse(message);

  if (!parse.success) {
    // Theoretically should never fail since message is from check-subscription
    const schemaError = new SchemaException(
      "Failed to parse Process Order customer schema",
      parse.error,
    );

    logger.error(
      schemaError,
      "Failed to parse Process Order customer schema. This shouldn't have happened.",
    );

    throw schemaError;
  }

  const customer = parse.data;

  logger.info({ customer }, "Customer with subscription");

  try {
    const subscription = customer.subscription;

    if (subscription == null) {
      throw new Error("Unable to process order for invalid subscription");
    }

    // This logic should complement the one in getCustomersWithUpcomingSubscription
    // This should never happen unless there is a bug in sm-check-subscription
    // but if that bug exists, we don't want to create a lot of orders and emails
    if (
      subscription.nextOrderDate > new Date() ||
      subscription.stoppedRetrying === true ||
      (subscription.prepaidShipmentsRemaining <= 0 &&
        subscription.status !== "active")
    ) {
      logger.error(
        { subscription },
        "Subscription is not ready for processing. Check sm-check-subscription for bugs!",
      );
      return;
    }

    const subscriptionProduct = await productService.getProduct(
      subscription.subscription,
    );

    if (subscriptionProduct?.type !== "subscription") {
      throw new Error(
        `Invalid product type ${subscriptionProduct?.type} for processing subscription order`,
      );
    }

    logger.info({ subscriptionProduct }, "Retrieved subscription product");

    if (
      subscription.prepaidShipmentsRemaining <= 0 &&
      subscription.nextPlan == null &&
      !subscriptionProduct?.attributes.autoRenew
    ) {
      logger.info("Setting subscription to inactive");

      // move subscription to `inactive` and do not place new order
      await subscriptionService.updateSubscriptionStatus(
        customer.id,
        customer.version,
        "inactive",
      );

      // ignore this customer entirely
      return;
    }

    const newOrder =
      subscription.prepaidShipmentsRemaining > 0
        ? await handlePrepaidOrders(logger, customer)
        : await handleRecurringOrders(logger, customer, subscription);

    // TODO: possibly refactor to just return to an output binding
    await sendSubscriptionConfirmationEmail(logger, customer, newOrder);

    logger.info("Successfully processed subscription order");

    // TODO: We need to figure out order rollback if subscription update in handler fails
  } catch (error) {
    logger.error(
      error,
      `Failed to process subscription order (delivery count: ${deliveryCount})`,
    );

    if (error instanceof SMEmailException) {
      // TODO: rethink this
      // Since throwing an error here will cause the function to retry
      // we need to allow this to "succeed" and rely on other alerting
      logger.error("Failed to send subscription confirmation email");
      return;
    }

    if (deliveryCount >= MAX_RETRIES) {
      logger.error(
        `Failed to process this order ${MAX_RETRIES} times: marking StoppedRetrying as true`,
      );

      await subscriptionService.updateStoppedRetrying(
        customer.id,
        customer.version,
        true,
      );
      // TODO should we check for a specific result code? there are too many reasons for rejections.
      if (error instanceof RecurPayAuthException) {
        logger.info(
          `Initiating payment failure email dispatch for customer ID: ${customer.id}`,
        );
        const notificationsService = SLNotifications.getEmailService();

        await notificationsService.sendEmail(
          EmailTemplate.PaymentFailure,
          {
            email: customer.email,
            name: `${customer.firstName} ${customer.lastName}`,
          },
          { first_name: customer.firstName },
        );

        logger.info(
          `Payment failure email successfully sent for customer ID: ${customer.id}`,
        );
      }
    }

    throw error;
  }
}

app.serviceBusQueue("sm-process-order", {
  queueName: "dtc-subscription-orders",
  connection: "AZURE_SERVICEBUS_CONN_STR",
  handler: smProcessOrder,
});
