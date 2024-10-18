// @vitest-environment: node
import { redirect } from "next/navigation";

import {
  AuthService,
  ServiceLocator as AuthServiceLocator,
} from "@ecommerce/auth";
import {
  CustomerService,
  ServiceLocator as SLCommerce,
} from "@ecommerce/commerce";

import verifyCustomerExistence from "~/app/actions/verifyCustomerExistence";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/headers");
const mockEmail = "test@test.com";
const mockAuthService = {
  checkUserExist: vi.fn().mockReturnValueOnce(false),
} as unknown as AuthService;

describe("checkUserAndRedirect", () => {
  it("should redirect to signup page if customer does not exist in Auth0 and customer exists in Commerce Engine", async () => {
    const mockCustomerService = {
      getCustomerByEmail: vi.fn().mockReturnValueOnce({
        id: "test-id",
        email: "test-email",
      }),
    } as unknown as CustomerService;
    AuthServiceLocator.setAuthService(mockAuthService);
    SLCommerce.setCustomerService(mockCustomerService);

    await verifyCustomerExistence(mockEmail);
    expect(redirect).toHaveBeenCalledWith("/api/auth/signup");
  });

  it("should redirect to create acount page if customer does not exist in Auth0 and customer does not exists in Commerce Engine", async () => {
    const mockCustomerService = {
      getCustomerByEmail: vi.fn().mockReturnValueOnce(undefined),
    } as unknown as CustomerService;
    AuthServiceLocator.setAuthService(mockAuthService);
    SLCommerce.setCustomerService(mockCustomerService);

    await verifyCustomerExistence(mockEmail);
    expect(redirect).toHaveBeenCalledWith("/create-account");
  });

  it("should redirect to login page if user exist in Auth0", async () => {
    const mockCustomerService = {
      getCustomerByEmail: vi.fn().mockReturnValueOnce(undefined),
    } as unknown as CustomerService;
    const mockAuthServiceUserExists = {
      checkUserExist: vi.fn().mockReturnValueOnce(true),
    } as unknown as AuthService;
    AuthServiceLocator.setAuthService(mockAuthServiceUserExists);
    SLCommerce.setCustomerService(mockCustomerService);

    await verifyCustomerExistence(mockEmail);
    expect(redirect).toHaveBeenCalledWith("/api/auth/login");
  });
});
