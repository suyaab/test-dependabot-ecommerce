"use server";

import { redirect } from "next/navigation";

import { ServiceLocator as AuthServiceLocator } from "@ecommerce/auth";
import { ServiceLocator as FinanceServiceLocator } from "@ecommerce/finance";
import { getLogger } from "@ecommerce/logger";

import getIpAddress from "~/lib/getIpAddress";

// TODO: refactor to best practices
export async function updateCheckoutSessionCustomer(checkoutSessionId: string) {
  const logger = getLogger({
    prefix: "web:account:updateCheckoutSessionCustomer",
  });
  const authService = AuthServiceLocator.getAuthService();
  const customer = await authService.getAuthenticatedCustomer();

  if (customer == null) {
    logger.error(
      "There was an attempt to update customer info without being logged in!",
    );
    redirect("/api/auth/login");
  }

  logger.child({ customerId: customer?.id });

  try {
    const ip = getIpAddress();
    const checkoutService = FinanceServiceLocator.getCheckoutService();

    await checkoutService.updateCheckoutSessionCustomer(
      checkoutSessionId,
      ip,
      customer.firstName,
      customer.lastName,
      customer.email,
      customer.phone ?? "",
    );

    logger.info("Updated billing customer of checkout");
  } catch (error) {
    logger.error(error, `Failed to update customer information ${customer.id}`);

    throw new Error(
      `Failed to update billing customer of checkout ${checkoutSessionId}`,
      {
        cause: error,
      },
    );
  }
}
