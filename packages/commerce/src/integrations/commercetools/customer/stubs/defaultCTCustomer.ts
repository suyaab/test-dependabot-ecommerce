import { Customer as CTCustomer } from "@commercetools/platform-sdk";

const defaultCTCustomer: CTCustomer = {
  id: "fake-customer-id-1",
  version: 2,
  externalId: "fake-external-id",
  createdAt: "2023-03-14T16:55:31.791Z",
  lastModifiedAt: "2023-03-14T16:55:31.791Z",
  email: "updated-email@example.com",
  firstName: "updated-first-name",
  lastName: "updated-last-name",
  customerNumber: "fake-customer-number",
  locale: "en-GB",
  customerGroup: {
    id: "fake-group-id",
    typeId: "customer-group",
  },
  addresses: [
    {
      id: "shipping-address-id",
      firstName: "FakeFirstName",
      lastName: "FakeLastName",
      streetName: "123 Alameda Creek",
      additionalStreetInfo: "Unit 1",
      postalCode: "02145",
      city: "Alameda",
      state: "MN",
      country: "US",
    },
    {
      id: "billing-address-id",
      firstName: "FakeFirstName",
      lastName: "FakeLastName",
      streetName: "321 Alameda Creek",
      additionalStreetInfo: "Unit 2",
      postalCode: "02145",
      city: "Alameda",
      state: "MN",
      country: "US",
    },
  ],
  defaultShippingAddressId: "shipping-address-id",
  defaultBillingAddressId: "billing-address-id",
  isEmailVerified: false,
  authenticationMode: "ExternalAuth",
};

export default defaultCTCustomer;
