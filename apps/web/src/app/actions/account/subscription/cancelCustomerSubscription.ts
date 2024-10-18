"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ServiceLocator as AuthServiceLocator } from "@ecommerce/auth";
import { ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";
import {
  EmailTemplate,
  ServiceLocator as SLNotifications,
} from "@ecommerce/notifications";

import { ActionResponse } from "~/app/actions/types";
import ActionException from "../../ActionException";

export async function cancelCustomerSubscription(): Promise<ActionResponse> {
  const logger = getLogger({
    prefix: "web:actions:cancelCustomerSubscription",
    headers: headers(),
  });

  const authService = AuthServiceLocator.getAuthService();
  const customer = await authService
    .getAuthenticatedCustomer()
    .catch((error) => {
      logger.error(error, "Error getting authenticated customer");
      throw new ActionException("Error getting authenticated customer", {
        cause: error,
      });
    });

  if (customer == null) {
    logger.error(
      "There was an attempt to cancel subscription without being logged in!",
    );
    redirect("/api/auth/login");
  }

  logger.child({ customerId: customer?.id });

  try {
    logger.info("Attempting to cancel customer subscription");

    const subscriptionService = ServiceLocator.getSubscriptionService();
    await subscriptionService.cancelSubscription(customer.id, customer.version);

    logger.info("Successfully cancelled customer subscription");
    const notificationsService = SLNotifications.getEmailService();

    logger.info("Sending order cancellation email");
    await notificationsService.sendEmail(
      EmailTemplate.OrderCancellation,
      {
        email: customer.email,
        name: `${customer.firstName} ${customer.lastName}`,
      },
      { first_name: customer.firstName },
    );

    logger.info("Successfully sent order cancellation email");

    return {
      ok: true,
    };
  } catch (error) {
    logger.error(
      error,
      `Failed to cancel customer subscription ${customer.id}`,
    );

    return {
      ok: false,
      message: "Unable to cancel subscription. Please try again later.",
    };
  }
}
