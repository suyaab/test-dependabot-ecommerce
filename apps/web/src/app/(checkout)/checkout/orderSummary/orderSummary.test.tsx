// @vitest-environment: node

import { render, screen } from "@testing-library/react";

import { CMS, ServiceLocator as CMSServiceLocator } from "@ecommerce/cms";

import OrderSummary from "./OrderSummary";
import { mockCart } from "./stubs/mockCartResponse";
import { mockCheckoutProductsContent } from "./stubs/mockCheckoutProductsContent";
import { mockOrderConfirmationContent } from "./stubs/mockOrderConfirmationContent";
import { mockProductCardsContent } from "./stubs/mockProductCardsContent";

const mockCMS = {
  getProductCardsContent: vi.fn().mockResolvedValue(mockProductCardsContent),
  getCheckoutProductsContent: vi
    .fn()
    .mockResolvedValue(mockCheckoutProductsContent),
  getCheckoutOrderSummaryContent: vi
    .fn()
    .mockResolvedValue(mockOrderConfirmationContent),
} as unknown as CMS;

vi.mock("next/headers");

describe("OrderSummary", () => {
  it("can successfully show order summary", async () => {
    CMSServiceLocator.setCMS(mockCMS);

    const Page = await OrderSummary({ cart: mockCart });

    render(Page);

    expect(screen.getByText("mock-product-title"));
  });
});
