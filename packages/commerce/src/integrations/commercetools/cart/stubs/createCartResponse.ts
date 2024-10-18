import { Cart as CTCart } from "@commercetools/platform-sdk";

import { mockLineItems } from "./mockLineItems";

const createCartResponse: CTCart = {
  id: "fake-create-cart-id",
  version: 1,
  createdAt: "2024-03-08T00:47:19.471Z",
  lastModifiedAt: "2024-03-08T00:47:19.471Z",
  lastModifiedBy: {
    clientId: "fake-client-id",
  },
  createdBy: {
    clientId: "fake-client-id",
  },
  lineItems: mockLineItems,
  cartState: "Active",
  totalPrice: {
    type: "centPrecision",
    currencyCode: "USD",
    centAmount: 8900,
    fractionDigits: 2,
  },
  country: "US",
  shippingMode: "Single",
  shipping: [],
  customLineItems: [],
  discountCodes: [],
  directDiscounts: [],
  inventoryMode: "None",
  taxMode: "Platform",
  taxRoundingMode: "HalfEven",
  taxCalculationMode: "LineItemLevel",
  refusedGifts: [],
  origin: "Customer",
  itemShippingAddresses: [],
  totalLineItemQuantity: 1,
};

export default createCartResponse;
