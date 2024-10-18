export enum EmailTemplate {
  ShippingConfirmation = "ShippingConfirmation",
  OrderConfirmation = "OrderConfirmation",
  OrderOutForDelivery = "OrderOutForDelivery",
  DeliveryConfirmation = "DeliveryConfirmation",
  OrderCancellation = "OrderCancellation",
  CarrierReturn = "CarrierReturn",
  AccountDetailsUpdated = "AccountDetailsUpdated",
  SubscriptionConfirmation = "SubscriptionConfirmation",
  PaymentFailure = "PaymentFailure",
}

export const EmailTemplateData: Record<
  EmailTemplate,
  { id: string; subject: string }
> = {
  [EmailTemplate.OrderConfirmation]: {
    id: "d-188694e4a1ca45f280a6b1e13ee537d3",
    subject:
      "Welcome to Lingo, {{firstName}} | Order {{orderNumber}} confirmed",
  },
  [EmailTemplate.ShippingConfirmation]: {
    id: "d-4f46652ee166482bb926fffc0d77d950",
    subject: "Your order’s coming | Lingo order {{orderNumber}}",
  },
  [EmailTemplate.OrderOutForDelivery]: {
    id: "d-b5db959be4c7450ab9a0a83911c16206",
    subject: "Your order’s on its way | Lingo order {{order_number}}",
  },
  [EmailTemplate.DeliveryConfirmation]: {
    id: "d-eec210b6f0904d04ad985994db6910f6",
    subject: "It’s arrived |  Lingo order {{order_number}}",
  },
  [EmailTemplate.OrderCancellation]: {
    id: "d-002bbbdda1984d0e94237ed6e258d2fc",
    subject: "We’ve cancelled your Lingo order {{order_number}}",
  },
  [EmailTemplate.PaymentFailure]: {
    id: "d-1d6d2cc8714641338c19d28248206004",
    subject: "Lingo payment failed | please update your details",
  },
  [EmailTemplate.CarrierReturn]: {
    id: "d-ce285bc0616f4b24aef9d8a7666fb29e",
    subject: "Sorry, delivery failed | Lingo order {{order_number}}",
  },
  [EmailTemplate.AccountDetailsUpdated]: {
    id: "d-f65202e913f845bfa3e43b70dd81da8c",
    subject: "Account details updated",
  },
  [EmailTemplate.SubscriptionConfirmation]: {
    id: "d-1e83b669dc9b46a7b1d6e9e908461a01",
    subject:
      "Up for more? Lingo is renewing | order {{order_number}} confirmed",
  },
};
