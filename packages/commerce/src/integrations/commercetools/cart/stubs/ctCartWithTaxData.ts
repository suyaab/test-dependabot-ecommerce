import { Cart as CTCart } from "@commercetools/platform-sdk";

import { mockLineItems } from "./mockLineItems";

const ctCartWithTaxData: CTCart = {
  id: "fake-cart-id",
  version: 2,
  createdAt: "2024-06-17T17:16:09.712Z",
  lastModifiedAt: "2024-06-17T17:21:06.778Z",
  lastModifiedBy: {
    clientId: "fake-id",
  },
  createdBy: {
    clientId: "fake-id",
  },
  customerId: "fake-id",
  customerEmail: "test-email@test.com",
  lineItems: mockLineItems,
  cartState: "Ordered",
  totalPrice: {
    type: "centPrecision",
    currencyCode: "USD",
    centAmount: 30000,
    fractionDigits: 2,
  },
  taxedPrice: {
    totalNet: {
      type: "centPrecision",
      currencyCode: "USD",
      centAmount: 30000,
      fractionDigits: 2,
    },
    totalGross: {
      type: "centPrecision",
      currencyCode: "USD",
      centAmount: 32100,
      fractionDigits: 2,
    },
    taxPortions: [
      {
        rate: 0.01,
        amount: {
          type: "centPrecision",
          currencyCode: "USD",
          centAmount: 300,
          fractionDigits: 2,
        },
        name: "wv city tax",
      },
      {
        rate: 0.06,
        amount: {
          type: "centPrecision",
          currencyCode: "USD",
          centAmount: 1800,
          fractionDigits: 2,
        },
        name: "wv state tax",
      },
    ],
    totalTax: {
      type: "centPrecision",
      currencyCode: "USD",
      centAmount: 2100,
      fractionDigits: 2,
    },
  },
  country: "US",
  taxedShippingPrice: {
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
    taxPortions: [
      {
        rate: 0.01,
        amount: {
          type: "centPrecision",
          currencyCode: "USD",
          centAmount: 0,
          fractionDigits: 2,
        },
        name: "wv city tax",
      },
      {
        rate: 0.06,
        amount: {
          type: "centPrecision",
          currencyCode: "USD",
          centAmount: 0,
          fractionDigits: 2,
        },
        name: "wv state tax",
      },
    ],
    totalTax: {
      type: "centPrecision",
      currencyCode: "USD",
      centAmount: 0,
      fractionDigits: 2,
    },
  },
  shippingMode: "Single",
  shippingInfo: {
    shippingMethodName: "UPS",
    price: {
      type: "centPrecision",
      currencyCode: "USD",
      centAmount: 0,
      fractionDigits: 2,
    },
    shippingRate: {
      price: {
        type: "centPrecision",
        currencyCode: "USD",
        centAmount: 0,
        fractionDigits: 2,
      },
      tiers: [],
    },
    taxRate: {
      name: "avaTaxSDK",
      amount: 0.07,
      includedInPrice: false,
      country: "US",
      subRates: [
        {
          name: "wv state tax",
          amount: 0.06,
        },
        {
          name: "wv city tax",
          amount: 0.01,
        },
      ],
    },
    deliveries: [],
    shippingMethod: {
      typeId: "shipping-method",
      id: "fake-id",
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

      totalTax: {
        type: "centPrecision",
        currencyCode: "USD",
        centAmount: 0,
        fractionDigits: 2,
      },
    },
    shippingMethodState: "MatchesCart",
  },
  shippingAddress: {
    firstName: "Jane",
    lastName: "Doe",
    streetName: "9509 Alameda lane",
    postalCode: "25309",
    city: "Ilford",
    state: "CA",
    country: "US",
  },
  shipping: [],
  customLineItems: [],
  discountCodes: [],
  directDiscounts: [],
  custom: {
    type: {
      typeId: "type",
      id: "fake-id",
    },
    fields: {
      firstName: "test-user-first-name",
      lastName: "test-user-last-name",
      phone: "1234567890",
      marketingConsent: false,
    },
  },
  paymentInfo: {
    payments: [
      {
        typeId: "payment",
        id: "fake-id",
      },
    ],
  },
  inventoryMode: "None",
  taxMode: "External",
  taxRoundingMode: "HalfEven",
  taxCalculationMode: "LineItemLevel",
  refusedGifts: [],
  origin: "Customer",
  billingAddress: {
    firstName: "Jane",
    lastName: "Doe",
    streetName: "9509 Alameda lane",
    postalCode: "25309",
    city: "Ilford",
    state: "CA",
    country: "US",
  },
  itemShippingAddresses: [],
  totalLineItemQuantity: 1,
};

export default ctCartWithTaxData;
