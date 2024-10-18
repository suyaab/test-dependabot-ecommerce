"use server";

import { cookies, headers } from "next/headers";

import { CartService, ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";

import { CookieKey } from "~/app/actions/constants/CookieKey";
import ActionException from "../ActionException";

export async function addToCart(sku: string) {
  const logger = getLogger({
    prefix: "web:actions:addToCart",
    headers: headers(),
  });

  try {
    const cartService: CartService = ServiceLocator.getCartService();

    const createdCart = await cartService.createCart({
      currency: "USD",
      countryCode: "US",
      lineItems: [{ sku, quantity: 1 }],
    });

    if (createdCart == null) {
      throw new Error("Failed to create cart");
    }

    logger.info(createdCart, "Created new cart action");

    cookies().set(CookieKey.CART_ID, createdCart.id, {
      maxAge: 24 * 60 * 60, // one day
      secure: true,
    });
    logger.info("Set new cart ID cookie");
  } catch (error) {
    logger.error(error, `Failed to add product ${sku} to cart`);

    throw new ActionException(`Failed to add product ${sku} to cart`, {
      cause: error,
    });
  }
}
