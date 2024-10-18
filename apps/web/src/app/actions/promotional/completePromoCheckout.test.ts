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
import { Address } from "@ecommerce/utils";

import { completePromoCheckout } from "./completePromoCheckout";

vi.mock("server-only", () => {
  return {
    // mock server-only module
  };
});

describe("completePromoCheckout", () => {
  const mockCartId = "fake-cart-id";
  const mockCartVersion = 1;

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
    updateCartShippingAddress: vi.fn().mockResolvedValue(mockValidCart),
  } as unknown as CartService;

  const mockMarketingService = {
    getUser: vi.fn().mockResolvedValue({
      externalId: "test-external-id",
      subscribed: "subscribed",
    }),
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

  const validMockAddress: Address = {
    firstName: "fake-first-name",
    lastName: "fake-last-name",
    addressLine1: "fake-address-line-1",
    addressLine2: "",
    city: "fake-city",
    state: "CA",
    postalCode: "55347",
    countryCode: "US",
  };

  beforeEach(() => {
    CommerceServiceLocator.setCartService(mockCartService);
    CommerceServiceLocator.setCustomerService(mockCustomerService);
    CommerceServiceLocator.setOrderService(mockOrderService);
    CommerceServiceLocator.setSubscriptionService(mockSubscriptionService);
    MarketingServiceLocator.setMarketingService(mockMarketingService);
    ConsentServiceLocator.setConsentManager(mockConsentManager);
  });

  it("can successfully complete sample checkout", async () => {
    const response = await completePromoCheckout(
      mockCartId,
      mockCartVersion,
      validMockAddress,
    );

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
          state: "DoesNotMatchCart",
        },
      ],
      subtotal: 0,
      totalPrice: 0,
    };

    const mockCartService = {
      updateCartShippingAddress: vi.fn().mockResolvedValue(mockInvalidCart),
    } as unknown as CartService;

    CommerceServiceLocator.setCartService(mockCartService);

    const result = await completePromoCheckout(
      mockCartId,
      mockCartVersion,
      validMockAddress,
    );

    assert(!result.ok);
    expect(result.message).toBe(
      "An unexpected error occurred while completing your order. Please try again later.",
    );
  });

  it("should fail to update cart with invalid payload", async () => {
    const result = await completePromoCheckout(
      mockCartId,
      mockCartVersion,
      {} as unknown as Address,
    );

    assert(!result.ok);
    expect(result.message).toBe(
      "The shipping address provided is invalid, please check the form and try again.",
    );
  });

  it("should fail to update cart with invalid country code", async () => {
    const mockInvalidAddress: Address = {
      firstName: "fake-first-name",
      lastName: "fake-last-name",
      addressLine1: "fake-address-line-1",
      addressLine2: "",
      city: "fake-city",
      state: "CA",
      postalCode: "55347",
      countryCode: "CANADA" as unknown as "US",
    };

    const result = await completePromoCheckout(
      mockCartId,
      mockCartVersion,
      mockInvalidAddress,
    );

    assert(!result.ok);
    expect(result.message).toBe(
      "The shipping address provided is invalid, please check the form and try again.",
    );
  });

  it("should not fail if marketing service getUser throws an error", async () => {
    const mockMarketingService = {
      getUser: vi.fn().mockRejectedValue(new Error()),
    } as unknown as MarketingService;

    MarketingServiceLocator.setMarketingService(mockMarketingService);

    const mockAddress: Address = {
      firstName: "fake-first-name",
      lastName: "fake-last-name",
      addressLine1: "fake-address-line-1",
      addressLine2: "",
      city: "fake-city",
      state: "CA",
      postalCode: "55347",
      countryCode: "US",
    };

    const response = await completePromoCheckout(
      mockCartId,
      mockCartVersion,
      mockAddress,
    );

    expect(response.ok).toBe(true);
  });
});
