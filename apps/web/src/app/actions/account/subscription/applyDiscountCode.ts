"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { DiscountCodeInfo, ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";

import ActionException from "../../ActionException";

export async function applyDiscountCode(
  cartId: string,
  cartVersion: number,
  code: string,
  productId: string,
): Promise<DiscountCodeInfo["state"] | undefined> {
  const logger = getLogger({
    prefix: "web:actions:applyDiscountCodeAccountManagement",
    headers: headers(),
  });

  try {
    logger.info(
      `Attempting to apply discount code [${code}] to cart (ID: ${cartId})`,
    );

    const cartService = ServiceLocator.getCartService();

    const discountCode = await cartService.getDiscountCodeByName(code);

    if (discountCode == null || discountCode.isActive === false) {
      return;
    }

    const [state] = await cartService.addDiscountCodeToCart(
      cartId,
      cartVersion,
      code,
    );
    return state;
  } catch (error) {
    throw new ActionException(
      "Error occurred during applying the discount code.",
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
