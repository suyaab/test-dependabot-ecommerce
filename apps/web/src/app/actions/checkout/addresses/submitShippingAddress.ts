"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { ServiceLocator } from "@ecommerce/commerce";
import { ServiceLocator as SLFinance } from "@ecommerce/finance";
import { getLogger } from "@ecommerce/logger";
import { AddressFormData, addressSchema } from "@ecommerce/utils";

import { ActionResponse } from "~/app/actions/types";

export async function submitShippingAddress(
  cartId: string,
  cartVersion: number,
  checkoutSessionId: string,
  shippingAddressData: {
    firstName?: string;
    lastName?: string;
  } & AddressFormData,
): Promise<ActionResponse> {
  const logger = getLogger({
    prefix: "web:checkout:submitShippingAddress",
    headers: headers(),
  });

  try {
    logger.info(
      {
        cartId,
        checkoutSessionId,
        shippingAddressData,
      },
      "Submitting shipping address",
    );

    const parse = addressSchema.safeParse(shippingAddressData);

    if (!parse.success) {
      logger.error(
        { errors: parse.error.errors },
        "Shipping address schema validation failed",
      );

      return {
        ok: false,
        message:
          "The shipping address provided is invalid, please check the form and try again.",
      };
    }

    const cartService = ServiceLocator.getCartService();

    const updatedCartShipping = await cartService.updateCartShippingAddress(
      cartId,
      cartVersion,
      parse.data,
    );

    logger.info(
      { updatedCartShipping },
      `Updated cart ${cartId} shipping address`,
    );

    const checkoutService = SLFinance.getCheckoutService();

    const isAuthorizationUpdated = await checkoutService.updateAuthorizedPrice(
      updatedCartShipping.currency,
      updatedCartShipping.totalPrice,
      checkoutSessionId,
    );

    if (!isAuthorizationUpdated) {
      throw new Error(`Failed to update authorized price for cart ${cartId}`);
    }

    logger.info("Completed submitShippingAddresses action");

    return {
      ok: true,
    };
  } catch (error) {
    logger.error(error, "Failed to submit shipping address");

    if (
      error instanceof Error &&
      error.message ===
        "Tax calculation cannot be determined. Zip is not valid for the state."
    ) {
      return {
        ok: false,
        message:
          "Sorry, we're unable to validate your address. Please try modifying your address or contact customer service for assistance.",
      };
    }

    return {
      ok: false,
      message:
        "An unexpected error occurred while saving your address. Please try again later.",
    };
  } finally {
    revalidatePath("/checkout");
  }
}
