"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { CartService, ServiceLocator } from "@ecommerce/commerce";
import { ServiceLocator as SLFinance } from "@ecommerce/finance";
import { getLogger } from "@ecommerce/logger";

import ActionException from "../../ActionException";

export async function removeDiscountCode(
  cartId: string,
  cartVersion: number,
  checkoutSessionId: string,
  discountCodeId: string,
): Promise<void> {
  const logger = getLogger({
    prefix: "web:actions:removeDiscountCode",
    headers: headers(),
  });

  try {
    logger.info("Removing discount code");
    const cartService: CartService = ServiceLocator.getCartService();

    const newCart = await cartService.removeDiscountCodeFromCart(
      cartId,
      cartVersion,
      discountCodeId,
    );

    const checkoutSession = SLFinance.getCheckoutService();

    const isAuthorizationUpdated = await checkoutSession.updateAuthorizedPrice(
      newCart.currency,
      newCart.totalPrice,
      checkoutSessionId,
    );

    if (!isAuthorizationUpdated) {
      throw new Error(`Failed to update authorized price for cart ${cartId}`);
    }
  } catch (error) {
    logger.error(error, "Error occurred during removing the discount code.");

    throw new ActionException(
      "Error occurred during removing the discount code.",
      {
        cause: error,
      },
    );
  } finally {
    revalidatePath("/checkout");
  }
}
