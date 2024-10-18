// @vitest-environment: node

import { render, screen } from "@testing-library/react";

import { CMS, ServiceLocator as CMSServiceLocator } from "@ecommerce/cms";

import OrderSummary from "./OrderSummary";
import { mockProductCardsContent } from "./stubs/mockProductCardsContent";

const mockCMS = {
  getPromotionalProductCardsContent: vi
    .fn()
    .mockResolvedValue(mockProductCardsContent),
  getCheckoutProductsContent: vi,
} as unknown as CMS;

vi.mock("next/headers");

describe("OrderSummary", () => {
  it("can successfully show order summary", async () => {
    CMSServiceLocator.setCMS(mockCMS);

    const Page = await OrderSummary({ sku: "fake-product-sku" });

    render(Page);

    expect(screen.getByText("mock-product-title"));
  });
});
