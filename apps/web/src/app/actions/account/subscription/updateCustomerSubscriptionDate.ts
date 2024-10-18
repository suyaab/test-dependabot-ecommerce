"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ServiceLocator as AuthServiceLocator } from "@ecommerce/auth";
import { ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";

import { ActionResponse } from "~/app/actions/types";
import ActionException from "../../ActionException";

export async function updateCustomerSubscriptionDate(
  newDate: Date,
): Promise<ActionResponse> {
  const logger = getLogger({
    prefix: "web:actions:updateCustomerSubscriptionDate",
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
    logger.info(
      `Attempting to update customer subscription date to ${newDate.toISOString()}`,
    );

    const subscriptionService = ServiceLocator.getSubscriptionService();
    await subscriptionService.updateSubscriptionDate(
      customer.id,
      customer.version,
      newDate,
    );

    logger.info(
      `Successfully updated customer subscription date to ${newDate.toISOString()}`,
    );

    return {
      ok: true,
    };
  } catch (error) {
    logger.error(
      error,
      `Failed to update customer subscription date ${customer.id}`,
    );

    return {
      ok: false,
      message: "Unable to update subscription date. Please try again later.",
    };
  }
}
