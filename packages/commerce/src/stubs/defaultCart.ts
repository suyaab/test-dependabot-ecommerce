import { Address, createStub, defaultAddressStub } from "@ecommerce/utils";

import { Cart } from "../Cart";

const defaultCart: Cart = {
  id: "fake-cart-id",
  version: 0,
  isActive: true,
  customerId: "fake-customer-id",
  contactInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 612 123 1234",
    marketingConsent: true,
  },
  shippingAddress: createStub<Address>(defaultAddressStub),
  billingAddress: createStub<Address>(defaultAddressStub),
  currency: "USD",
  countryCode: "US",
  discountCodes: [],
  lineItems: [],
  subtotal: 0,
  totalPrice: 0,
};

export default defaultCart;
