// @vitest-environment node

import { redirect } from "next/navigation";

import {
  CartService,
  CustomerService,
  OrderService,
  PaymentService,
  ServiceLocator as SLCommerce,
  SubscriptionService,
} from "@ecommerce/commerce";
import {
  ConsentManager,
  ServiceLocator as SLConsent,
} from "@ecommerce/consent";
import {
  CheckoutService,
  ServiceLocator as SLFinance,
} from "@ecommerce/finance";
import {
  MarketingService,
  ServiceLocator as SLMarketing,
} from "@ecommerce/marketing";

import ProcessingPage from "./page";

vi.mock("next/navigation");

vi.mock("next/headers");

vi.mock("server-only", () => {
  return {
    // mock server-only module
  };
});

const mockCartService = {
  getCart: vi.fn().mockResolvedValue({
    id: "test-id",
    marketingConsent: true,
    version: 1,
    contactInfo: {
      firstName: "test",
      lastName: "test",
      email: "",
      phone: "",
      marketingConsent: true,
    },
    lineItems: [
      {
        product: {
          type: "subscription",
        },
      },
    ],
  }),
  updateCartCustomerId: vi.fn().mockResolvedValue({
    version: 2,
  }),
  updateCartPaymentInfo: vi
    .fn()
    .mockResolvedValue({ id: "cart-with-payment-id", version: 2 }),
  removeCustomerFromCart: vi
    .fn()
    .mockResolvedValue({ id: "mock-cart-id", version: 2 }),
  removePaymentRefFromCart: vi.fn(),
} as unknown as CartService;

const mockMarketingService = {
  getUser: vi.fn().mockResolvedValue({ externalId: "test-external-id" }),
} as unknown as MarketingService;

const mockCustomerService = {
  createCustomerFromCart: vi.fn().mockResolvedValue(["customer-id"]),
  deleteCustomer: vi.fn(),
} as unknown as CustomerService;

const mockOrderService = {
  createOrderFromCart: vi.fn().mockResolvedValue({
    id: "mock-order-id",
    orderNumber: "mock-order-number",
    createdAt: new Date(),
    customerEmail: "mock@customer.email",
    shippingAddress: {
      firstName: "mock-billing-address-first-name",
      lastName: "mock-billing-address-last-name",
      addressLine1: "mock-billing-address-line-1",
      addressLine2: "mock-billing-address-line-2",
      city: "mock-billing-address-city",
      state: "MN",
      postalCode: "mock-billing-address-postal-code",
      countryCode: "US",
    },
    shippingMethod: "DHL",
  }),
} as unknown as OrderService;

const mockConsentManager = {
  postConsents: vi.fn().mockResolvedValue(true),
} as unknown as ConsentManager;

const mockCheckoutService = {
  getCheckoutPayment: vi.fn().mockResolvedValue({
    id: "checkout-payment-id",
    paymentMethod: {
      id: "registration-id",
    },
    orderNumber: "order-number",
  }),
} as unknown as CheckoutService;

const mockPaymentService = {
  createPaymentReference: vi
    .fn()
    .mockResolvedValue({ id: "payment-info-id", version: 1 }),
  deletePaymentReference: vi.fn(),
} as unknown as PaymentService;

const mockSubscriptionService = {
  createSubscription: vi.fn().mockResolvedValue(["mock-customer-id", 2]),
} as unknown as SubscriptionService;

function setupServices(
  mockCartService: CartService,
  mockMarketingService: MarketingService,
  mockCustomerService: CustomerService,
  mockOrderService: OrderService,
  mockConsentManager: ConsentManager,
  mockCheckoutService: CheckoutService,
  mockPaymentService: PaymentService,
  mockSubscriptionService: SubscriptionService,
) {
  SLCommerce.setCartService(mockCartService);
  SLMarketing.setMarketingService(mockMarketingService);
  SLCommerce.setCustomerService(mockCustomerService);
  SLCommerce.setOrderService(mockOrderService);
  SLConsent.setConsentManager(mockConsentManager);
  SLFinance.setCheckoutService(mockCheckoutService);
  SLCommerce.setPaymentService(mockPaymentService);
  SLCommerce.setSubscriptionService(mockSubscriptionService);
}

const mockCartId = "mock-cart-id";
const mockCheckoutSessionId = "mock-checkout-session-id";

describe("CheckoutProcessing", () => {
  const mockRequest = {
    params: {
      cartId: mockCartId,
    },
    searchParams: {
      id: mockCheckoutSessionId,
    },
  };

  const mockRedirect = vi.mocked(redirect);

  it("should handle successful payment order", async () => {
    setupServices(
      mockCartService,
      mockMarketingService,
      mockCustomerService,
      mockOrderService,
      mockConsentManager,
      mockCheckoutService,
      mockPaymentService,
      mockSubscriptionService,
    );

    await ProcessingPage(mockRequest);

    expect(mockRedirect).toHaveBeenCalledWith(
      "/order-confirmation/mock-order-id",
    );
  });

  it("should return error message if cart is not found", async () => {
    const mockCartServiceReturnNull = {
      getCart: vi.fn().mockResolvedValue(null),
    } as unknown as CartService;

    setupServices(
      mockCartServiceReturnNull,
      mockMarketingService,
      mockCustomerService,
      mockOrderService,
      mockConsentManager,
      mockCheckoutService,
      mockPaymentService,
      mockSubscriptionService,
    );

    await ProcessingPage(mockRequest);

    expect(mockRedirect).toHaveBeenCalledWith("/checkout?error");
  });

  it("should not return an error message if marketingService getUser fails", async () => {
    const mockMarketingServiceReturnNull = {
      getUser: vi.fn().mockRejectedValue(new Error()),
    } as unknown as MarketingService;

    setupServices(
      mockCartService,
      mockMarketingServiceReturnNull,
      mockCustomerService,
      mockOrderService,
      mockConsentManager,
      mockCheckoutService,
      mockPaymentService,
      mockSubscriptionService,
    );

    await ProcessingPage(mockRequest);

    expect(mockRedirect).toHaveBeenCalledWith(
      "/order-confirmation/mock-order-id",
    );
  });

  describe("rollback", () => {
    it("should delete customer if creating a subscription fails", async () => {
      const mockSubscriptionServiceReturnNull = {
        createSubscription: vi.fn().mockRejectedValue(new Error()),
      } as unknown as SubscriptionService;

      setupServices(
        mockCartService,
        mockMarketingService,
        mockCustomerService,
        mockOrderService,
        mockConsentManager,
        mockCheckoutService,
        mockPaymentService,
        mockSubscriptionServiceReturnNull,
      );

      await ProcessingPage(mockRequest);

      expect(mockCustomerService.deleteCustomer).toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledWith("/checkout?error");
    });

    it("should delete customer if creating payment reference fails", async () => {
      const mockPaymentServiceReturnNull = {
        createPaymentReference: vi.fn().mockRejectedValue(new Error()),
      } as unknown as PaymentService;

      setupServices(
        mockCartService,
        mockMarketingService,
        mockCustomerService,
        mockOrderService,
        mockConsentManager,
        mockCheckoutService,
        mockPaymentServiceReturnNull,
        mockSubscriptionService,
      );

      await ProcessingPage(mockRequest);

      expect(mockCustomerService.deleteCustomer).toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledWith("/checkout?error");
    });

    it("should delete customer and payment reference if updating cart with customer fails", async () => {
      const mockCartServiceReturnNull = {
        ...mockCartService,
        updateCartCustomerId: vi.fn().mockRejectedValue(new Error()),
      } as unknown as CartService;

      setupServices(
        mockCartServiceReturnNull,
        mockMarketingService,
        mockCustomerService,
        mockOrderService,
        mockConsentManager,
        mockCheckoutService,
        mockPaymentService,
        mockSubscriptionService,
      );

      await ProcessingPage(mockRequest);

      expect(mockCustomerService.deleteCustomer).toHaveBeenCalled();
      expect(mockPaymentService.deletePaymentReference).toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledWith("/checkout?error");
    });

    it("should delete customer and payment reference if updating cart with payment reference fails", async () => {
      const mockCartServiceReturnNull = {
        ...mockCartService,
        updateCartPaymentInfo: vi.fn().mockRejectedValue(new Error()),
      } as unknown as CartService;

      setupServices(
        mockCartServiceReturnNull,
        mockMarketingService,
        mockCustomerService,
        mockOrderService,
        mockConsentManager,
        mockCheckoutService,
        mockPaymentService,
        mockSubscriptionService,
      );

      await ProcessingPage(mockRequest);

      expect(mockCartService.removeCustomerFromCart).toHaveBeenCalled();
      expect(mockCustomerService.deleteCustomer).toHaveBeenCalled();
      expect(mockPaymentService.deletePaymentReference).toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledWith("/checkout?error");
    });

    it("should delete customer and payment reference if creating order from cart fails", async () => {
      const mockOrderServiceReturnNull = {
        createOrderFromCart: vi.fn().mockRejectedValue(new Error()),
      } as unknown as OrderService;

      setupServices(
        mockCartService,
        mockMarketingService,
        mockCustomerService,
        mockOrderServiceReturnNull,
        mockConsentManager,
        mockCheckoutService,
        mockPaymentService,
        mockSubscriptionService,
      );

      await ProcessingPage(mockRequest);

      expect(mockCartService.removeCustomerFromCart).toHaveBeenCalled();
      expect(mockCustomerService.deleteCustomer).toHaveBeenCalled();
      expect(mockCartService.removePaymentRefFromCart).toHaveBeenCalled();
      expect(mockPaymentService.deletePaymentReference).toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledWith("/checkout?error");
    });
  });
});
