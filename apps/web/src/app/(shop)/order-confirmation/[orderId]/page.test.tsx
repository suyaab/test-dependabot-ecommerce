import { render, screen } from "@testing-library/react";

import { CMS, ServiceLocator as CMSServiceLocator } from "@ecommerce/cms";
import {
  OrderService,
  PaymentService,
  ServiceLocator,
} from "@ecommerce/commerce";
import {
  ServiceLocator as FinanceSL,
  PaymentGateway,
} from "@ecommerce/finance";

import Page from "./page";
import { mockOrder } from "./stubs/mockOrder";
import { mockOrderConfirmationContent } from "./stubs/mockOrderConfirmationContent";
import { mockProductCardsContent } from "./stubs/mockProductCardsContent";

vi.mock("next/headers");

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

  const mockPaymentService = {
    getPaymentReference: vi
      .fn()
      .mockResolvedValue({ interfaceId: "mock-interface-id" }),
  } as unknown as PaymentService;

  const mockPaymentGateway = {
    getPayment: vi.fn().mockResolvedValue({
      paymentMethod: "VISA",
      card: { last4Digits: "9999", expiryMonth: "01", expiryYear: "2033" },
    }),
  } as unknown as PaymentGateway;

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
    getProductCardsContent: vi.fn().mockResolvedValue(mockProductCardsContent),
  } as unknown as CMS;

  it("successfully renders order confirmation page with mock CMS content", async () => {
    ServiceLocator.setOrderService(mockOrderService);
    ServiceLocator.setPaymentService(mockPaymentService);
    FinanceSL.setPaymentGateway(mockPaymentGateway);
    CMSServiceLocator.setCMS(mockCMS);

    const order = await Page({ params: { orderId: "fake-order-id" } });

    render(order);

    expect(screen.getByText(/Check your inbox/)).toBeInTheDocument();
    expect(screen.getByText(/Download the app/)).toBeInTheDocument();
  });

  it("successfully renders order confirmation page with mock order data", async () => {
    ServiceLocator.setOrderService(mockOrderService);
    ServiceLocator.setPaymentService(mockPaymentService);

    FinanceSL.setPaymentGateway(mockPaymentGateway);
    CMSServiceLocator.setCMS(mockCMS);

    const order = await Page({ params: { orderId: "fake-order-number" } });

    render(order);

    expect(
      screen.getByText(/paddingtonbear6335@gmail.com/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Estimated Delivery/)).toBeInTheDocument();
  });
});
