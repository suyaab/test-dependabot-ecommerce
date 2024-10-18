"use server";

import { cookies } from "next/headers";

import { Cart, Product, ServiceLocator } from "@ecommerce/commerce";
import logger from "@ecommerce/logger";

import { CookieKey } from "~/app/actions/constants/CookieKey";

// TODO: Figure out if we can forgo saving cart ID in cookie
export async function getPromoCart(product: Product): Promise<Cart> {
  const cartService = ServiceLocator.getCartService();

  logger.info("Getting promotional cart action");

  const cartId = cookies().get(CookieKey.PROMOTIONAL_CART_ID)?.value;

  if (cartId == null) {
    logger.info("No promotional cart Id found, creating one");

    return await cartService.createCart({
      currency: "USD", // this isn't relevant as these are only $0 orders
      countryCode: "US",
      lineItems: [{ sku: product.sku, quantity: 1 }],
    });
  }

  const cart = await cartService.getCart(cartId);

  if (cart == null) {
    logger.info("No sample cart Id found, creating one");

    return await cartService.createCart({
      currency: "USD",
      countryCode: "US",
      lineItems: [{ sku: product.sku, quantity: 1 }],
    });
  }

  if (cart.lineItems[0]?.product.sku !== product.sku) {
    logger.info(
      "Promo cart Id found, but product doesn't match, creating new one",
    );

    return await cartService.createCart({
      currency: "USD",
      countryCode: "US",
      lineItems: [{ sku: product.sku, quantity: 1 }],
    });
  }

  return cart;
}

export async function setSampleCartCookie(id: string) {
  cookies().set(CookieKey.PROMOTIONAL_CART_ID, id, {
    maxAge: 12 * 60 * 60, // 12 hours
    secure: true,
  });

  logger.info({ id }, "Set Sample Cart Id cookie");

  return Promise.resolve();
}

export async function deleteCartSampleIdCookie() {
  cookies().delete(CookieKey.PROMOTIONAL_CART_ID);

  logger.info("Deleted Sample Cart Id cookie");

  return Promise.resolve();
}
