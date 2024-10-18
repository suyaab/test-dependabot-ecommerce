import { Cart as CTCart } from "@commercetools/platform-sdk";

const updateCartPaymentInfoResponse: CTCart = {
  id: "fake-cart-id",
  version: 2,
  createdAt: "2024-03-12T20:51:51.188Z",
  lastModifiedAt: "2024-03-12T20:51:51.188Z",
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
    centAmount: 0,
    fractionDigits: 2,
  },
  taxedPrice: {
    totalNet: {
      type: "centPrecision",
      currencyCode: "USD",
      centAmount: 0,
      fractionDigits: 2,
    },
    totalGross: {
      type: "centPrecision",
      currencyCode: "USD",
      centAmount: 0,
      fractionDigits: 2,
    },
    taxPortions: [],
    totalTax: {
      type: "centPrecision",
      currencyCode: "USD",
      centAmount: 0,
      fractionDigits: 2,
    },
  },
  shippingMode: "Single",
  shippingAddress: {
    firstName: "Jane",
    lastName: "Doe",
    streetNumber: "",
    streetName: "9509 Alameda lane",
    city: "Ilford",
    state: "CA",
    postalCode: "12345",
    country: "GB",
  },
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
  paymentInfo: {
    payments: [
      { typeId: "payment", id: "fake-payment-id-1" },
      { typeId: "payment", id: "fake-payment-id-2" },
    ],
  },
};

export default updateCartPaymentInfoResponse;
