import { CartService, ServiceLocator as SLCommerce } from "@ecommerce/commerce";
import { Address } from "@ecommerce/utils";

import { POST } from "~/app/api/checkout/apple-pay/update-billing-address/route";

describe("POST", () => {
  const mockCartId = "fake-card-id";
  const mockCartVersion = 1;

  const mockBillingAddress: Address = {
    firstName: "fake-first",
    lastName: "fake-last",
    addressLine1: "123 Smith St",
    addressLine2: "Unit 6",
    state: "CA",
    city: "Los Angeles",
    postalCode: "95302",
    countryCode: "US",
  };

  it("can successfully update cart addresses for Apple Pay", async () => {
    const mockCartService = {
      getCart: vi.fn().mockResolvedValue({
        id: mockCartId,
        version: mockCartVersion,
      }),
      updateCartShippingAddress: vi.fn().mockResolvedValue({
        id: mockCartId,
        version: mockCartVersion,
      }),
      updateCartBillingAddress: vi.fn().mockResolvedValue({
        id: mockCartId,
        version: mockCartVersion,
      }),
    } as unknown as CartService;

    SLCommerce.setCartService(mockCartService);

    const response = await POST({
      json: vi.fn().mockResolvedValue({
        cartId: mockCartId,
        billingAddress: {
          firstName: "fake-first",
          lastName: "fake-last",
          addressLine1: "123 Smith St",
          addressLine2: "Unit 6",
          city: "Los Angeles",
          state: "CA",
          postalCode: "95302",
          countryCode: "US",
        },
      }),
    } as unknown as Request);

    expect(response.status).toBe(200);

    expect(mockCartService.getCart).toHaveBeenCalledWith(mockCartId);

    expect(mockCartService.updateCartBillingAddress).toHaveBeenCalledWith(
      mockCartId,
      mockCartVersion,
      mockBillingAddress,
    );
  });
});
