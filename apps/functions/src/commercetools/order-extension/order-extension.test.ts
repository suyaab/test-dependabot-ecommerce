import { HttpRequest, InvocationContext } from "@azure/functions";

import { OrderService, ServiceLocator } from "@ecommerce/commerce";

import orderExtension from "./index";

describe("ct-order-extension", () => {
  const mockContext = {} as unknown as InvocationContext;

  it("can successfully update an order number", async () => {
    const mockOrderService = {
      generateOrderNumber: vi.fn().mockReturnValue("USL123456789"),
    } as unknown as OrderService;

    ServiceLocator.setOrderService(mockOrderService);

    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        action: "Create",
        resource: {
          obj: {
            id: "fake-order-id",
          },
        },
      }),
    } as unknown as HttpRequest;

    const response = await orderExtension(mockRequest, mockContext);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it("will not update a customer if one exists", async () => {
    const mockOrderService = {
      generateOrderNumber: vi.fn().mockReturnValue("USL123456789"),
    } as unknown as OrderService;

    ServiceLocator.setOrderService(mockOrderService);

    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        action: "Create",
        resource: {
          obj: {
            id: "fake-order-id",
            orderNumber: "fake-order-number",
          },
        },
      }),
    } as unknown as HttpRequest;

    const response = await orderExtension(mockRequest, mockContext);

    expect(response.status).toBe(200);
    expect(response.body).toBeUndefined();
  });
});
