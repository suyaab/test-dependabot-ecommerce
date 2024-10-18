// @vitest-environment node

import {
  AuthService,
  ServiceLocator as AuthServiceLocator,
} from "@ecommerce/auth";
import { CustomerService, ServiceLocator } from "@ecommerce/commerce";
import { ServiceLocator as SLNotifications } from "@ecommerce/notifications";
import { Address, AddressFormData } from "@ecommerce/utils";

import { updateShippingAddress } from "~/app/actions/account/updateShippingAddress";

vi.mock("next/cache");

vi.mock("next/headers");

describe("updateShippingAddress", () => {
  const mockShippingAddressFormData: AddressFormData = {
    addressLine1: "mock-address-line-1",
    addressLine2: "mock-address-line-2",
    state: "MN",
    city: "mock-address-city",
    postalCode: "12345",
    countryCode: "US",
  };

  const mockAddress: Address = {
    firstName: "fake-first-name",
    lastName: "fake-last-name",
    addressLine1: "mock-address-line-1",
    addressLine2: "mock-address-line-2",
    state: "MN",
    city: "mock-address-city",
    postalCode: "12345",
    countryCode: "US",
  };
  const mockNotifications = {
    sendEmail: vi.fn().mockResolvedValue({}),
  };
  SLNotifications.setEmailService(mockNotifications);
  it("can update user shipping address on account page", async () => {
    const mockAuthService = {
      getAuthenticatedCustomer: vi.fn().mockResolvedValue({
        id: "fake-customer-id",
        version: 1,
        firstName: "fake-first-name",
        lastName: "fake-last-name",
      }),
    } as unknown as AuthService;

    AuthServiceLocator.setAuthService(mockAuthService);

    const mockCustomerService = {
      updateCustomerShippingAddress: vi.fn().mockResolvedValue({
        id: "fake-customer-id",
        version: 2,
        shippingAddress: mockAddress,
      }),
    } as unknown as CustomerService;

    ServiceLocator.setCustomerService(mockCustomerService);

    const response = await updateShippingAddress(mockShippingAddressFormData);

    expect(response.ok).toBe(true);
  });
});
