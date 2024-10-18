"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ServiceLocator as AuthServiceLocator } from "@ecommerce/auth";
import { ServiceLocator, SubscriptionStatus } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";

import { ActionResponse } from "~/app/actions/types";

/**
 * Updates the subscription status of a customer, e.g. "paused".
 * @param subscriptionStatus - The new subscription status.
 * @returns A Promise that resolves to an ActionResponse object.
 */
export async function updateCustomerSubscriptionStatus(
  subscriptionStatus: SubscriptionStatus,
): Promise<ActionResponse> {
  const logger = getLogger({
    prefix: "web:account:updateCustomerSubscriptionStatus",
  });

  const authService = AuthServiceLocator.getAuthService();
  const customer = await authService.getAuthenticatedCustomer();

  if (customer == null) {
    logger.error(
      `Can not update subscription status to ${subscriptionStatus} without being logged in`,
    );
    redirect("/api/auth/login");
  }

  logger.child({ customerId: customer?.id });

  try {
    logger.info(
      `Attempting to update customer subscription status to ${subscriptionStatus}`,
    );

    const subscriptionService = ServiceLocator.getSubscriptionService();
    await subscriptionService.updateSubscriptionStatus(
      customer.id,
      customer.version,
      subscriptionStatus,
    );

    logger.info(
      `Successfully updated customer subscription status to ${subscriptionStatus}`,
    );

    return {
      ok: true,
    };
  } catch (error) {
    logger.error(
      error,
      `Failed to update customer ${customer.id} subscription status to: ${subscriptionStatus}`,
    );

    return {
      ok: false,
      message: `Unable to update subscription status to ${subscriptionStatus}. Please try again later.`,
    };
  } finally {
    revalidatePath("/account");
    revalidatePath("/account/subscription");
  }
}
