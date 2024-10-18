import { Cart } from "@ecommerce/commerce";

export const mockCart = {
  id: "fake-cart-id",
  currency: "USD",
  version: 1,
  isActive: true,
  totalPrice: 89,
  countryCode: "US",
  lineItems: [
    {
      product: {
        id: "fake-product-id",
        sku: "fake-product-sku",
      },
      name: "fake-product-name",
      price: 8900,
      quantity: 1,
      totalNet: 8900,
      totalDiscount: 0,
      taxRate: 0,
    },
  ],
  contactInfo: undefined,
  shippingAddress: undefined,
  billingAddress: undefined,
  payments: undefined,
} as Cart;
