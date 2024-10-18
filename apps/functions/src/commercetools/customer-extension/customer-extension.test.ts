import { HttpRequest, InvocationContext } from "@azure/functions";

import { CustomerService, ServiceLocator } from "@ecommerce/commerce";

import customerExtension from "./index";

vi.mock("../../env");

describe("ct-customer-extension", () => {
  const mockContext = {} as unknown as InvocationContext;

  it("can successfully update a customer number", async () => {
    const mockCustomerService = {
      generateCustomerNumber: vi.fn().mockReturnValue("mock-customer-number"),
    } as unknown as CustomerService;

    ServiceLocator.setCustomerService(mockCustomerService);

    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        action: "Create",
        resource: {
          obj: {
            id: "fake-customer-id",
          },
        },
      }),
    } as unknown as HttpRequest;

    const response = await customerExtension(mockRequest, mockContext);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it("will not update a customer if one exists", async () => {
    const mockCustomerService = {
      generateCustomerNumber: vi.fn().mockReturnValue("mock-customer-number"),
    } as unknown as CustomerService;

    ServiceLocator.setCustomerService(mockCustomerService);

    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        action: "Create",
        resource: {
          obj: {
            id: "fake-customer-id",
            customerNumber: "fake-customer-number",
          },
        },
      }),
    } as unknown as HttpRequest;

    const response = await customerExtension(mockRequest, mockContext);

    expect(response.status).toBe(200);
    expect(response.body).toBeUndefined();
  });
});
