import {
  Cart,
  CartService,
  ServiceLocator as CommerceServiceLocator,
  CustomerService,
  defaultCustomer,
  OrderService,
  SubscriptionService,
} from "@ecommerce/commerce";
import {
  ConsentManager,
  ServiceLocator as ConsentServiceLocator,
} from "@ecommerce/consent";
import {
  MarketingService,
  ServiceLocator as MarketingServiceLocator,
} from "@ecommerce/marketing";

import { completeCoreCheckout } from "./completeCoreCheckout";

vi.mock("server-only", () => {
  return {
    // mock server-only module
  };
});

describe("completePromoCheckout", () => {
  const mockCartId = "fake-cart-id";

  const mockValidCart: Cart = {
    currency: "USD",
    isActive: true,
    id: "fake-cart-id",
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
        id: "fake-line-item-id",
        product: {
          id: "fake-product-id",
          sku: "FAKE_SKU",
          type: "subscription",
        },
        name: "Fake Line Item",
        quantity: 1,
        price: 0,
        taxRate: 0,
        totalDiscount: 0,
        totalNet: 0,
        totalGross: 0,
      },
    ],
    discountCodes: [
      {
        discountCode: {
          id: "fake-discount-code-id",
          code: "FAKE_CODE",
          version: 2,
        },
        state: "MatchesCart",
      },
    ],
    subtotal: 0,
    totalPrice: 0,
  };

  const mockCartService = {
    getCart: vi.fn().mockResolvedValue(mockValidCart),
    updateCartCustomerId: vi.fn().mockResolvedValue(mockValidCart),
  } as unknown as CartService;

  const mockMarketingService = {
    getUser: vi.fn().mockResolvedValue({ externalId: "test-external-id" }),
  } as unknown as MarketingService;

  const mockCustomerService = {
    createCustomerFromCart: vi.fn().mockResolvedValue(defaultCustomer),
  } as unknown as CustomerService;

  const mockOrderService = {
    generateOrderNumber: vi.fn().mockReturnValue("USL9121321"),
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

  const mockSubscriptionService = {
    createSubscription: vi.fn().mockResolvedValue(true),
  } as unknown as SubscriptionService;

  const mockConsentManager = {
    postConsents: vi.fn().mockResolvedValue(true),
  } as unknown as ConsentManager;

  it("can successfully complete sample checkout", async () => {
    CommerceServiceLocator.setCartService(mockCartService);
    CommerceServiceLocator.setCustomerService(mockCustomerService);
    CommerceServiceLocator.setOrderService(mockOrderService);
    CommerceServiceLocator.setSubscriptionService(mockSubscriptionService);
    MarketingServiceLocator.setMarketingService(mockMarketingService);
    ConsentServiceLocator.setConsentManager(mockConsentManager);

    const response = await completeCoreCheckout(mockCartId);

    expect(response.ok).toBe(true);
  });

  it("should fail to update cart with invalid promo code", async () => {
    const mockInvalidCart: Cart = {
      currency: "USD",
      isActive: true,
      id: "fake-cart-id",
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
          id: "fake-line-item-id",
          product: {
            id: "fake-product-id",
            sku: "FAKE_SKU",
            type: "subscription",
          },
          name: "Fake Line Item",
          quantity: 1,
          price: 0,
          taxRate: 0,
          totalDiscount: 0,
          totalNet: 0,
          totalGross: 0,
        },
      ],
      discountCodes: [
        {
          discountCode: {
            id: "fake-discount-code-id",
            code: "FAKE_CODE",
            version: 2,
          },
          state: "MatchesCart",
        },
      ],
      subtotal: 0,
      totalPrice: 0,
    };

    const mockCartService = {
      updateCartShippingAddress: vi.fn().mockResolvedValue(mockInvalidCart),
    } as unknown as CartService;

    CommerceServiceLocator.setCartService(mockCartService);

    const result = await completeCoreCheckout(mockCartId);

    assert(!result.ok);
  });

  it("should fail to update cart with invalid payload", async () => {
    const result = await completeCoreCheckout(mockCartId);

    assert(!result.ok);
  });
});
