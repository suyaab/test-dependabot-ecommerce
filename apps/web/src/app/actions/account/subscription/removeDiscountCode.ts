"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { CartService, ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";

import ActionException from "../../ActionException";

export async function removeDiscountCode(
  cartId: string,
  cartVersion: number,
  discountCodeId: string,
  productId: string,
): Promise<void> {
  const logger = getLogger({
    prefix: "web:actions:removeDiscountCodeAccountManagement",
    headers: headers(),
  });

  try {
    logger.info("Removing discount code");
    const cartService: CartService = ServiceLocator.getCartService();

    await cartService.removeDiscountCodeFromCart(
      cartId,
      cartVersion,
      discountCodeId,
    );
  } catch (error) {
    logger.error(error, "Error occurred during removing the discount code.");

    throw new ActionException(
      "Error occurred during removing the discount code.",
      {
        cause: error,
      },
    );
  } finally {
    revalidatePath(
      `/account/subscription/update/confirm?productId=${productId}`,
    );
  }
}
