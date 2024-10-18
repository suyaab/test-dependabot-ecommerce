"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ServiceLocator as AuthServiceLocator } from "@ecommerce/auth";
import { ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";

import ActionException from "../../ActionException";
import { ActionResponse } from "../../types";

export async function updateCustomerSubscription(
  cartId: string,
  cartVersion: number,
  productId: string,
): Promise<ActionResponse> {
  const logger = getLogger({
    prefix: "web:actions:updateCustomerSubscription",
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

  logger.child({ customerId: customer?.id });

  if (customer == null) {
    logger.error(
      "There was an attempt to reactivate subscription without being logged in!",
    );
    redirect("/api/auth/login");
  }

  try {
    logger.info("Attempting to reactivate customer subscription");

    const cartService = ServiceLocator.getCartService();

    const cartWithUpdatedBillingAddress =
      await cartService.updateCartBillingAddress(
        cartId,
        cartVersion,
        customer.billingAddress ?? customer.shippingAddress!,
      );
    const frozenCart = await cartService.freezeCart(
      cartWithUpdatedBillingAddress.id,
      cartWithUpdatedBillingAddress.version,
    );

    if (frozenCart == null) {
      throw new Error(`Frozen Cart is null for cartId: ${cartId}`);
    }

    const subscriptionService = ServiceLocator.getSubscriptionService();
    await subscriptionService.updateSubscription(
      customer.id,
      customer.version,
      frozenCart.id,
      productId,
    );

    logger.info("Successfully reactivated customer subscription");

    return {
      ok: true,
    };
  } catch (error) {
    logger.error(
      error,
      `Failed to reactivate customer subscription ${customer?.id}`,
    );

    return {
      ok: false,
      message: "Unable to reactivate subscription. Please try again later.",
    };
  }
}
