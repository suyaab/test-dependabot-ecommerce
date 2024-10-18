import { Cart as CTCart } from "@commercetools/platform-sdk";

const updateCartContactResponse: CTCart = {
  id: "fake-cart-id",
  version: 1,
  cartState: "Active",
  createdAt: "2024-03-12T20:51:51.188Z",
  lastModifiedAt: "2024-03-12T20:51:51.188Z",
  lastModifiedBy: {
    clientId: "fake-client-id",
  },
  createdBy: {
    clientId: "fake-client-id",
  },
  totalPrice: {
    type: "centPrecision",
    currencyCode: "USD",
    centAmount: 8900,
    fractionDigits: 2,
  },
  lineItems: [],
  customerEmail: "fake@email.com",
  country: "US",
  custom: {
    type: { typeId: "type", id: "b9664f0a-f7f3-46e4-95fc-066477788a1b" },
    fields: {
      firstName: "Jane",
      lastName: "Doe",
      phone: "1112223333",
      marketingConsent: true,
    },
  },
  shippingMode: "Single",
  shipping: [],
  discountCodes: [],
  customLineItems: [],
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

export default updateCartContactResponse;
