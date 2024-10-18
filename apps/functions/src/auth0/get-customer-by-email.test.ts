import { HttpRequest, InvocationContext } from "@azure/functions";

import { CustomerService, ServiceLocator } from "@ecommerce/commerce";

import getCustomerByEmail from "./index";

describe("auth0-get-customer", () => {
  const mockContext = {} as unknown as InvocationContext;

  it("returns customer information given email when customer exists", async () => {
    const mockEmail = "someemail@abc.com";
    const mockUUID = "some-uuid";
    const mockCountryCode = "US";
    const mockCustomerService = {
      getCustomerByEmail: vi.fn().mockReturnValue({
        id: mockUUID,
        externalId: mockUUID,
        mockEmail,
        shippingAddress: {
          countryCode: mockCountryCode,
        },
      }),
    } as unknown as CustomerService;

    ServiceLocator.setCustomerService(mockCustomerService);

    const mockRequest = {
      json: vi.fn().mockResolvedValue({ email: mockEmail }),
    } as unknown as HttpRequest;

    const response = await getCustomerByEmail(mockRequest, mockContext);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it("returns not found when customer does not exist", async () => {
    const mockCustomerService = {
      getCustomerByEmail: vi.fn().mockReturnValue(undefined),
    } as unknown as CustomerService;

    ServiceLocator.setCustomerService(mockCustomerService);

    const mockRequest = {
      json: vi.fn().mockResolvedValue({ email: "someEmail@a.com" }),
    } as unknown as HttpRequest;

    const response = await getCustomerByEmail(mockRequest, mockContext);

    expect(response.status).toBe(404);
    expect(response.body).toBeUndefined();
  });
});
