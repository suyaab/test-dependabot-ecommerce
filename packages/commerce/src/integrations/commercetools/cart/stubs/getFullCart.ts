import { Cart as CTCart } from "@commercetools/platform-sdk";

const createCartResponse: CTCart = {
  id: "fake-create-cart-id",
  version: 1,
  createdAt: "test-date",
  lastModifiedAt: "test-date",
  lastModifiedBy: {
    clientId: "fake-client-id",
  },
  createdBy: {
    clientId: "fake-client-id",
  },
  lineItems: [],
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
  custom: {
    type: {
      typeId: "type",
      id: "b9664f0a-f7f3-46e4-95fc-066477788a1b",
    },
    fields: {
      firstName: "test-user",
      lastName: "test-user",
      marketingConsent: true,
      phone: "123456789",
    },
  },
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
  customerEmail: "test@test.com",
  shippingAddress: {
    firstName: "test-first-name",
    lastName: "test",
    streetName: "Mayfair Ave",
    streetNumber: "123",
    additionalStreetInfo: "Apt 55A",
    postalCode: "87987",
    city: "Ilford",
    country: "GB",
    phone: "9296285542",
    state: "MN",
  },
  billingAddress: {
    firstName: "test-first-name",
    lastName: "test",
    streetName: "Mayfair Ave Apt 55A",
    streetNumber: "123",
    additionalStreetInfo: "",
    postalCode: "87987",
    city: "Ilford",
    country: "GB",
    state: "MN",
  },
};

export default createCartResponse;
