"use server";

import { cookies, headers } from "next/headers";

import { ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";

import { CookieKey } from "~/app/actions/constants/CookieKey";
import ActionException from "../ActionException";

export async function getCart() {
  const logger = getLogger({
    prefix: "web:actions:getCart",
    headers: headers(),
  });

  try {
    logger.info("Getting cart action");

    const cartId = cookies().get(CookieKey.CART_ID)?.value;

    if (cartId == null) {
      logger.info("No cart ID found");
      return undefined;
    }

    logger.info({ cartId }, "Found cart ID");

    const cartService = ServiceLocator.getCartService();

    return await cartService.getCart(cartId);
  } catch (error) {
    logger.error(error, "Error getting cart from cookie");
    throw new ActionException("Error getting cart from cookie", {
      cause: error,
    });
  }
}

export async function deleteCartIdCookie() {
  const logger = getLogger({
    prefix: "web:actions:deleteCartIdCookie",
    headers: headers(),
  });

  cookies().delete(CookieKey.CART_ID);

  logger.info("Deleted cart ID cookie");

  return Promise.resolve();
}
