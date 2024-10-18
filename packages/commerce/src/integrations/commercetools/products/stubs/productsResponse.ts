export default {
  body: {
    results: [
      {
        id: "fake-id-1",
        key: "1-month-subscription",
        version: 1,
        versionModifiedAt: "2024-01-31T22:40:49.641Z",
        createdAt: "2023-03-09T20:12:32.055Z",
        lastModifiedAt: "2024-01-31T22:40:49.641Z",
        productType: {
          typeId: "product-type",
          id: "fake-product-type-id",
          obj: {
            key: "subscription",
          },
        },
        masterData: {
          current: {
            slug: {
              en: "2-week-pack",
            },
            categories: [
              {
                typeId: "category",
                id: "fake-pdp-category-id",
                obj: {
                  key: "pdp",
                },
              },
              {
                typeId: "category",
                id: "fake-phone-category-id",
                obj: {
                  key: "pdp",
                },
              },
            ],
            masterVariant: {
              id: 1,
              sku: "FAKE_SKU",
              key: "1-month-subscription",
              prices: [
                {
                  value: {
                    type: "centPrecision",
                    currencyCode: "GBP",
                    centAmount: 4999,
                    fractionDigits: 2,
                  },
                  key: "1-month-subscription",
                },
              ],
              attributes: [
                {
                  name: "order-origin",
                  value: {
                    key: "SAMPLE",
                    label: "SAMPLE",
                  },
                },
                {
                  name: "returnable-days",
                  value: 0,
                },
                {
                  name: "shipment-frequency",
                  value: 28,
                },
                {
                  name: "prepaid-shipments",
                  value: 1,
                },
                {
                  name: "auto-renew",
                  value: true,
                },
              ],
            },
            variants: [],
            searchKeywords: {},
          },
        },
      },
      {
        id: "fake-id-2",
        key: "2-month-subscription",
        version: 1,
        versionModifiedAt: "2024-01-31T22:40:49.641Z",
        createdAt: "2023-03-09T20:12:32.055Z",
        lastModifiedAt: "2024-01-31T22:40:49.641Z",
        productType: {
          typeId: "product-type",
          id: "fake-product-type-id",
          obj: {
            key: "subscription",
          },
        },
        masterData: {
          current: {
            slug: {
              en: "2-week-pack",
            },
            categories: [
              {
                typeId: "category",
                id: "fake-pdp-category-id",
                obj: {
                  key: "pdp",
                },
              },
              {
                typeId: "category",
                id: "fake-phone-category-id",
                obj: {
                  key: "pdp",
                },
              },
            ],
            masterVariant: {
              id: 1,
              sku: "FAKE_SKU",
              key: "2-month-subscription",
              prices: [
                {
                  value: {
                    type: "centPrecision",
                    currencyCode: "GBP",
                    centAmount: 9999,
                    fractionDigits: 2,
                  },
                  key: "2-month-subscription",
                },
              ],
              attributes: [
                {
                  name: "order-origin",
                  value: {
                    key: "SAMPLE",
                    label: "SAMPLE",
                  },
                },
                {
                  name: "returnable-days",
                  value: 0,
                },
                {
                  name: "shipment-frequency",
                  value: 28,
                },
                {
                  name: "prepaid-shipments",
                  value: 2,
                },
                {
                  name: "auto-renew",
                  value: true,
                },
              ],
            },
            variants: [],
            searchKeywords: {},
          },
        },
      },
    ],
  },
};
