import { NextResponse } from "next/server";
import { z } from "zod";

import { ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";
import { addressSchema, SchemaException } from "@ecommerce/utils";

const schema = z.object({
  cartId: z.string(),
  billingAddress: addressSchema,
});

export async function POST(request: Request): Promise<NextResponse> {
  const logger = getLogger({
    prefix: "web:api:apple-pay/update-billing-address",
  });

  try {
    logger.info("Parsing cartId and addresses from body");

    const body = schema.safeParse(await request.json());

    if (!body.success) {
      throw new SchemaException("Invalid Schema", body.error);
    }

    const { cartId, billingAddress } = body.data;

    const cartService = ServiceLocator.getCartService();
    const cart = await cartService.getCart(cartId);

    if (cart == null) {
      throw new Error(`Cannot find cart: ${cartId}`);
    }

    logger.info({ cartId }, "Cart Retrieved");

    const cartWithBillingAddress = await cartService.updateCartBillingAddress(
      cart.id,
      cart.version,
      billingAddress,
    );

    if (cartWithBillingAddress == null) {
      throw new Error(`Unable to update Apple Pay billing address: ${cartId}`);
    }
    logger.info("Updated cart billing address");

    return NextResponse.json(
      {
        status: "success",
        statusCode: 200,
        cartId: cartWithBillingAddress.id,
        version: cartWithBillingAddress.version,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error(
      error,
      "Exception thrown during /apple-pay/update-billing-address",
    );

    return NextResponse.json(
      {
        status: "error",
        statusCode: 500,
        error: {
          timestamp: new Date(),
          path: request.url,
          message: error,
        },
      },
      { status: 500 },
    );
  }
}
