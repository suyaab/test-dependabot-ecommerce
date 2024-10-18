import { revalidatePath } from "next/cache";

import {
  CartService,
  ServiceLocator as CommerceServiceLocator,
} from "@ecommerce/commerce";
import {
  ConsentManager,
  ServiceLocator as ConsentManagerServiceLocator,
} from "@ecommerce/consent";

import { submitPromoContactInfo } from "~/app/actions/promotional/submitPromoContactInfo";
import signup from "../signup/signup";

vi.mock("~/app/actions/checkIfCustomerExists", () => ({
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

describe("submitSampleContactInfo", () => {
  const mockCartId = "fake-card-id";
  const mockCartVersion = 1;

  const mockConsentManager = {
    postConsents: vi.fn(),
  } as unknown as ConsentManager;

  const mockCartService = {
    updateCartContactInfo: vi.fn().mockResolvedValue({
      id: mockCartId,
      version: 2,
      lineItems: [
        {
          product: {
            sku: "FAKE_SKU",
          },
        },
      ],
    }),
  } as unknown as CartService;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("can successfully update contact info on cart", async () => {
    ConsentManagerServiceLocator.setConsentManager(mockConsentManager);
    CommerceServiceLocator.setCartService(mockCartService);

    const mockContactInfoData = {
      firstName: "fake",
      lastName: "name",
      email: "fake@email.com",
      phone: "6123214444",
      marketingConsent: true,
      purchaseConsent: true,
    };

    const result = await submitPromoContactInfo(
      mockCartId,
      mockCartVersion,
      mockContactInfoData,
    );

    assert(result.ok);

    expect(revalidatePath).toHaveBeenCalledWith("/promotional/FAKE_SKU");
    expect(result.ok).toBe(true);
    expect(signup).toBeCalled();
  });

  it("should fail to update cart with invalid payload", async () => {
    const result = await submitPromoContactInfo(mockCartId, mockCartVersion, {
      purchaseConsent: false,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      marketingConsent: false,
    });

    assert(!result.ok);

    expect(result.message).toBe(
      "The contact information provided is invalid, please check the form and try again.",
    );
    expect(signup).not.toBeCalled();
  });
});
