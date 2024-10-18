import { createStub } from "@ecommerce/utils";

import { Cart } from "../Cart";
import { Customer } from "../Customer";
import { Subscription } from "../Subscription";
import defaultCart from "./defaultCart";
import defaultCustomer from "./defaultCustomer";
import defaultSubscription from "./defaultSubscription";

export { defaultCustomer, defaultCart, defaultSubscription };

export const createCustomerStub = (overrides?: Partial<Customer>): Customer => {
  return createStub<Customer>(defaultCustomer, overrides);
};

export const createCartStub = (overrides?: Partial<Cart>): Cart => {
  return createStub<Cart>(defaultCart, overrides);
};

export const createSubscriptionStub = (
  overrides?: Partial<Subscription>,
): Subscription => {
  return createStub<Subscription>(defaultSubscription, overrides);
};
