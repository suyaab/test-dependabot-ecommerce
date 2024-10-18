// @vitest-environment: node

import { revalidatePath } from "next/cache";

import {
  CartService,
  ServiceLocator as CommerceServiceLocator,
} from "@ecommerce/commerce";
import {
  CheckoutService,
  ServiceLocator as PaymentServiceLocator,
} from "@ecommerce/finance";
import { Address } from "@ecommerce/utils";

import { submitBillingAddress } from "~/app/actions/checkout/addresses/submitBillingAddress";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/headers");

describe("submitBillingAddress", () => {
  const mockCartId = "fake-cart-id";
  const mockCartVersion = 1;
  const mockCheckoutSessionId = "fake-checkout-session-id";

  const mockCartService = {
    updateCartBillingAddress: vi.fn().mockResolvedValue({
      id: "fake-cart-id",
      version: 2,
      lineItems: [
        {
          totalGross: 30000,
        },
      ],
    }),
  } as unknown as CartService;

  const mockCheckoutService = {
    updateCheckoutSessionAddress: vi.fn().mockResolvedValue({
      id: "fake-checkout-session-id",
    }),
    updateAuthorizedPrice: vi.fn().mockResolvedValue(true),
  } as unknown as CheckoutService;

  it("can successfully update shipping and payment info on cart", async () => {
    CommerceServiceLocator.setCartService(mockCartService);
    PaymentServiceLocator.setCheckoutService(mockCheckoutService);

    const mockAddress: Address = {
      firstName: "fake-first-name",
      lastName: "fake-last-name",
      addressLine1: "fake-address-line-1",
      addressLine2: "",
      city: "fake-city",
      state: "CA",
      postalCode: "55347",
      countryCode: "US",
    };

    const response = await submitBillingAddress(
      mockCartId,
      mockCartVersion,
      mockCheckoutSessionId,
      mockAddress,
    );

    expect(response.ok).toBe(true);
    expect(revalidatePath).toHaveBeenCalledWith("/checkout");
  });

  it("should fail to update cart with invalid payload", async () => {
    const result = await submitBillingAddress(
      mockCartId,
      mockCartVersion,
      mockCheckoutSessionId,
      {} as unknown as Address,
    );

    assert(!result.ok);
  });

  it("should fail to update cart with invalid country code", async () => {
    const mockInvalidAddress: Address = {
      firstName: "fake-first-name",
      lastName: "fake-last-name",
      addressLine1: "fake-address-line-1",
      addressLine2: "",
      city: "fake-city",
      state: "CA",
      postalCode: "55347",
      countryCode: "CANADA" as unknown as "US",
    };

    const result = await submitBillingAddress(
      mockCartId,
      mockCartVersion,
      mockCheckoutSessionId,
      mockInvalidAddress,
    );

    assert(!result.ok);
  });
});
