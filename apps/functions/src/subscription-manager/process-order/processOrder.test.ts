import { InvocationContext } from "@azure/functions";

import {
  createCustomerStub,
  createSubscriptionStub,
  ProductService,
  ServiceLocator,
  SubscriptionService,
} from "@ecommerce/commerce";
import {
  EmailService,
  ServiceLocator as NotificationServiceLocator,
} from "@ecommerce/notifications";

import { handlePrepaidOrders } from "./handlePrepaidOrders";
import { handleRecurringOrders } from "./handleRecurringOrders";
import processOrder from "./index";
import mockOrder from "./stubs/mockOrder";

vi.mock("../../env");
vi.mock("./handlePrepaidOrders");
vi.mock("./handleRecurringOrders");

describe("processOrder", () => {
  const mockContext = {
    invocationId: "mock-invocation-id",
  } as unknown as InvocationContext;

  const mockEmailService: EmailService = {
    sendEmail: vi.fn(),
  };

  const mockSubscriptionService = {
    updateStoppedRetrying: vi.fn(),
  } as unknown as SubscriptionService;

  const mockProductService = {
    getProduct: vi.fn().mockResolvedValue({
      type: "subscription",
      attributes: { autoRenew: true },
    }),
  } as unknown as ProductService;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2020-01-02T00:00:00Z"));
    ServiceLocator.setProductService(mockProductService);
    ServiceLocator.setSubscriptionService(mockSubscriptionService);
    NotificationServiceLocator.setEmailService(mockEmailService);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("can successfully handle prepaid orders", async () => {
    const mockHandlePrepaidOrders = vi.mocked(handlePrepaidOrders);
    mockHandlePrepaidOrders.mockResolvedValue(mockOrder);

    await processOrder(
      createCustomerStub({
        subscription: createSubscriptionStub({
          nextOrderDate: new Date("2020-01-01T00:00:00Z"),
          prepaidShipmentsRemaining: 3,
          status: "active",
        }),
      }),
      mockContext,
    );

    expect(handlePrepaidOrders).toHaveBeenCalled();
    expect(handlePrepaidOrders).toHaveResolvedWith(mockOrder);
  });

  it("can successfully handle recurring orders", async () => {
    const mockHandleRecurringOrders = vi.mocked(handleRecurringOrders);
    mockHandleRecurringOrders.mockResolvedValue(mockOrder);

    await processOrder(
      createCustomerStub({
        subscription: createSubscriptionStub({
          nextOrderDate: new Date("2020-01-01T00:00:00Z"),
          prepaidShipmentsRemaining: 0,
          status: "active",
        }),
      }),
      mockContext,
    );

    expect(handleRecurringOrders).toHaveBeenCalled();
    expect(handleRecurringOrders).toHaveResolvedWith(mockOrder);
  });

  it("can successfully handle no auto renew", async () => {
    const mockHandleRecurringOrders = vi.mocked(handleRecurringOrders);
    const mockHandlePrepaidOrders = vi.mocked(handlePrepaidOrders);
    const updateSubscriptionStatusSpy = vi.fn();

    const mockProductService = {
      getProduct: vi.fn().mockResolvedValue({
        type: "subscription",
        attributes: { autoRenew: false },
      }),
    } as unknown as ProductService;
    ServiceLocator.setProductService(mockProductService);

    const mockSubscriptionService = {
      updateSubscriptionStatus: updateSubscriptionStatusSpy,
    } as unknown as SubscriptionService;
    ServiceLocator.setSubscriptionService(mockSubscriptionService);

    await processOrder(
      createCustomerStub({
        subscription: createSubscriptionStub({
          nextOrderDate: new Date("2020-01-01T00:00:00Z"),
          prepaidShipmentsRemaining: 0,
          status: "active",
        }),
      }),
      mockContext,
    );

    expect(updateSubscriptionStatusSpy).toHaveBeenCalled();

    expect(mockHandleRecurringOrders).not.toHaveBeenCalled();
    expect(mockHandlePrepaidOrders).not.toHaveBeenCalled();
  });

  it("won't process order if next order date is in the future", async () => {
    const mockHandleRecurringOrders = vi.mocked(handleRecurringOrders);
    const mockHandlePrepaidOrders = vi.mocked(handlePrepaidOrders);

    await processOrder(
      createCustomerStub({
        subscription: createSubscriptionStub({
          nextOrderDate: new Date("2020-01-03T00:00:00Z"),
          stoppedRetrying: false,
        }),
      }),
      mockContext,
    );

    expect(mockHandleRecurringOrders).not.toHaveBeenCalled();
    expect(mockHandlePrepaidOrders).not.toHaveBeenCalled();
  });

  it("won't process order if subscription is stopped retrying is true", async () => {
    const mockHandleRecurringOrders = vi.mocked(handleRecurringOrders);
    const mockHandlePrepaidOrders = vi.mocked(handlePrepaidOrders);

    await processOrder(
      createCustomerStub({
        subscription: createSubscriptionStub({
          nextOrderDate: new Date("2020-01-01T00:00:00Z"),
          stoppedRetrying: true,
        }),
      }),
      mockContext,
    );

    expect(mockHandleRecurringOrders).not.toHaveBeenCalled();
    expect(mockHandlePrepaidOrders).not.toHaveBeenCalled();
  });

  it("won't process order if subscription is not active and prepaid shipments is 0 and nexPlan is null", async () => {
    const mockHandleRecurringOrders = vi.mocked(handleRecurringOrders);
    const mockHandlePrepaidOrders = vi.mocked(handlePrepaidOrders);

    await processOrder(
      createCustomerStub({
        subscription: createSubscriptionStub({
          nextOrderDate: new Date("2020-01-01T00:00:00Z"),
          status: "inactive",
          prepaidShipmentsRemaining: 0,
          nextPlan: null,
        }),
      }),
      mockContext,
    );

    expect(mockHandleRecurringOrders).not.toHaveBeenCalled();
    expect(mockHandlePrepaidOrders).not.toHaveBeenCalled();
  });
});
