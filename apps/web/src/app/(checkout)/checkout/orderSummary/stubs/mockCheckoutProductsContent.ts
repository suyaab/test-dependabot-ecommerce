export const mockCheckoutProductsContent = {
  ["fake-product-sku"]: {
    id: "mock-product-id",
    title: "mock-product-title",
    description: "mock-product-description",
    image: {
      url: "/images/temp/boxshotplaceholder.png",
      height: 200,
      width: 200,
    },
    priceDetails: {
      price: {
        amount: 8900,
        currency: "USD",
      },
      frequency: null,
    },
    billingDetails: {
      price: null,
      frequency: null,
      message: "mock-product-billing-details-message",
    },
    deliveryDetails: null,
    savingDetails: null,
    cgms: {
      total: {
        count: 1,
        message: "mock-product-cgms-total-message",
      },
      shipment: null,
    },
  },
};
