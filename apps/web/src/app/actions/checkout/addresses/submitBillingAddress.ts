"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { ServiceLocator } from "@ecommerce/commerce";
import { ServiceLocator as SLFinance } from "@ecommerce/finance";
import { getLogger } from "@ecommerce/logger";
import { Address, addressSchema } from "@ecommerce/utils";

import { ActionResponse } from "~/app/actions/types";

export async function submitBillingAddress(
  cartId: string,
  cartVersion: number,
  checkoutSessionId: string,
  billingAddressData: Address,
): Promise<ActionResponse> {
  const logger = getLogger({
    prefix: "web:actions:submitBillingAddress",
    headers: headers(),
  });

  try {
    logger.info(
      {
        cartId,
        checkoutSessionId,
        billingAddressData,
      },
      "Submitting billing address",
    );

    const parse = addressSchema.safeParse(billingAddressData);

    if (!parse.success) {
      logger.error(
        { errors: parse.error.errors },
        "Billing address schema validation failed",
      );

      return {
        ok: false,
        message:
          "The billing address provided is invalid, please check the form and try again.",
      };
    }

    const checkoutService = SLFinance.getCheckoutService();

    await checkoutService.updateCheckoutSessionAddress(
      checkoutSessionId,
      parse.data,
    );

    const cartService = ServiceLocator.getCartService();

    const updatedCartBilling = await cartService.updateCartBillingAddress(
      cartId,
      cartVersion,
      parse.data,
    );

    logger.info(
      { updatedCartBilling },
      `Updated cart ${cartId} billing address`,
    );

    logger.info("Updated checkout session address");

    return {
      ok: true,
    };
  } catch (error) {
    logger.error(error, "Failed to submit billing address");

    return {
      ok: false,
      message:
        "An unexpected error occurred while saving your billing address, please try again.",
    };
  } finally {
    revalidatePath("/checkout");
  }
}
