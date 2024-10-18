import { render, screen } from "@testing-library/react";

import { CMS, ServiceLocator as CMSServiceLocator } from "@ecommerce/cms";
import { OrderService, ServiceLocator } from "@ecommerce/commerce";

import Page from "./page";
import { mockOrder } from "./stubs/mockOrder";
import { mockOrderConfirmationContent } from "./stubs/mockOrderConfirmationContent";
import { mockProductCardsContent } from "./stubs/mockProductCardsContent";

vi.mock("~/components/order/PaymentSection");

vi.mock("~/app/actions/checkout/checkoutSession", () => ({
  deleteCheckoutSessionIdCookie: vi.fn(),
}));

vi.mock("~/app/actions/checkout/getCart", () => ({
  deleteCartIdCookie: vi.fn(),
}));

global.fetch = vi.fn();

describe("orderConfirmation", () => {
  const mockOrderService = {
    getOrderById: vi.fn().mockResolvedValue(mockOrder),
  } as unknown as OrderService;

  const mockCMS = {
    getOrderConfirmationContent: vi
      .fn()
      .mockResolvedValue(mockOrderConfirmationContent),
    getProductDetails: vi.fn().mockResolvedValue({
      imageUrl: "/images/temp/boxshotplaceholder.png",
      title: "mock-product-title",
      description: "mock-product-description",
      deliveryDetails: "mock-product-delivery-details",
    }),
    getPromotionalProductCardsContent: vi
      .fn()
      .mockResolvedValue(mockProductCardsContent),
  } as unknown as CMS;

  it("successfully renders order confirmation page with mock CMS content", async () => {
    ServiceLocator.setOrderService(mockOrderService);
    CMSServiceLocator.setCMS(mockCMS);

    const order = await Page({ params: { orderId: "fake-order-id" } });

    render(order);

    expect(screen.getByText(/Check your inbox/)).toBeInTheDocument();
    expect(screen.getByText(/Download the app/)).toBeInTheDocument();
  });

  it("successfully renders order confirmation page with mock order data", async () => {
    ServiceLocator.setOrderService(mockOrderService);

    CMSServiceLocator.setCMS(mockCMS);

    const order = await Page({ params: { orderId: "fake-order-number" } });

    render(order);

    expect(
      screen.getByText(/paddingtonbear6335@gmail.com/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Estimated Delivery/)).toBeInTheDocument();
  });
});
