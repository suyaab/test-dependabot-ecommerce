import { Subscription } from "../Subscription";

const defaultSubscription: Subscription = {
  customerId: "fake-customer-id",
  customerVersion: 0,
  status: "active",
  subscription: "fake-subscription-product-id",
  prepaidShipmentsRemaining: 0,
  paymentMethodId: "fake-payment-method-id",
  parentOrderNumber: "fake-parent-order-number",
  nextOrderDate: new Date(),
};

export default defaultSubscription;
