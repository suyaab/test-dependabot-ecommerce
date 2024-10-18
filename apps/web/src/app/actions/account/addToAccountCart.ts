"use server";

import { cookies, headers } from "next/headers";

import {
  CartDraft,
  CartService,
  Customer,
  ServiceLocator,
} from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";

import { CookieKey } from "~/app/actions/constants/CookieKey";
import ActionException from "../ActionException";

export async function addToAccountCart(sku: string, customer: Customer) {
  const logger = getLogger({
    prefix: "web:actions:addToAMCart",
    headers: headers(),
  });

  try {
    const cartService: CartService = ServiceLocator.getCartService();

    const cartDraft: CartDraft = {
      billingAddress: customer.billingAddress ?? customer.shippingAddress,
      countryCode: "US",
      customerEmail: customer.email,
      customerId: customer.id,
      currency: "USD",
      lineItems: [
        {
          sku: sku,
          quantity: 1,
        },
      ],
      shippingAddress: customer.shippingAddress,
    };

    const createdCart = await cartService.createCart(cartDraft);

    if (createdCart == null) {
      throw new Error("Failed to create cart");
    }

    logger.info(createdCart, "Created new cart action");

    cookies().set(CookieKey.CART_ID_AM, createdCart.id, {
      maxAge: 24 * 60 * 60, // one day
      secure: true,
    });
    logger.info("Set new cart AM ID cookie");
  } catch (error) {
    logger.error(error, `Failed to add product ${sku} to cart AM`);

    throw new ActionException(`Failed to add product ${sku} to cart AM`, {
      cause: error,
    });
  }
}
