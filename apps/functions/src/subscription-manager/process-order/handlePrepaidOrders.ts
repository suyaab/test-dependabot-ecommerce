import { Customer, Order, ServiceLocator } from "@ecommerce/commerce";
import type { Logger } from "@ecommerce/logger";
import { SMHandlerException } from "@ecommerce/utils";

export async function handlePrepaidOrders(
  logger: Logger,
  customer: Customer,
): Promise<Order> {
  const cartService = ServiceLocator.getCartService();
  const orderService = ServiceLocator.getOrderService();
  const subscriptionService = ServiceLocator.getSubscriptionService();

  try {
    logger.info("Handling a prepaid order");

    const newCart = await cartService.createCart({
      currency: "USD",
      countryCode: "US",
      customerEmail: customer.email,
      lineItems: [
        // TODO: create `getFulfillmentProduct` function or something better than this
        { sku: "USLG02BF", quantity: 1 },
      ],
      customerId: customer.id,
      billingAddress: customer.billingAddress,
      shippingAddress: customer.shippingAddress,
    });

    logger.info({ newCart }, "Created new cart");

    const orderNumber = orderService.generateOrderNumber();
    const newOrder = await orderService.createOrderFromCart(
      newCart.id,
      newCart.version,
      orderNumber,
    );

    logger.info({ newOrder }, "Placed new order");

    const updatedSubscription = await subscriptionService.fulfillSubscription(
      customer.id,
      customer.version,
    );

    if (updatedSubscription == null) {
      throw new Error("Unable to update subscription");
    }

    logger.info({ updatedSubscription }, "Updated Subscription");

    return newOrder;
  } catch (error) {
    throw new SMHandlerException("Failed to process prepaid order", {
      cause: error,
    });
  }
}
