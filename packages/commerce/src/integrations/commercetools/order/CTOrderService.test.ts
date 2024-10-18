import { LingoEnv } from "@ecommerce/utils";

import { OrderStatusType } from "../../../Order";
import CommercetoolsSdk, { CommercetoolsSdkClient } from "../CommercetoolsSdk";
import { env } from "../env";
import { CTOrderService } from "../order";
import fakeOrder from "./stubs/fakeOrder";
import fakePaidOrder from "./stubs/fakePaidOrder";
import fakeShippedOrder from "./stubs/fakeShippedOrder";

vi.mock("../CommercetoolsSdk");

describe("OrderService", () => {
  const orderService = new CTOrderService();

  const mockEnv = vi.mocked(env);
  const mockCommercetoolsSdk = vi.mocked(CommercetoolsSdk);

  const mockTranslatedResponse = {
    id: "fake-order-id",
    orderNumber: "US_FAKE_ORDER_NUMBER",
    customerEmail: "paddingtonbear6335@gmail.com",
    customerId: "test-customer-id",
    status: "Confirmed",
    isInitial: undefined,
    discountCodeId: "fake-discount-code-id",
    createdAt: "2024-03-05T05:54:45.077Z",
    totalPrice: 3900,
    billingAddress: {
      firstName: "Jane",
      lastName: "Doe",
      addressLine1: "9509 Alameda Ln",
      addressLine2: "",
      state: "MN",
      city: "Alameda",
      postalCode: "55347",
      countryCode: "US",
    },
    shippingAddress: {
      firstName: "Paddington",
      lastName: "Bear",
      addressLine1: "123 Mayfair Ave",
      addressLine2: "Apt 55A",
      state: "MN",
      city: "Alameda",
      postalCode: "55347",
      countryCode: "US",
    },
    shippingMethod: "UPS",
    totalNet: 3250,
    totalTax: 650,
    totalGross: 3900,
    version: 1,
    currencyCode: "GBP",
    lineItems: [
      {
        product: {
          id: "fake-product-id",
          sku: "FAKE_SKU",
          type: "subscription",
        },
        name: "Fake Line Item!",
        quantity: 1,
        price: 3900,
        taxRate: 0.2,
        taxAmount: 650,
        totalDiscount: 0,
        totalNet: 3250,
        totalGross: 3900,
      },
    ],
  };

  const cases: { env: LingoEnv; expectedRegex: RegExp }[] = [
    { env: "dev", expectedRegex: /^USL91[A-Z0-9]{7}$/ },
    { env: "qa", expectedRegex: /^USL92[A-Z0-9]{7}$/ },
    { env: "stg", expectedRegex: /^USL93[A-Z0-9]{7}$/ },
    { env: "prod", expectedRegex: /^USL[A-Z0-9]{9}$/ },
  ];

  describe("generateOrderNumber", () => {
    it.each(cases)(
      "should generate correct order number with length 12 in $env environment",
      ({ env, expectedRegex }) => {
        mockEnv.LINGO_ENV = env;

        const orderNumber = orderService.generateOrderNumber();

        expect(orderNumber).toMatch(expectedRegex);
        expect(orderNumber).toHaveLength(12);
      },
    );
  });

  it("successfully creates order from cart", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      carts: vi.fn().mockReturnThis(),
      customObjects: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      withContainerAndKey: vi.fn().mockReturnThis(),
      orders: vi.fn().mockReturnThis(),
      post: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValue({}).mockResolvedValueOnce({
        body: fakeOrder,
      }),
    } as unknown as CommercetoolsSdkClient);

    const order = await orderService.createOrderFromCart(
      "fake-cart-id",
      1,
      "fake-order-number",
    );

    expect(order).toEqual(mockTranslatedResponse);
  });

  it("successfully gets order by id", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      orders: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce({
        body: fakeOrder,
      }),
    } as unknown as CommercetoolsSdkClient);

    const orderData = await orderService.getOrderById(
      "7057443b-7e9e-43a4-b826-cd3b8f714734",
    );

    expect(orderData).toEqual(mockTranslatedResponse);
  });

  it("should get order by order number", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      orders: vi.fn().mockReturnThis(),
      withOrderNumber: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValue({ body: fakeOrder }),
    } as unknown as CommercetoolsSdkClient);

    const result = await orderService.getOrderByOrderNumber("GBL919372530");

    expect(result).toEqual(mockTranslatedResponse);
  });

  it("should get all order by customer id", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      orders: vi.fn().mockReturnThis(),
      withOrderNumber: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      execute: vi
        .fn()
        .mockResolvedValue({ body: { results: [fakeOrder, fakeOrder] } }),
    } as unknown as CommercetoolsSdkClient);

    const orders = await orderService.getAllOrders("fake-customer-id");

    expect(orders).toHaveLength(2);
    expect(orders[0]?.id).toBe(fakeOrder.id);
    expect(orders[1]?.id).toBe(fakeOrder.id);
  });

  it("should get most recent order by customer id", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      orders: vi.fn().mockReturnThis(),
      withOrderNumber: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValue({ body: { results: [fakeOrder] } }),
    } as unknown as CommercetoolsSdkClient);

    const order = await orderService.getMostRecentOrder("fake-customer-id");

    expect(order).toBeDefined();
    expect(order?.id).toBe(fakeOrder.id);
  });

  it("should update order order status with order number", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      orders: vi.fn().mockReturnThis(),
      withOrderNumber: vi.fn().mockReturnThis(),
      post: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValue({ body: fakeOrder }),
    } as unknown as CommercetoolsSdkClient);

    const result = await orderService.updateOrderStatus(
      OrderStatusType.Order,
      "Confirmed",
      "FAKE_US_ORDER_NUMBER",
      11,
    );

    expect(result).toEqual(mockTranslatedResponse);
  });

  it("should update shipment status with order number", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      orders: vi.fn().mockReturnThis(),
      withOrderNumber: vi.fn().mockReturnThis(),
      post: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValue({ body: fakeShippedOrder }),
    } as unknown as CommercetoolsSdkClient);

    const result = await orderService.updateOrderStatus(
      OrderStatusType.Shipment,
      "Shipped",
      "FAKE_US_ORDER_NUMBER",
      11,
    );

    expect(result?.shipmentStatus).toEqual("Shipped");
  });

  it("should update payment status with order number", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      orders: vi.fn().mockReturnThis(),
      withOrderNumber: vi.fn().mockReturnThis(),
      post: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValue({ body: fakePaidOrder }),
    } as unknown as CommercetoolsSdkClient);

    const result = await orderService.updateOrderStatus(
      OrderStatusType.Payment,
      "Paid",
      "FAKE_US_ORDER_NUMBER",
      11,
    );

    expect(result?.paymentStatus).toEqual("Paid");
  });
});
