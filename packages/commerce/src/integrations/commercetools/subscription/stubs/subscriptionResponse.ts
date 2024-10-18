export const subscriptionResponse = {
  custom: {
    fields: {
      status: "cancelled",
      parentOrderNumber: "mock-parent-order-number",
      subscription: { typeId: "product", id: "mock-lingo-product-id" },
      paymentMethodId: "mock-payment-method-id",
      nextOrderDate: "2023-01-01T00:00:00.000Z",
      notified: false,
      prepaidShipmentsRemaining: 2,
      cancellationDate: "2022-01-01T00:00:00.000Z",
      stoppedRetrying: true,
    },
  },
};
