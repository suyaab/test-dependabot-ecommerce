import { DynamicData } from "@ecommerce/analytics";
import { Order } from "@ecommerce/commerce";

export function extractProductInfo(order: Order): DynamicData {
  if (!order.lineItems[0]) {
    throw new Error("Cart line item is missing");
  }

  return {
    productName: order.lineItems[0].name,
    productPrice: order.totalPrice,
    productId: order.lineItems[0].product.sku,
    productCurrency: order.currencyCode,
  };
}
