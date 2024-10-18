export const ArvatoEventName = {
  UPDATE_ORDER_STATUS: "updateOrderStatus",
  UPDATE_PAYMENT_STATUS: "updatePaymentStatus",
} as const;

export const HttpResponseStatus = {
  OK: 200,
  BadRequest: 400,
  NotFound: 404,
  InternalServerError: 500,
} as const;
