/**
 @jest-environment node
 */

import {
  CheckoutService,
  ServiceLocator as SLFinance,
} from "@ecommerce/finance";

import { POST } from "~/app/api/checkout/apple-pay/session/route";

describe("POST", () => {
  const mockRequest = {
    method: "POST",
    json: vi.fn().mockResolvedValue({
      checkoutSessionId: "fake-payon-checkout-id",
    }),
  } as unknown as Request;

  it("should successfully retrieve payon checkout", async () => {
    const mockCheckoutService = {
      getCheckoutSession: vi.fn().mockResolvedValue({
        id: "fake-payon-checkout-id",
        amount: "300.00",
        currency: "USD",
      }),
    } as unknown as CheckoutService;

    SLFinance.setCheckoutService(mockCheckoutService);

    const response = await POST(mockRequest);

    expect(response.status).toBe(200);
  });

  it("should return error message if fullCheckoutSession returns null", async () => {
    const mockCheckoutServiceWithNullCheckout = {
      getCheckoutSession: vi.fn().mockResolvedValue(null),
    } as unknown as CheckoutService;

    SLFinance.setCheckoutService(mockCheckoutServiceWithNullCheckout);

    const response = await POST(mockRequest);

    expect(response.status).toBe(500);
  });

  it("should return error message if PaymentGateway fails", async () => {
    const mockCheckoutServiceWithNullCheckout = {
      getCheckoutSession: vi.fn().mockImplementation(() => {
        throw new Error("Mock PayOn Error");
      }),
    } as unknown as CheckoutService;

    SLFinance.setCheckoutService(mockCheckoutServiceWithNullCheckout);

    const response = await POST(mockRequest);

    expect(response.status).toBe(500);
  });
});
