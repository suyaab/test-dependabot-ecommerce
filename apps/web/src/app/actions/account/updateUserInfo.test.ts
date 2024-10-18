// @vitest-environment node

import {
  AuthService,
  ServiceLocator as AuthServiceLocator,
} from "@ecommerce/auth";
import { CustomerService, ServiceLocator } from "@ecommerce/commerce";
import { ServiceLocator as SLNotifications } from "@ecommerce/notifications";

import { updateUserInfo } from "~/app/actions/account/updateUserInfo";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/headers");

describe("updateUserInfo", () => {
  const mockAuthService = {
    getAuthenticatedCustomer: vi.fn().mockResolvedValue({
      id: "fake-customer-id",
      version: 1,
    }),
  } as unknown as AuthService;

  const mockCustomerService = {
    updateCustomerInformation: vi.fn().mockResolvedValue({
      id: "fake-customer-id",
      version: 2,
      firstName: "fakeFirstName",
      lastName: "fakeLastName",
      email: "fake@email.com",
    }),
  } as unknown as CustomerService;
  const mockNotifications = {
    sendEmail: vi.fn().mockResolvedValue({}),
  };
  SLNotifications.setEmailService(mockNotifications);
  it("can update user information on account page", async () => {
    AuthServiceLocator.setAuthService(mockAuthService);
    ServiceLocator.setCustomerService(mockCustomerService);

    const response = await updateUserInfo(
      "fakeFirstName",
      "fakeLastName",
      "(612) 747-1921",
    );

    expect(response.ok).toBe(true);
  });

  it("can update user information on account page without a phone", async () => {
    AuthServiceLocator.setAuthService(mockAuthService);
    ServiceLocator.setCustomerService(mockCustomerService);

    const response = await updateUserInfo("fakeFirstName", "fakeLastName", "");

    expect(response.ok).toBe(true);
  });
});
