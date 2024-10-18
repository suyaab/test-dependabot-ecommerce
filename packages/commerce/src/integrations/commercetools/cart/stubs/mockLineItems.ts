import { LineItem as CTLineItem } from "@commercetools/platform-sdk";

import { mockProductType } from "./mockProductType";

export const mockLineItems: CTLineItem[] = [
  {
    id: "line-item-id",
    productId: "fake-product-id",
    productKey: "product-2",
    name: {
      en: "us",
    },
    productType: mockProductType,
    variant: {
      id: 1,
      sku: "FAKE_SKU",
      prices: [
        {
          id: "fake-price-id",
          value: {
            type: "centPrecision",
            currencyCode: "USD",
            centAmount: 8900,
            fractionDigits: 2,
          },
        },
      ],
      images: [],
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
    },
    price: {
      id: "fake-cart-price-id",
      value: {
        type: "centPrecision",
        currencyCode: "USD",
        centAmount: 100,
        fractionDigits: 2,
      },
    },
    quantity: 1,
    taxedPrice: {
      totalNet: {
        type: "centPrecision",
        centAmount: 1000,
        fractionDigits: 2,
        currencyCode: "USD",
      },
      totalGross: {
        type: "centPrecision",
        centAmount: 1100,
        fractionDigits: 2,
        currencyCode: "USD",
      },
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
    discountedPricePerQuantity: [
      {
        discountedPrice: {
          value: {
            type: "centPrecision",
            currencyCode: "USD",
            centAmount: 9840,
            fractionDigits: 2,
          },
          includedDiscounts: [
            {
              discount: {
                typeId: "cart-discount",
                id: "discount-code-id",
              },
              discountedAmount: {
                type: "centPrecision",
                currencyCode: "USD",
                centAmount: 2160,
                fractionDigits: 2,
              },
            },
          ],
        },
        quantity: 1,
      },
    ],
    perMethodTaxRate: [],
    addedAt: "2024-03-08T00:47:19.465Z",
    lastModifiedAt: "2024-03-08T00:47:19.465Z",
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
      currencyCode: "USD",
      centAmount: 100,
      fractionDigits: 2,
    },
    taxedPricePortions: [],
  },
];
