"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { DiscountCodeInfo, ServiceLocator } from "@ecommerce/commerce";
import { ServiceLocator as SLFinance } from "@ecommerce/finance";
import { getLogger } from "@ecommerce/logger";

import ActionException from "../../ActionException";

export async function applyDiscountCode(
  cartId: string,
  cartVersion: number,
  checkoutSessionId: string,
  code: string,
): Promise<DiscountCodeInfo["state"] | undefined> {
  const logger = getLogger({
    prefix: "web:actions:applyDiscountCode",
    headers: headers(),
  });

  try {
    logger.info(
      `Attempting to apply discount code [${code}] to cart (ID: ${cartId})`,
    );

    const cartService = ServiceLocator.getCartService();
    const checkoutSession = SLFinance.getCheckoutService();

    const discountCode = await cartService.getDiscountCodeByName(code);

    if (discountCode == null || discountCode.isActive === false) {
      return;
    }

    const [state, newCart] = await cartService.addDiscountCodeToCart(
      cartId,
      cartVersion,
      code,
    );

    if (state === "MatchesCart") {
      const isAuthorizationUpdated =
        await checkoutSession.updateAuthorizedPrice(
          newCart.currency,
          newCart.totalPrice,
          checkoutSessionId,
        );
      if (!isAuthorizationUpdated) {
        throw new Error(`Failed to update authorized price for cart ${cartId}`);
      }
    }

    return state;
  } catch (error) {
    throw new ActionException(
      "Error occurred during applying the discount code.",
      {
        cause: error,
      },
    );
  } finally {
    revalidatePath("/checkout");
  }
}
