"use server";

import { cookies, headers } from "next/headers";

import { CartService, ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";

import { CookieKey } from "~/app/actions/constants/CookieKey";

export async function getAccountCart() {
  const logger = getLogger({
    prefix: "web:actions:addToCartAccountManagement",
    headers: headers(),
  });
  const cartService: CartService = ServiceLocator.getCartService();
  const cartId = cookies().get(CookieKey.CART_ID_AM)?.value;

  if (cartId == null) {
    logger.info("No cart ID found");
    return undefined;
  }
  logger.info({ cartId }, "Found Account Management cart ID");

  const cart = await cartService.getCart(cartId);
  if (cart == null) {
    throw new Error("Failed to create cart in Account Management");
  }
  return cart;
}
