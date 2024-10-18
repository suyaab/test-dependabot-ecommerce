import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  orderNumberSchema,
  ServiceLocator as SLCommerce,
} from "@ecommerce/commerce";
import { ServiceLocator as SLFinance } from "@ecommerce/finance";
import { getLogger } from "@ecommerce/logger";
import { ServiceLocator as MarketingServiceLocator } from "@ecommerce/marketing";
import {
  ConvertOrderException,
  CreateCustomerException,
  PaymentFailedException,
} from "@ecommerce/utils";

import { getFeatureFlag } from "~/lib/feature-flags/server";
import sendOrderConfirmationEmail from "./sendOrderConfirmationEmail";

export const dynamic = "force-dynamic";

export default async function CheckoutProcessing({
  params: { cartId },
  searchParams: { id },
}: {
  params: { cartId?: string };
  searchParams: { id?: string };
}) {
  const logger = getLogger({
    prefix: "web:checkout:processing",
    headers: headers(),
  });

  let orderId;

  try {
    // TODO: Do we need to disable any features with Feature Flags for performance testing?
    const cartService = SLCommerce.getCartService();
    const customerService = SLCommerce.getCustomerService();
    const orderService = SLCommerce.getOrderService();
    const checkoutService = SLFinance.getCheckoutService();
    const paymentService = SLCommerce.getPaymentService();
    const subscriptionService = SLCommerce.getSubscriptionService();

    if (cartId == null) {
      throw new Error("Processing Checkout with no cartId");
    }

    if (id == null) {
      throw new Error("Processing Checkout with no checkoutSessionId");
    }

    const checkoutSessionId = id;

    logger.info({ cartId, checkoutSessionId }, "Processing Checkout");

    const cart = await cartService.getCart(cartId);

    if (cart == null) {
      throw new Error(`Cannot find cart ${cartId}`);
    }

    logger.info({ cart }, "Found Cart");

    if (cart.contactInfo == null) {
      throw new Error("Cart has no contact info");
    }

    if (cart.lineItems[0] == null) {
      throw new Error("Cart has no line items");
    }

    let externalId;
    const marketingService = MarketingServiceLocator.getMarketingService();
    const marketingUser = await marketingService
      .getUser(cart.contactInfo.email)
      .catch((err) => {
        logger.error(
          err,
          "marketingService getUser called failed during checkout",
        );
      });

    const brazeEnabled = await getFeatureFlag("DTC_Braze");

    if (marketingUser != null) {
      externalId = marketingUser.externalId;
      logger.info(
        { externalId },
        "Received external ID from Marketing service",
      );
    } else {
      // This technically should never happen but for edge cases and performance testing
      // when we turn off creating a braze user we will need to handle this case
      // If we can't find the user, we'll create a new externalId and merge dupe later
      externalId = crypto.randomUUID();

      if (brazeEnabled) {
        logger.error(
          { externalId },
          "Failed to get marketing user during checkout processing. Likely DUPE created.",
        );
      }
    }

    const checkoutPayment =
      await checkoutService.getCheckoutPayment(checkoutSessionId);

    logger.info({ checkoutPayment }, "Retrieved checkout payment");

    const customer = await customerService.createCustomerFromCart(
      externalId,
      cart,
    );

    if (customer == null) {
      throw new CreateCustomerException(
        "Failed to create customer from cart during checkout",
        cartId,
        externalId,
      );
    }

    logger.info({ customerId: customer.id }, "Created Customer");

    let customerId = customer.id;
    let customerVersion = customer.version;

    // TODO: should do this asynchronously but how do we get paymentMethodId?
    if (cart.lineItems[0].product.type === "subscription") {
      [customerId, customerVersion] = await subscriptionService
        .createSubscription(customer.id, 1, {
          subscriptionProduct: cart.lineItems[0].product,
          parentOrderNumber: orderNumberSchema.parse(
            checkoutPayment.orderNumber,
          ),
          paymentMethodId: checkoutPayment.paymentMethod.id,
        })
        .catch(async (error: unknown) => {
          logger.error("Failed to create subscription");
          await customerService.deleteCustomer(customerId, customerVersion);
          throw error;
        });

      logger.info("Successfully created subscription");
    }

    const paymentReference = await paymentService
      .createPaymentReference(checkoutPayment, customer.id, [
        {
          type: "Authorization",
          state: "Success",
          amount: {
            centAmount: Math.round(checkoutPayment.amount),
            currencyCode: checkoutPayment.currency,
          },
          interactionId: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ])
      .catch(async (error: unknown) => {
        logger.error("Failed to create payment reference");
        await customerService.deleteCustomer(customerId, customerVersion);
        throw error;
      });

    logger.info({ paymentReference }, "Created Payment Reference");

    const cartWithCustomer = await cartService
      .updateCartCustomerId(cart.id, cart.version, customer.id)
      .catch(async (error: unknown) => {
        logger.error("Failed to update cart with customer id");
        await customerService.deleteCustomer(customerId, customerVersion);
        await paymentService.deletePaymentReference(
          paymentReference.id,
          paymentReference.version,
        );
        throw error;
      });

    logger.info("Updated Cart with Customer Id");

    const cartWithPaymentRef = await cartService
      .updateCartPaymentInfo(
        cartWithCustomer.id,
        cartWithCustomer.version,
        paymentReference.id,
      )
      .catch(async (error: unknown) => {
        logger.error("Failed to update cart with payment reference id");
        // Deleting the customer now will delete the cart as well
        // so we need to remove the customer from Cart first
        await cartService.removeCustomerFromCart(
          cartWithCustomer.id,
          cartWithCustomer.version,
        );
        await customerService.deleteCustomer(customerId, customerVersion);
        await paymentService.deletePaymentReference(
          paymentReference.id,
          paymentReference.version,
        );
        throw error;
      });

    logger.info("Updated Cart with Payment Reference Id");

    const order = await orderService
      .createOrderFromCart(
        cartWithPaymentRef.id,
        cartWithPaymentRef.version,
        checkoutPayment.orderNumber,
      )
      .catch(async (error: unknown) => {
        logger.error("Failed to create order from cart");
        // Deleting the customer now will delete the cart as well
        // so we need to remove the customer from Cart first
        const noCustomerCart = await cartService.removeCustomerFromCart(
          cartWithPaymentRef.id,
          cartWithPaymentRef.version,
        );
        await customerService.deleteCustomer(customerId, customerVersion);

        // Need to remove the payment reference from the cart before deleting
        await cartService.removePaymentRefFromCart(
          noCustomerCart.id,
          noCustomerCart.version,
          paymentReference.id,
        );
        await paymentService.deletePaymentReference(
          paymentReference.id,
          paymentReference.version,
        );
        throw error;
      });

    if (order.id == null) {
      throw new ConvertOrderException(
        `Unable to create order from cart: ${cartId}`,
      );
    }
    logger.info({ order }, "Successfully created order from cart");

    orderId = order.id;

    logger.info("Successfully checked out");
    try {
      await sendOrderConfirmationEmail(order);
    } catch (error) {
      logger.error(error, "Failed to send order confirmation email");
    }
  } catch (error) {
    logger.error(error, "Processing Failed");

    if (error instanceof PaymentFailedException) {
      redirect("/checkout?error=PaymentFailed");
    }

    redirect("/checkout?error");
  }

  redirect(`/order-confirmation/${orderId}`);
}
