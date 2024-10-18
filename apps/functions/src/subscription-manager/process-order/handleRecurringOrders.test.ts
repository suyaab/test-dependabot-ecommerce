import {
  CartService,
  Customer,
  OrderService,
  PaymentService,
  ProductService,
  ServiceLocator,
  Subscription,
  SubscriptionService,
} from "@ecommerce/commerce";
import {
  PaymentGateway,
  ServiceLocator as SLFinance,
} from "@ecommerce/finance";
import { Logger } from "@ecommerce/logger";

import { handleRecurringOrders } from "./handleRecurringOrders";
import mockOrder from "./stubs/mockOrder";

const mockLogger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
} as unknown as Logger;

const mockCart = {
  id: "mock-create-cart-id",
  version: 1,
  lineItems: [
    {
      id: "mock-lingo-plan-product-id",
      productId: "mock-product-id",
      price: {
        id: "mock-cart-price-id",
        value: {
          type: "centPrecision",
          currencyCode: "USD",
          centAmount: 100,
          fractionDigits: 2,
        },
      },
      quantity: 1,
      totalGross: 12000,
    },
  ],
  cartState: "Active",
  totalPrice: {
    type: "centPrecision",
    currencyCode: "USD",
    centAmount: 8900,
    fractionDigits: 2,
  },
  country: "US",
};

const mockPayment = {
  id: "mock-payment-id",
  version: 7,
  interfaceId: "mock-payment-interface-id",
  channel: "ecommerce",
  registrationId: "mock-payment-registration-id",
  paymentInterface: "mock-payment-interface",
  paymentMethod: "CREDIT_CARD",
  paymentStatus: {
    interfaceCode: "mock-payment-interface-code",
    interfaceText: "mock-payment-interface-text",
  },
  amount: 7777,
  currency: "USD",
};

const mockSubscription: Subscription = {
  customerId: "mock-customer-id",
  customerVersion: 1,
  status: "active",
  subscription: "mock-lingo-plan-product-id",
  prepaidShipmentsRemaining: 3,
  paymentMethodId: "fake-payment-method-id",
  parentOrderNumber: "mock-parent-order-id",
  nextOrderDate: new Date("2022-01-01T00:00:00.000Z"),
  notified: false,
  nextPlanCartId: null,
};

const mockCustomer: Customer = {
  id: "mock-customer-id",
  version: 7,
  createdAt: new Date("2023-03-14T16:55:31.791Z"),
  email: "mock-customer-email",
  externalId: "mock-customer-external-id",
  firstName: "mock-customer-first-name",
  lastName: "mock-customer-last-name",
  customerNumber: "mock-customer-number",
  locale: "en",
  billingAddress: {
    firstName: "mock-address-first-name",
    lastName: "mock-address-last-name",
    addressLine1: "mock-address-line-1",
    addressLine2: "mock-address-line-2",
    state: "MN",
    city: "mock-address-city",
    postalCode: "12345",
    countryCode: "US",
  },
  shippingAddress: {
    firstName: "mock-address-first-name",
    lastName: "mock-address-last-name",
    addressLine1: "mock-address-line-1",
    addressLine2: "mock-address-line-2",
    state: "MN",
    city: "mock-address-city",
    postalCode: "12345",
    countryCode: "US",
  },
  customerGroup: {
    id: "mock-customer-group-id",
    name: "mock-customer-group-name",
  },
  subscription: mockSubscription,
};

describe("handleRecurringOrders", () => {
  it("can successfully create recurring order when the nextplan cart id is null", async () => {
    const mockProductService = {
      getProduct: vi.fn().mockResolvedValue({
        id: "mock-lingo-plan-product-id",
        sku: "USLGO123",
      }),
    } as unknown as ProductService;

    const mockCartService = {
      createCart: vi.fn().mockResolvedValue(mockCart),
      updateCartPaymentInfo: vi.fn().mockResolvedValue(mockCart),
    } as unknown as CartService;

    const mockPaymentService = {
      createPaymentReference: vi
        .fn()
        .mockResolvedValue({ id: "mock-payment-info", version: 33 }),
      createRecurringPaymentReference: vi
        .fn()
        .mockResolvedValue({ id: "mock-payment-info", version: 33 }),
    } as unknown as PaymentService;

    const mockOrderService = {
      generateOrderNumber: vi.fn().mockReturnValue("USL123456789"),
      createOrderFromCart: vi.fn().mockResolvedValue(mockOrder),
    } as unknown as OrderService;

    const mockPaymentGateway = {
      authorizeRecurringPayment: vi.fn().mockResolvedValue(mockPayment),
    } as unknown as PaymentGateway;

    const mockSubscriptionService = {
      renewSubscription: vi.fn().mockResolvedValue(mockSubscription),
      updateStoppedRetrying: vi.fn(),
    } as unknown as SubscriptionService;

    ServiceLocator.setProductService(mockProductService);
    ServiceLocator.setCartService(mockCartService);
    ServiceLocator.setPaymentService(mockPaymentService);
    ServiceLocator.setOrderService(mockOrderService);
    SLFinance.setPaymentGateway(mockPaymentGateway);
    ServiceLocator.setSubscriptionService(mockSubscriptionService);

    const newOrder = await handleRecurringOrders(
      mockLogger,
      mockCustomer,
      mockSubscription,
    );

    expect(newOrder).toBeDefined();
    expect(newOrder.customerId).toBe("mock-customer-id");
  });

  it("can successfully create recurring order when the nextplan cart id is NOT null", async () => {
    const mockProductService = {
      getProduct: vi.fn().mockResolvedValue({
        id: "mock-lingo-plan-product-id",
        sku: "USLGO123",
      }),
    } as unknown as ProductService;

    const mockCartService = {
      createCart: vi.fn().mockResolvedValue(mockCart),
      getCart: vi.fn().mockResolvedValue(mockCart),
      updateCartPaymentInfo: vi.fn().mockResolvedValue(mockCart),
      updateCartShippingAddress: vi.fn().mockResolvedValue(mockCart),
      updateCartBillingAddress: vi.fn().mockResolvedValue(mockCart),
    } as unknown as CartService;

    const mockPaymentService = {
      createPaymentReference: vi
        .fn()
        .mockResolvedValue({ id: "mock-payment-info", version: 33 }),
      createRecurringPaymentReference: vi
        .fn()
        .mockResolvedValue({ id: "mock-payment-info", version: 33 }),
    } as unknown as PaymentService;

    const mockOrderService = {
      generateOrderNumber: vi.fn().mockReturnValue("USL123456789"),
      createOrderFromCart: vi.fn().mockResolvedValue(mockOrder),
    } as unknown as OrderService;

    const mockPaymentGateway = {
      authorizeRecurringPayment: vi.fn().mockResolvedValue(mockPayment),
    } as unknown as PaymentGateway;
    const mockSubscriptionService = {
      renewSubscription: vi.fn().mockResolvedValue(mockSubscription),
      updateStoppedRetrying: vi.fn(),
    } as unknown as SubscriptionService;

    ServiceLocator.setProductService(mockProductService);
    ServiceLocator.setCartService(mockCartService);
    ServiceLocator.setPaymentService(mockPaymentService);
    ServiceLocator.setOrderService(mockOrderService);
    SLFinance.setPaymentGateway(mockPaymentGateway);
    ServiceLocator.setSubscriptionService(mockSubscriptionService);

    const mockSubscriptionWithCartId = {
      ...mockSubscription,
      nextPlanCartId: "mock-next-plan-cart-id",
    };

    const newOrder = await handleRecurringOrders(
      mockLogger,
      mockCustomer,
      mockSubscriptionWithCartId,
    );

    expect(newOrder).toBeDefined();
    expect(newOrder.customerId).toBe("mock-customer-id");
  });
});
