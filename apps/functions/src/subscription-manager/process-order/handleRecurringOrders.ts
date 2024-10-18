import crypto from "crypto";

import {
  CartDraft,
  Customer,
  Order,
  ServiceLocator,
  Subscription,
} from "@ecommerce/commerce";
import { ServiceLocator as SLFinance } from "@ecommerce/finance";
import { Logger } from "@ecommerce/logger";
import {
  addressCountryCodeSchema,
  COUNTRY_CURRENCY_MAP,
  RecurPayAuthException,
  SMHandlerException,
} from "@ecommerce/utils";

export async function handleRecurringOrders(
  logger: Logger,
  customer: Customer,
  subscription: Subscription,
): Promise<Order> {
  const cartService = ServiceLocator.getCartService();
  const paymentService = ServiceLocator.getPaymentService();
  const orderService = ServiceLocator.getOrderService();
  const paymentProcessingService = SLFinance.getPaymentGateway();
  const subscriptionService = ServiceLocator.getSubscriptionService();
  const productService = ServiceLocator.getProductService();

  try {
    logger.info({ subscription }, "Handling a recurring order");

    if (subscription.paymentMethodId == null) {
      throw new RecurPayAuthException("No saved payment method found");
    }

    const countryCode = customer.billingAddress?.countryCode;

    const currency = COUNTRY_CURRENCY_MAP.get(
      addressCountryCodeSchema.parse(countryCode),
    );

    if (currency == null) {
      throw new Error(
        `Invalid country code for recurring order ${countryCode}`,
      );
    }

    const currentCountryCode = addressCountryCodeSchema.parse(
      customer.billingAddress?.countryCode,
    );

    let newCart;
    if (customer.shippingAddress == null) {
      throw new Error("Customer does not have a shipping address");
    }
    if (subscription.nextPlanCartId != null) {
      const frozenCart = await cartService.getCart(subscription.nextPlanCartId);
      if (frozenCart == null) {
        throw new Error(
          `Unable to retrieve frozen cart with ID: ${subscription.nextPlanCartId}`,
        );
      }

      const cartWithBilling = await cartService.updateCartBillingAddress(
        frozenCart.id,
        frozenCart.version,
        customer.billingAddress ?? customer.shippingAddress,
      );
      logger.info(
        { cartWithBilling },
        "Successfully updated frozen cart billing address.",
      );

      newCart = await cartService.updateCartShippingAddress(
        cartWithBilling.id,
        cartWithBilling.version,
        customer.shippingAddress,
        false,
      );
      logger.info(
        { newCart },
        "Successfully updated frozen cart shipping address.",
      );
    } else {
      // TODO: we need to support the nextPlan without nextPlanCartId for
      // customers that repurchased before the nextPlanCartId was implemented
      const renewalProduct =
        subscription.nextPlan != null
          ? await productService.getProduct(subscription.nextPlan)
          : await productService.getProduct(subscription.subscription);

      if (renewalProduct == null) {
        throw new Error("Unable to retrieve subscription product");
      }
      logger.info({ renewalProduct }, "Retrieved renewal product");

      const cartDraft: CartDraft = {
        billingAddress: customer.billingAddress,
        countryCode: currentCountryCode,
        customerEmail: customer.email,
        customerId: customer.id,
        currency: currency,
        lineItems: [
          {
            sku: renewalProduct.sku,
            quantity: 1,
          },
        ],
        shippingAddress: customer.shippingAddress,
      };

      logger.info({ cartDraft }, "Cart draft");

      newCart = await cartService.createCart(cartDraft);

      if (newCart == null) {
        throw new Error("Unable to create new cart");
      }
      logger.info({ newCart }, "Created new cart");
    }

    logger.info(
      { id: subscription.paymentMethodId },
      "Retrieved default payment method id",
    );

    if (newCart.lineItems[0]?.totalGross == null) {
      throw new Error(`Cart ${newCart.id} does not have a total gross price`);
    }

    const totalPrice = newCart.totalPrice;
    const orderNumber = orderService.generateOrderNumber();
    logger.info({ orderNumber }, "Order Number");

    const recurringPayment =
      await paymentProcessingService.authorizeRecurringPayment(
        subscription.paymentMethodId,
        totalPrice,
        currency,
        orderNumber,
      );
    logger.info(
      { id: recurringPayment.id, status: recurringPayment.paymentStatus },
      "Authorized new payment",
    );

    const paymentReference = await paymentService.createPaymentReference(
      recurringPayment,
      customer.id,
      [
        {
          type: "Authorization",
          state: "Success",
          amount: {
            centAmount: newCart.lineItems[0].totalGross,
            currencyCode: recurringPayment.currency,
          },
          interactionId: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ],
    );

    if (paymentReference.id == null) {
      throw new Error("Unable to add payment info to Commercetools");
    }

    logger.info({ id: paymentReference.id }, "Created new Payment Reference");

    const cartWithPaymentId = await cartService.updateCartPaymentInfo(
      newCart.id,
      newCart.version,
      paymentReference.id,
    );

    if (cartWithPaymentId.id == null) {
      throw new Error("Unable to update cart with payment id");
    }
    logger.info({ cartWithPaymentId }, "Updated cart with payment id");

    const newOrder = await orderService.createOrderFromCart(
      cartWithPaymentId.id,
      cartWithPaymentId.version,
      orderNumber,
    );

    if (newOrder.id == null) {
      throw new Error("Unable to create new recurring order");
    }

    logger.info({ newOrder }, "Created new recurring order");

    const updatedSubscription = await subscriptionService.renewSubscription(
      customer.id,
      customer.version,
      newOrder.orderNumber,
    );

    if (updatedSubscription == null) {
      throw new Error("Unable to update subscription");
    }

    logger.info({ updatedSubscription }, "Updated subscription");

    return newOrder;
  } catch (error) {
    if (error instanceof RecurPayAuthException) {
      throw new RecurPayAuthException("Failed to authorize recurring order", {
        cause: error,
      });
    } else {
      throw new SMHandlerException("Failed to process recurring order", {
        cause: error,
      });
    }
  }
}
