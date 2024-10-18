// @vitest-environment: node

import { revalidatePath } from "next/cache";

import { CartService, ServiceLocator as SLCommerce } from "@ecommerce/commerce";
import { CheckoutService, ServiceLocator } from "@ecommerce/finance";

import { removeDiscountCode } from "~/app/actions/checkout/discountCode/removeDiscountCode";

const mockCartId = "existingCartId";
const mockCheckoutSessionId = "fake-id";
const mockCurrency = "USD";
const mockCartTotalPrice = 100;
const mockDiscountCodeId = "existingDiscountCodeId";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/headers");

const mockCartService = {
  removeDiscountCodeFromCart: vi.fn().mockResolvedValue({
    id: mockCartId,
    currency: mockCurrency,
    totalPrice: mockCartTotalPrice,
  }),
} as unknown as CartService;

const mockCheckoutService = {
  updateAuthorizedPrice: vi.fn().mockResolvedValue(true),
} as unknown as CheckoutService;

describe("removeDiscountCode action", () => {
  it("should remove the discount code from the cart", async () => {
    SLCommerce.setCartService(mockCartService);
    ServiceLocator.setCheckoutService(mockCheckoutService);

    await removeDiscountCode(
      mockCartId,
      1,
      mockCheckoutSessionId,
      mockDiscountCodeId,
    );

    expect(mockCartService.removeDiscountCodeFromCart).toHaveBeenCalledWith(
      mockCartId,
      1,
      mockDiscountCodeId,
    );
    expect(mockCheckoutService.updateAuthorizedPrice).toHaveBeenCalledWith(
      "USD",
      100,
      "fake-id",
    );
    expect(revalidatePath).toHaveBeenCalledWith("/checkout");
  });
});
