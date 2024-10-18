import { Address, createStub, defaultAddressStub } from "@ecommerce/utils";

import { Customer } from "../Customer";
import { Subscription } from "../Subscription";
import defaultSubscription from "./defaultSubscription";

const defaultCustomer: Customer = {
  id: "default-customer-stub-id",
  version: 0,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 612 123 1234",
  externalId: "",
  customerNumber: "",
  locale: "en",
  billingAddress: createStub<Address>(defaultAddressStub),
  shippingAddress: createStub<Address>(defaultAddressStub),
  createdAt: new Date(),
  customerGroup: {
    id: "fake-customer-group-id",
    name: "Fake Customer Group",
  },
  subscription: createStub<Subscription>(defaultSubscription),
};

export default defaultCustomer;
