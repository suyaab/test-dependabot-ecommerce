// @vitest-environment: node

import { revalidatePath } from "next/cache";

import {
  CartService,
  ServiceLocator as CommerceServiceLocator,
} from "@ecommerce/commerce";
import {
  ConsentManager,
  ServiceLocator as ConsentManagerServiceLocator,
} from "@ecommerce/consent";
import {
  CheckoutService,
  ServiceLocator as FinanceServiceLocator,
} from "@ecommerce/finance";

import { submitContactInfo } from "~/app/actions/checkout/submitContactInfo";
import signup from "../signup/signup";

vi.mock("next/headers");

vi.mock("~/lib/getIpAddress", () => ({
  default: vi.fn().mockReturnValue("fake-ip-address"),
}));

vi.mock("~/app/actions/checkout/checkIfCustomerExists", () => ({
  default: vi.fn().mockResolvedValue(false),
}));

vi.mock("~/lib/getOrCreateExternalId", () => ({
  default: vi.fn().mockReturnValue({
    subscribed: "fake-subscription-status",
    externalId: "fake-external-id",
  }),
}));

vi.mock("../signup/signup", () => ({
  default: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("submitContactInfo", () => {
  const mockCartId = "fake-card-id";
  const mockCartVersion = 1;
  const mockCheckoutSessionId = "fake-checkout-session-id";

  const mockConsentManager = {
    postConsents: vi.fn(),
  } as unknown as ConsentManager;

  const mockCartService = {
    updateCartContactInfo: vi.fn().mockResolvedValue({
      id: mockCartId,
      version: 2,
    }),
  } as unknown as CartService;

  const mockCheckoutService = {
    updateCheckoutSessionCustomer: vi.fn().mockResolvedValue({
      id: mockCheckoutSessionId,
      orderNumber: "fakeOrderNumber",
    }),
  } as unknown as CheckoutService;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("can successfully update contact info on cart", async () => {
    ConsentManagerServiceLocator.setConsentManager(mockConsentManager);
    CommerceServiceLocator.setCartService(mockCartService);
    FinanceServiceLocator.setCheckoutService(mockCheckoutService);

    const mockContactInfoData = {
      firstName: "fake",
      lastName: "name",
      email: "fake@email.com",
      phone: "6123214444",
      marketingConsent: true,
      purchaseConsent: true,
    };

    const result = await submitContactInfo(
      mockCartId,
      mockCartVersion,
      mockCheckoutSessionId,
      mockContactInfoData,
    );

    assert(result.ok);

    expect(revalidatePath).toHaveBeenCalledWith("/checkout");
    expect(result.ok).toBe(true);
    expect(signup).toBeCalled();
  });

  it("should fail to update cart with invalid payload", async () => {
    const result = await submitContactInfo(
      mockCartId,
      mockCartVersion,
      mockCheckoutSessionId,
      {
        purchaseConsent: false,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        marketingConsent: false,
      },
    );

    assert(!result.ok);

    expect(result.message).toBe(
      "The contact information provided is invalid, please check the form and try again.",
    );
    expect(signup).not.toBeCalled();
  });
});
