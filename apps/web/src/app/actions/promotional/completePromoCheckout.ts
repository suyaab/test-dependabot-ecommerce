"use server";

import crypto from "crypto";

import { ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";
import { ServiceLocator as MarketingServiceLocator } from "@ecommerce/marketing";
import {
  AddressFormData,
  addressSchema,
  ConvertOrderException,
  CreateCustomerException,
} from "@ecommerce/utils";

import { getFeatureFlag } from "~/lib/feature-flags/server";

export async function completePromoCheckout(
  cartId: string,
  cartVersion: number,
  shippingAddressData: {
    firstName?: string;
    lastName?: string;
  } & AddressFormData,
): Promise<{ ok: true; orderId: string } | { ok: false; message: string }> {
  const logger = getLogger({
    prefix: "web:actions:completePromoCheckout",
  });

  let cart;

  const customerService = ServiceLocator.getCustomerService();
  const orderService = ServiceLocator.getOrderService();
  const subscriptionService = ServiceLocator.getSubscriptionService();

  try {
    logger.info(
      {
        cartId,
        shippingAddressData,
      },
      "Submitting shipping address",
    );

    const parse = addressSchema.safeParse(shippingAddressData);

    if (!parse.success) {
      logger.error(
        { errors: parse.error.errors },
        "Shipping address schema validation failed",
      );

      return {
        ok: false,
        message:
          "The shipping address provided is invalid, please check the form and try again.",
      };
    }

    const cartService = ServiceLocator.getCartService();

    cart = await cartService.updateCartShippingAddress(
      cartId,
      cartVersion,
      parse.data,
    );

    logger.info({ cart }, `Updated cart ${cartId} shipping address`);

    // double check that we aren't checking out with an invalid cart
    if (cart.discountCodes[0]?.state !== "MatchesCart") {
      throw new Error("Invalid promotional code during promotional checkout");
    }

    let externalId;

    cart = await cartService.getCart(cartId);

    if (cart == null) {
      throw new Error(`Cannot find cart ${cartId}`);
    }

    logger.info({ cart }, "Found Cart");

    if (cart.contactInfo == null) {
      throw new Error("Cart has no contact info");
    }

    const marketingService = MarketingServiceLocator.getMarketingService();
    const marketingUser = await marketingService
      .getUser(cart.contactInfo.email)
      .catch((err) => {
        logger.error(
          err,
          "marketingService getUser called failed during promo checkout",
        );
      });

    const brazeEnabled = await getFeatureFlag("DTC_Braze");

    if (marketingUser != null) {
      externalId = marketingUser.externalId;
      logger.info(
        { externalId },
        "Received external ID from Marketing service",
      );
    } else {
      // This technically should never happen but for edge cases and performance testing
      // when we turn off creating a braze user we will need to handle this case
      // If we can't find the user, we'll create a new externalId and merge dupe later
      externalId = crypto.randomUUID();

      if (brazeEnabled) {
        logger.error(
          { externalId, email: cart.contactInfo.email },
          "Failed to get marketing user during checkout processing. Likely DUPE created.",
        );
      }
    }

    const { id: newCustomerId } = await customerService.createCustomerFromCart(
      externalId,
      cart,
    );

    if (newCustomerId == null) {
      throw new CreateCustomerException(
        "Failed to create customer for customer",
        cartId,
        externalId,
      );
    }

    logger.info({ customerId: newCustomerId }, "Created Customer");

    cart = await cartService.updateCartCustomerId(
      cart.id,
      cart.version,
      newCustomerId,
    );

    if (cart.lineItems[0] == null) {
      throw new Error("Cart has no line items");
    }

    logger.info("Updated Cart with Customer Id");

    const orderNumber = orderService.generateOrderNumber();

    logger.info({ orderNumber }, "Creating order from cart");

    const order = await orderService.createOrderFromCart(
      cart.id,
      cart.version,
      orderNumber,
    );

    if (order.id == null) {
      throw new ConvertOrderException(
        `Unable to create order from cart: ${cartId}`,
      );
    }

    if (cart.lineItems[0].product.type === "subscription") {
      await subscriptionService.createSubscription(newCustomerId, 1, {
        subscriptionProduct: cart.lineItems[0].product,
        parentOrderNumber: orderNumber,
      });

      logger.info("Successfully created subscription");
    }

    logger.info({ order }, "Successfully completed completePromoCheckout");

    return {
      ok: true,
      orderId: order.id,
    };
  } catch (error) {
    logger.error(error, "Failed to complete sample checkout");

    return {
      ok: false,
      message:
        "An unexpected error occurred while completing your order. Please try again later.",
    };
  }
}
