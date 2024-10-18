import { app, InvocationContext, output, Timer } from "@azure/functions";

import { ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";

export default async function smCheckSubscription(
  timer: Timer,
  context: InvocationContext,
) {
  const logger = getLogger({
    correlationId: context.invocationId,
    prefix: "sm-check-subscription",
  });
  try {
    logger.info({ timer }, "Timer trigger function ran");

    const customersService = ServiceLocator.getCustomerService();
    const [customersWithUpcomingSubscriptions, errorMessages] =
      await customersService.getCustomersWithUpcomingSubscription();

    logger.info(
      `There are ${customersWithUpcomingSubscriptions.length} orders that need to be processed`,
    );

    for (const err of errorMessages) {
      logger.error(err);
    }

    return customersWithUpcomingSubscriptions;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

app.timer("sm-check-subscription", {
  schedule: "%SUBSCRIPTION_MANAGER_SCHEDULE%",
  return: output.serviceBusQueue({
    queueName: "dtc-subscription-orders",
    connection: "AZURE_SERVICEBUS_CONN_STR",
  }),
  handler: smCheckSubscription,
});
