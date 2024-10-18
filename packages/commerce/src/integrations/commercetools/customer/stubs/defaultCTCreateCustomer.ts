import { Customer as CTCustomer } from "@commercetools/platform-sdk";

const defaultCTCreateCustomer: CTCustomer = {
  id: "fake-customer-id-1",
  version: 2,
  createdAt: "2024-09-18T18:14:53.084Z",
  lastModifiedAt: "2024-09-18T18:14:53.084Z",
  email: "fake-email@sfsd.com",
  firstName: "updated-first-name",
  lastName: "updated-last-name",
  customerNumber: "fake-customer-number",
  addresses: [],
  isEmailVerified: false,
  externalId: "fake-external-id",
  stores: [],
  authenticationMode: "ExternalAuth",
};

export default defaultCTCreateCustomer;
