import {
  CustomerService,
  ProductService,
  ServiceLocator,
} from "../../../index";
import CommercetoolsSdk, { CommercetoolsSdkClient } from "../CommercetoolsSdk";
import CTSubscriptionService from "./CTSubscriptionService";
import { cancelSubscriptionResponse } from "./stubs/cancelSubscriptionResponse";
import { createSubscriptionResponse } from "./stubs/createSubscriptionResponse";
import { fulfillSubscriptionResponse } from "./stubs/fulfillSubscriptionResponse";
import { renewSubscriptionResponse } from "./stubs/renewSubscriptionResponse";
import { subscriptionResponse } from "./stubs/subscriptionResponse";

vi.mock("../CommercetoolsSdk");

describe("SubscriptionService", () => {
  const subscriptionService = new CTSubscriptionService();
  const mockCommercetoolsSdk = vi.mocked(CommercetoolsSdk);

  const mockCustomerService = {
    getCustomerById: vi.fn().mockResolvedValue({ id: "fake-customer-id " }),
  } as unknown as CustomerService;

  const mockProductService = {
    getProduct: vi.fn().mockResolvedValue({
      id: "fake-product-id",
      type: "subscription",
      attributes: { shipmentFrequency: 28, prepaidShipments: 1 },
    }),
  } as unknown as ProductService;

  const mockDateToday = new Date("2024-06-06T00:00:00.000Z");

  beforeEach(() => {
    ServiceLocator.setCustomerService(mockCustomerService);
    ServiceLocator.setProductService(mockProductService);

    vi.useFakeTimers();
    vi.setSystemTime(mockDateToday);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("can successfully create a subscription", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      customers: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      execute: vi
        .fn()
        .mockResolvedValueOnce({ body: createSubscriptionResponse }),
    } as unknown as CommercetoolsSdkClient);

    const subscription =
      await subscriptionService.getSubscription("fake-customer-id-1");

    expect(subscription?.status).toBe("active");
    expect(subscription?.parentOrderNumber).toBe("mock-parent-order-number");
    expect(subscription?.subscription).toBe("mock-lingo-product-id");
    expect(subscription?.prepaidShipmentsRemaining).toBe(2);
    expect(subscription?.nextOrderDate).toEqual(
      new Date("2026-06-06T00:00:00.000Z"),
    );
    expect(subscription?.cancellationDate).toBeUndefined();
    expect(subscription?.notified).toBe(false);
  });

  it("can successfully get a subscription by customer id", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      customers: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce({ body: subscriptionResponse }),
    } as unknown as CommercetoolsSdkClient);

    const subscription =
      await subscriptionService.getSubscription("fake-customer-id-1");

    expect(subscription?.status).toBe("cancelled");
    expect(subscription?.parentOrderNumber).toBe("mock-parent-order-number");
    expect(subscription?.subscription).toBe("mock-lingo-product-id");
    expect(subscription?.prepaidShipmentsRemaining).toBe(2);
    expect(subscription?.nextOrderDate).toEqual(
      new Date("2023-01-01T00:00:00.000Z"),
    );
    expect(subscription?.cancellationDate).toEqual(
      new Date("2022-01-01T00:00:00.000Z"),
    );
    expect(subscription?.notified).toBeFalsy();
  });

  it("can successfully fulfill a prepaid subscription", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValueOnce({
      customers: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce({
        body: subscriptionResponse,
      }),
    } as unknown as CommercetoolsSdkClient);

    mockCommercetoolsSdk.getClient.mockReturnValue({
      customers: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      post: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce({
        body: fulfillSubscriptionResponse,
      }),
    } as unknown as CommercetoolsSdkClient);

    const subscription = await subscriptionService.fulfillSubscription(
      "fake-id-1",
      1,
    );

    expect(subscription.nextOrderDate).toEqual(
      new Date("2024-04-04T00:00:00.000Z"),
    );
    expect(subscription.prepaidShipmentsRemaining).toBe(8);
  });

  it("can successfully renew a subscription", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValueOnce({
      customers: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce({
        body: subscriptionResponse,
      }),
    } as unknown as CommercetoolsSdkClient);

    mockCommercetoolsSdk.getClient.mockReturnValue({
      customers: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      post: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce({
        body: renewSubscriptionResponse,
      }),
    } as unknown as CommercetoolsSdkClient);

    const subscription = await subscriptionService.renewSubscription(
      "fake-id-1",
      1,
      "USL000000",
    );

    expect(subscription.prepaidShipmentsRemaining).toBe(0);
    expect(subscription.nextOrderDate).toEqual(
      new Date("2024-05-05T00:00:00.000Z"),
    );
  });

  it("can successfully cancel a subscription", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValueOnce({
      customers: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce({
        body: subscriptionResponse,
      }),
    } as unknown as CommercetoolsSdkClient);

    mockCommercetoolsSdk.getClient.mockReturnValue({
      customers: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      post: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce({
        body: cancelSubscriptionResponse,
      }),
    } as unknown as CommercetoolsSdkClient);

    const cancelledSubscription = await subscriptionService.cancelSubscription(
      "fake-id-1",
      1,
    );

    expect(cancelledSubscription.status).toBe("cancelled");
    expect(cancelledSubscription.cancellationDate).toEqual(mockDateToday);
  });

  it("can successfully sets subscription stopped retrying", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      customers: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      post: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce({ body: subscriptionResponse }),
    } as unknown as CommercetoolsSdkClient);

    const subscription = await subscriptionService.updateStoppedRetrying(
      "fake-id-1",
      3,
      true,
    );

    expect(subscription?.stoppedRetrying).toBe(true);
  });

  it("can updates payment method id successfully and sets the stoppedRetrying to false", async () => {
    const customerId = "fake-customer-id";
    const customerVersion = 1;
    const paymentMethodId = "new-payment-method-id";

    mockCommercetoolsSdk.getClient.mockReturnValueOnce({
      customers: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce({
        body: subscriptionResponse,
      }),
    } as unknown as CommercetoolsSdkClient);

    const postMock = vi.fn().mockReturnThis();

    mockCommercetoolsSdk.getClient.mockReturnValue({
      customers: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      post: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce({ body: subscriptionResponse }),
    } as unknown as CommercetoolsSdkClient);

    mockCommercetoolsSdk.getClient.mockReturnValue({
      customers: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      post: postMock,
      execute: vi.fn().mockResolvedValueOnce({ body: subscriptionResponse }),
    } as unknown as CommercetoolsSdkClient);

    await subscriptionService.updatePaymentMethod(
      customerId,
      customerVersion,
      paymentMethodId,
    );

    const mockActions = [
      {
        action: "setCustomField",
        name: "paymentMethodId",
        value: "new-payment-method-id",
      },
      { action: "setCustomField", name: "stoppedRetrying", value: false },
    ];

    expect(postMock).toHaveBeenCalledWith({
      body: {
        version: customerVersion,
        actions: mockActions,
      },
    });
  });
});
