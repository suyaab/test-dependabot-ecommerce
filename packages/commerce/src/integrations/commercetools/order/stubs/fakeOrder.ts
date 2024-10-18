import { Order, ProductType } from "@commercetools/platform-sdk";

// TODO: create function to generate a fake order
const fakeOrder: Order = {
  id: "fake-order-id",
  version: 1,
  createdAt: "2024-03-05T05:54:45.077Z",
  lastModifiedAt: "2024-03-05T05:54:45.077Z",
  lastModifiedBy: {
    clientId: "fake-client-id",
  },
  createdBy: {
    clientId: "fake-created-by-id",
  },
  orderNumber: "US_FAKE_ORDER_NUMBER",
  customerEmail: "paddingtonbear6335@gmail.com",
  totalPrice: {
    type: "centPrecision",
    currencyCode: "GBP",
    centAmount: 3900,
    fractionDigits: 2,
  },
  taxedPrice: {
    totalNet: {
      type: "centPrecision",
      currencyCode: "GBP",
      centAmount: 3250,
      fractionDigits: 2,
    },
    totalGross: {
      type: "centPrecision",
      currencyCode: "GBP",
      centAmount: 3900,
      fractionDigits: 2,
    },
    taxPortions: [
      {
        rate: 0.2,
        amount: {
          type: "centPrecision",
          currencyCode: "GBP",
          centAmount: 650,
          fractionDigits: 2,
        },
        name: "Fake Tax Portion",
      },
    ],
    totalTax: {
      type: "centPrecision",
      currencyCode: "GBP",
      centAmount: 650,
      fractionDigits: 2,
    },
  },
  country: "GB",
  orderState: "Confirmed",
  syncInfo: [],
  returnInfo: [],
  taxMode: "Platform",
  inventoryMode: "None",
  taxRoundingMode: "HalfEven",
  taxCalculationMode: "LineItemLevel",
  origin: "Customer",
  shippingMode: "Single",
  shippingInfo: {
    shippingMethodName: "UPS",
    price: {
      type: "centPrecision",
      currencyCode: "GBP",
      centAmount: 0,
      fractionDigits: 2,
    },
    shippingRate: {
      price: {
        type: "centPrecision",
        currencyCode: "GBP",
        centAmount: 0,
        fractionDigits: 2,
      },
      tiers: [],
    },
    taxRate: {
      name: "United Kingdom",
      amount: 0.2,
      includedInPrice: true,
      country: "GB",
      id: "15GylBp0",
      subRates: [],
    },
    taxCategory: {
      typeId: "tax-category",
      id: "fake-tax-id",
    },
    deliveries: [],
    shippingMethod: {
      typeId: "shipping-method",
      id: "fake-shipping-id",
    },
    taxedPrice: {
      totalNet: {
        type: "centPrecision",
        currencyCode: "GBP",
        centAmount: 0,
        fractionDigits: 2,
      },
      totalGross: {
        type: "centPrecision",
        currencyCode: "GBP",
        centAmount: 0,
        fractionDigits: 2,
      },
      totalTax: {
        type: "centPrecision",
        currencyCode: "GBP",
        centAmount: 0,
        fractionDigits: 2,
      },
    },
    shippingMethodState: "MatchesCart",
  },
  billingAddress: {
    firstName: "Jane",
    lastName: "Doe",
    streetNumber: "",
    streetName: "9509 Alameda Ln",
    additionalStreetInfo: "",
    postalCode: "55347",
    city: "Alameda",
    state: "MN",
    country: "US",
    phone: "",
  },
  shippingAddress: {
    firstName: "Paddington",
    lastName: "Bear",
    streetNumber: "",
    streetName: "123 Mayfair Ave",
    additionalStreetInfo: "Apt 55A",
    postalCode: "55347",
    city: "Alameda",
    state: "MN",
    country: "US",
    phone: "",
  },
  shipping: [],
  lineItems: [
    {
      id: "fake-line-item-id",
      productId: "fake-product-id",
      productKey: "fake-product-key",
      name: {
        en: "Fake Line Item!",
      },
      productType: {
        typeId: "product-type",
        id: "fake-product-type-id",
        obj: {
          key: "subscription",
        } as unknown as ProductType,
      },
      productSlug: {
        en: "Lingo",
      },
      variant: {
        id: 1,
        sku: "FAKE_SKU",
        key: "fake-sku-key",
        prices: [
          {
            id: "fake-sku-price-id",
            value: {
              type: "centPrecision",
              currencyCode: "GBP",
              centAmount: 3900,
              fractionDigits: 2,
            },
            key: "uk-price",
            country: "GB",
          },
          {
            id: "fake-sku-price-id-2",
            value: {
              type: "centPrecision",
              currencyCode: "EUR",
              centAmount: 30000,
              fractionDigits: 2,
            },
            country: "GB",
          },
        ],
        images: [
          {
            url: "https://fake.image.com/url/path",
            dimensions: {
              w: 57,
              h: 50,
            },
          },
        ],
        attributes: [
          {
            name: "order-origin",
            value: {
              key: "ORDERORIGINKEY",
              label: "ORDERORIGINLABEL",
            },
          },
          {
            name: "frequency",
            value: 1,
          },
          {
            name: "returnable-days",
            value: 0,
          },
        ],
        assets: [],
        availability: {
          isOnStock: true,
          availableQuantity: 10000,
        },
      },
      price: {
        id: "fake-price-id",
        value: {
          type: "centPrecision",
          currencyCode: "GBP",
          centAmount: 3900,
          fractionDigits: 2,
        },
        key: "uk-price",
        country: "GB",
      },
      quantity: 1,
      discountedPricePerQuantity: [
        {
          quantity: 1,
          discountedPrice: {
            value: {
              type: "centPrecision",
              centAmount: 100,
              fractionDigits: 2,
              currencyCode: "USD",
            },
            includedDiscounts: [
              {
                discount: {
                  typeId: "cart-discount",
                  id: "92a9a9e8-8f90-4439-9fb4-bf8c69166827",
                },
                discountedAmount: {
                  type: "centPrecision",
                  currencyCode: "USD",
                  centAmount: 0,
                  fractionDigits: 2,
                },
              },
            ],
          },
        },
      ],
      taxRate: {
        name: "United Kingdom",
        amount: 0.2,
        includedInPrice: true,
        country: "GB",
        id: "fake-tax-rate",
        subRates: [],
      },
      perMethodTaxRate: [],
      addedAt: "2023-03-16T14:55:37.013Z",
      lastModifiedAt: "2023-03-16T14:55:37.013Z",
      state: [
        {
          quantity: 1,
          state: {
            typeId: "state",
            id: "fake-state-id",
          },
        },
      ],
      priceMode: "Platform",
      lineItemMode: "Standard",
      totalPrice: {
        type: "centPrecision",
        currencyCode: "GBP",
        centAmount: 3900,
        fractionDigits: 2,
      },
      taxedPrice: {
        totalNet: {
          type: "centPrecision",
          currencyCode: "GBP",
          centAmount: 3250,
          fractionDigits: 2,
        },
        totalGross: {
          type: "centPrecision",
          currencyCode: "GBP",
          centAmount: 3900,
          fractionDigits: 2,
        },
        totalTax: {
          type: "centPrecision",
          currencyCode: "GBP",
          centAmount: 650,
          fractionDigits: 2,
        },
      },
      taxedPricePortions: [],
    },
  ],
  customLineItems: [],
  discountCodes: [
    {
      discountCode: {
        typeId: "discount-code",
        id: "fake-discount-code-id",
      },
      state: "NotActive",
    },
  ],
  directDiscounts: [],
  cart: {
    typeId: "cart",
    id: "fake-cart-id",
  },
  itemShippingAddresses: [],
  refusedGifts: [],
  customerId: "test-customer-id",
};

export default fakeOrder;
