// @vitest-environment: node

import { revalidatePath } from "next/cache";

import {
  CartService,
  discountCodeInfoSchema,
  ServiceLocator as SLCommerce,
} from "@ecommerce/commerce";
import { CheckoutService, ServiceLocator } from "@ecommerce/finance";

import { applyDiscountCode } from "./applyDiscountCode";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/headers");

const MOCK_DISCOUNT_CODE_ID = "existingDiscountCodeId";
const VALID_MATCHING_CODE = "valid-matching-code";
const VALID_INACTIVE_CODE = "valid-inactive-code";
const VALID_NON_MATCHING_CODE = "valid-non-matching-code";
const mockCheckoutSessionId = "fake-id";

const getRandomErrorState = () => {
  const errorStates = discountCodeInfoSchema.shape.state.options
    .map((option) => option.value)
    .filter((state) => state !== "MatchesCart");

  return errorStates[Math.floor(Math.random() * errorStates.length)];
};

const mockCartService = {
  getDiscountCodeByName: vi.fn((code: string) => {
    if (code === VALID_MATCHING_CODE || code === VALID_NON_MATCHING_CODE) {
      return {
        id: MOCK_DISCOUNT_CODE_ID,
        version: 1,
        code,
        isActive: true,
      };
    } else if (code === VALID_INACTIVE_CODE) {
      return {
        id: MOCK_DISCOUNT_CODE_ID,
        version: 1,
        code,
        isActive: false,
      };
    } else {
      return undefined;
    }
  }),
  addDiscountCodeToCart: vi.fn((_cartId, _cartVersion, code) =>
    code === VALID_MATCHING_CODE ? "MatchesCart" : getRandomErrorState(),
  ),
} as unknown as CartService;

const mockCheckoutService = {
  updateAuthorizedPrice: vi.fn().mockResolvedValue(true),
} as unknown as CheckoutService;

describe("applyDiscountCode action", () => {
  it("should return undefined if discountCode not found", async () => {
    SLCommerce.setCartService(mockCartService);
    ServiceLocator.setCheckoutService(mockCheckoutService);
    const invalidCode = "invalid-code";
    const result = await applyDiscountCode(
      "existingCartId",
      1,
      mockCheckoutSessionId,
      invalidCode,
    );
    expect(mockCartService.getDiscountCodeByName).toHaveBeenCalledWith(
      invalidCode,
    );
    expect(mockCartService.addDiscountCodeToCart).not.toHaveBeenCalled();
    expect(mockCheckoutService.updateAuthorizedPrice).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/checkout");
    expect(result).toBe(undefined);
  });

  it("should return undefined if discountCode is not active", async () => {
    SLCommerce.setCartService(mockCartService);
    ServiceLocator.setCheckoutService(mockCheckoutService);
    const result = await applyDiscountCode(
      "existingCartId",
      1,
      mockCheckoutSessionId,
      VALID_INACTIVE_CODE,
    );
    expect(mockCartService.getDiscountCodeByName).toHaveBeenCalledWith(
      VALID_INACTIVE_CODE,
    );
    expect(mockCartService.addDiscountCodeToCart).not.toHaveBeenCalled();
    expect(mockCheckoutService.updateAuthorizedPrice).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/checkout");
    expect(result).toBe(undefined);
  });

  it("should return 'MatchesCart' if applied discount code matches cart", async () => {
    SLCommerce.setCartService(mockCartService);
    ServiceLocator.setCheckoutService(mockCheckoutService);

    const result = await applyDiscountCode(
      "existingCartId",
      1,
      mockCheckoutSessionId,
      VALID_MATCHING_CODE,
    );
    expect(mockCartService.getDiscountCodeByName).toHaveBeenCalledWith(
      VALID_MATCHING_CODE,
    );
    expect(mockCartService.addDiscountCodeToCart).toHaveBeenCalledWith(
      "existingCartId",
      1,
      VALID_MATCHING_CODE,
    );

    expect(revalidatePath).toHaveBeenCalledWith("/checkout");
    expect(result).toBe("M");
  });

  it("should return an error state if applied discount code does not match cart", async () => {
    SLCommerce.setCartService(mockCartService);
    ServiceLocator.setCheckoutService(mockCheckoutService);
    const result = await applyDiscountCode(
      "existingCartId",
      1,
      mockCheckoutSessionId,
      VALID_NON_MATCHING_CODE,
    );
    expect(mockCartService.getDiscountCodeByName).toHaveBeenCalledWith(
      VALID_NON_MATCHING_CODE,
    );
    expect(mockCartService.addDiscountCodeToCart).toHaveBeenCalledWith(
      "existingCartId",
      1,
      VALID_NON_MATCHING_CODE,
    );
    expect(revalidatePath).toHaveBeenCalledWith("/checkout");
    expect(result).not.toBe("MatchesCart");
  });
});
