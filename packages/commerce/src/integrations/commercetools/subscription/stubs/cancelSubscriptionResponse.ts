export const cancelSubscriptionResponse = {
  custom: {
    fields: {
      status: "cancelled",
      parentOrderNumber: "mock-parent-order-number",
      subscription: { typeId: "product", id: "mock-lingo-product-id" },
      paymentMethodId: "mock-payment-method-id",
      nextOrderDate: "2024-05-05T00:00:00.000Z",
      cancellationDate: "2024-06-06T00:00:00.000Z",
      notified: false,
      prepaidShipmentsRemaining: 0,
    },
  },
};
