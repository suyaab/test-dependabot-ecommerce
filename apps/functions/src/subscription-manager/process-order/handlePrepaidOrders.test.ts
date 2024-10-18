import {
  CartService,
  Customer,
  OrderService,
  ProductService,
  ServiceLocator,
  Subscription,
  SubscriptionService,
} from "@ecommerce/commerce";
import { Logger } from "@ecommerce/logger";

import { handlePrepaidOrders } from "./handlePrepaidOrders";
import mockOrder from "./stubs/mockOrder";

const mockLogger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
} as unknown as Logger;

const mockCart = {
  type: "Cart",
  id: "mock-create-cart-id",
  version: 1,
  versionModifiedAt: "2024-03-08T00:47:19.471Z",
  lastMessageSequenceNumber: 1,
  createdAt: "2024-03-08T00:47:19.471Z",
  lastModifiedAt: "2024-03-08T00:47:19.471Z",
  lastModifiedBy: {
    clientId: "mock-client-id",
    isPlatformClient: false,
  },
  createdBy: {
    clientId: "mock-client-id",
    isPlatformClient: false,
  },
  lineItems: [
    {
      id: "line-item-id",
      productId: "mock-product-id",
      productKey: "product-2",
      name: {
        en: "us",
      },
      productType: {
        typeId: "product-type",
        id: "mock-product-type-id",
        version: 1,
      },
      variant: {
        id: 1,
        prices: [
          {
            id: "mock-price-id",
            value: {
              type: "centPrecision",
              currencyCode: "USD",
              centAmount: 8900,
              fractionDigits: 2,
            },
          },
        ],
        images: [],
        attributes: [],
        assets: [],
      },
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
      discountedPricePerQuantity: [],
      perMethodTaxRate: [],
      addedAt: "2024-03-08T00:47:19.465Z",
      lastModifiedAt: "2024-03-08T00:47:19.465Z",
      state: [
        {
          quantity: 1,
          state: {
            typeId: "state",
            id: "mock-state-id",
          },
        },
      ],
      priceMode: "Platform",
      lineItemMode: "Standard",
      totalPrice: {
        type: "centPrecision",
        currencyCode: "USD",
        centAmount: 100,
        fractionDigits: 2,
      },
      taxedPricePortions: [],
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
  shippingMode: "Single",
  shipping: [],
  customLineItems: [],
  discountCodes: [],
  directDiscounts: [],
  inventoryMode: "None",
  taxMode: "Platform",
  taxRoundingMode: "HalfEven",
  taxCalculationMode: "LineItemLevel",
  refusedGifts: [],
  origin: "Customer",
  itemShippingAddresses: [],
  totalLineItemQuantity: 1,
};

const mockSubscription: Subscription = {
  customerId: "mock-customer-id",
  customerVersion: 1,
  status: "active",
  subscription: "mock-lingo-plan",
  prepaidShipmentsRemaining: 6,
  paymentMethodId: "fake-payment-method-id",
  parentOrderNumber: "mock-active-parent-order",
  nextOrderDate: new Date("mock-next-order-date"),
  notified: true,
};

const mockCustomer: Customer = {
  id: "mock-customer-id",
  version: 7,
  createdAt: new Date("2024-03-08T00:47:19.471Z"),
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

describe("handlePrepaidOrders", () => {
  let mockCartService: CartService;
  let mockOrderService: OrderService;
  let mockProductService: ProductService;
  let mockSubscriptionService: SubscriptionService;

  beforeEach(() => {
    mockCartService = {
      createCart: vi.fn().mockResolvedValue(mockCart),
    } as unknown as CartService;

    mockOrderService = {
      generateOrderNumber: vi.fn().mockReturnValue("USL123456789"),
      createOrderFromCart: vi.fn().mockResolvedValue(mockOrder),
    } as unknown as OrderService;

    mockProductService = {
      getProduct: vi.fn().mockResolvedValue({
        id: "mock-recurring-product-id",
        sku: "test-sku",
      }),
    } as unknown as ProductService;

    mockSubscriptionService = {
      fulfillSubscription: vi.fn().mockResolvedValue(mockSubscription),
    } as unknown as SubscriptionService;

    ServiceLocator.setCartService(mockCartService);
    ServiceLocator.setOrderService(mockOrderService);
    ServiceLocator.setProductService(mockProductService);
    ServiceLocator.setSubscriptionService(mockSubscriptionService);
  });

  it("can successfully create prepaid order", async () => {
    const newOrder = await handlePrepaidOrders(mockLogger, mockCustomer);

    expect(newOrder).toBeDefined();
    expect(newOrder.customerId).toBe("mock-customer-id");
  });

  it("should create a new cart with the customerEmail", async () => {
    mockCartService.createCart = vi.fn().mockResolvedValue({
      ...mockCart,
      customerEmail: mockCustomer.email,
    });

    const newOrder = await handlePrepaidOrders(mockLogger, mockCustomer);

    expect(newOrder).toBeDefined();
    expect(mockCartService.createCart).toHaveBeenCalledTimes(1);
    expect(mockCartService.createCart).toHaveBeenCalledWith(
      expect.objectContaining({
        customerEmail: mockCustomer.email,
      }),
    );
  });
});
