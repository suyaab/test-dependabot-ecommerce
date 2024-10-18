"use server";

import { cookies, headers } from "next/headers";

import {
  Cart,
  ServiceLocator as CommerceServiceLocator,
} from "@ecommerce/commerce";
import { ServiceLocator } from "@ecommerce/finance";
import { getLogger } from "@ecommerce/logger";

import ActionException from "~/app/actions/ActionException";
import { CookieKey } from "~/app/actions/constants/CookieKey";

export async function getOrCreateCheckoutSession(cart: Cart) {
  const logger = getLogger({
    prefix: "web:actions:getOrCreateCheckoutSession",
    headers: headers(),
  });

  try {
    const checkoutService = ServiceLocator.getCheckoutService();

    const checkoutSessionId = cookies().get(
      CookieKey.CHECKOUT_SESSION_ID,
    )?.value;

    if (checkoutSessionId != null) {
      const checkoutSession = await checkoutService
        .getCheckoutSession(checkoutSessionId)
        .catch((error: unknown) => {
          logger.debug(
            { error },
            "Failed to retrieve existing checkout session",
          );
          return null;
        });

      logger.info({ checkoutSession }, "Retrieved existing checkout session");

      if (checkoutSession != null && checkoutSession.status !== "failed") {
        return checkoutSession;
      }
    }

    logger.info("Creating a new checkout session");

    const orderService = CommerceServiceLocator.getOrderService();
    const orderNumber = orderService.generateOrderNumber();
    logger.info({ orderNumber }, "Generated order number for checkout session");

    const checkoutSession = await checkoutService.createCheckoutSession(
      orderNumber,
      cart.totalPrice,
      cart.currency,
    );

    logger.info({ checkoutSession }, "Created new checkout session");

    return checkoutSession;
  } catch (error) {
    logger.error(error, "Failed to get or create checkout session");
    throw new ActionException("Failed to get or create checkout session", {
      cause: error,
    });
  }
}

export async function setCheckoutSessionIdCookie(id: string) {
  const logger = getLogger({
    prefix: "web:actions:setCheckoutSessionIdCookie",
    headers: headers(),
  });

  cookies().set(CookieKey.CHECKOUT_SESSION_ID, id, {
    maxAge: 25 * 60, // twenty-five minutes
    secure: true,
  });

  logger.info({ id }, "Set checkout session ID cookie");

  return Promise.resolve();
}

export async function deleteCheckoutSessionIdCookie() {
  const logger = getLogger({
    prefix: "web:actions:deleteCheckoutSessionIdCookie",
    headers: headers(),
  });

  cookies().delete(CookieKey.CHECKOUT_SESSION_ID);

  logger.info("Deleted checkout session ID cookie");

  return Promise.resolve();
}
