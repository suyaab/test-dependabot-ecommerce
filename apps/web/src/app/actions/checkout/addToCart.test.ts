// @vitest-environment: node

import { CartService, ServiceLocator } from "@ecommerce/commerce";

import { addToCart } from "~/app/actions/checkout/addToCart";

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockReturnValue({
    set: vi.fn(),
  }),
  headers: vi.fn(),
}));

describe("addToCart", () => {
  const mockCartService: CartService = {
    createCart: vi.fn().mockResolvedValue({
      id: "fake-cart-id",
    }),
  } as unknown as CartService;

  it("can add product to cart", async () => {
    ServiceLocator.setCartService(mockCartService);

    await addToCart("fake-product-id");
  });
});
