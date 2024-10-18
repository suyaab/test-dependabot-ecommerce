import { DynamicData } from "@ecommerce/analytics";
import { Cart, Product } from "@ecommerce/commerce";

export function extractDynamicData(cart: Cart, product: Product): DynamicData {
  if (!cart.lineItems[0]) {
    throw new Error("Cart line item is missing");
  }

  return {
    productName: cart.lineItems[0].name,
    productPrice: product.price.amount,
    productId: product.sku,
    productCurrency: product.price.currency,
  };
}
