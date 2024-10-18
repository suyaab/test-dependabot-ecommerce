import { Order } from "@ecommerce/commerce";

const mockOrder: Order = {
  id: "mock-order-id",
  version: 1,
  discountCodeId: "mock-discount-code-id",
  orderNumber: "USL11111111",
  createdAt: new Date().toISOString(),
  customerEmail: "paddingtonbear6335@gmail.com",
  customerId: "mock-customer-id",
  status: "Open",
  shipmentStatus: "Shipped",
  totalPrice: 3900,
  totalNet: 3250,
  totalGross: 3900,
  totalTax: 650,
  billingAddress: {
    firstName: "Jane",
    lastName: "Doe",
    addressLine1: "123 Mayfair Ave Apt 55A",
    addressLine2: "",
    state: "CA",
    city: "Ilford",
    postalCode: "02145",
    countryCode: "US",
  },
  shippingAddress: {
    firstName: "Paddington",
    lastName: "Bear",
    addressLine1: "123 Mayfair Ave",
    addressLine2: "Apt 55A",
    state: "CA",
    city: "Alameda",
    postalCode: "02145",
    countryCode: "US",
  },
  shippingMethod: "UPS",
  currencyCode: "USD",
  lineItems: [
    {
      product: {
        id: "mock-line-item-id",
        sku: "FAKE-SKU",
        type: "subscription",
      },
      name: "Mock Line Item!",
      quantity: 1,
      price: 3900,
      taxRate: 0.2,
      totalNet: 3900,
      totalDiscount: 3900,
      totalGross: 3900,
      taxAmount: 0,
    },
  ],
};

export default mockOrder;
