import { HttpRequest, InvocationContext } from "@azure/functions";

import { CustomerService, ServiceLocator } from "@ecommerce/commerce";

import { createCustomer } from "./index";

describe("ecommerce-api-create-customer", () => {
  const mockContext = {} as unknown as InvocationContext;

  it("creates a customer with a status code of 200", async () => {
    const mockEmail = "fakeemail@email.com";
    const mockExternalId = "some-uuid";
    const mockFirstName = "fakefirst";
    const mockLastName = "fakelast";
    const mockPhone = "1111111111";
    const mockCustomerService = {
      createCustomer: vi.fn().mockResolvedValue({
        externalId: mockExternalId,
        email: mockEmail,
        firstName: mockFirstName,
        lastName: mockLastName,
        phone: mockPhone,
      }),
      getCustomerByExternalId: vi.fn().mockResolvedValue(null),
    } as unknown as CustomerService;

    ServiceLocator.setCustomerService(mockCustomerService);

    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        externalId: mockExternalId,
        email: mockEmail,
        firstName: mockFirstName,
        lastName: mockLastName,
        phone: mockPhone,
      }),
    } as unknown as HttpRequest;

    const response = await createCustomer(mockRequest, mockContext);

    expect(response.status).toBe(200);
  });
  it("returns a bad request when the customer already exists", async () => {
    const mockExternalId = "some-uuid";
    const mockEmail = "fakeemail@email.com";
    const mockFirstName = "fakefirst";
    const mockLastName = "fakelast";
    const mockPhone = "1111111111";
    const mockCustomerService = {
      createCustomer: vi.fn().mockResolvedValue({
        externalId: mockExternalId,
        email: mockEmail,
        firstName: mockFirstName,
        lastName: mockLastName,
        phone: mockPhone,
      }),
      getCustomerByExternalId: vi.fn().mockResolvedValue({
        externalId: mockExternalId,
      }),
    } as unknown as CustomerService;

    ServiceLocator.setCustomerService(mockCustomerService);
    const mockRequest = {
      json: vi.fn().mockResolvedValue({ externalId: mockExternalId }),
    } as unknown as HttpRequest;

    const response = await createCustomer(mockRequest, mockContext);
    expect(response.status).toBe(400);
  });

  it("returns a internal server error when an error occurs", async () => {
    const mockCustomerService = {
      createCustomer: vi.fn().mockResolvedValue(null),
      updateCustomerInformation: vi.fn().mockResolvedValue(null),
    } as unknown as CustomerService;

    ServiceLocator.setCustomerService(mockCustomerService);

    const mockRequest = {
      json: vi.fn().mockResolvedValue({ email: "invalidemail@email.coom" }),
    } as unknown as HttpRequest;

    const response = await createCustomer(mockRequest, mockContext);
    expect(response.status).toBe(400);
  });
});
