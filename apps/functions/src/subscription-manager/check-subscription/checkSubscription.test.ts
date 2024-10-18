import { InvocationContext, Timer } from "@azure/functions";

import { CustomerService, ServiceLocator } from "@ecommerce/commerce";

import checkSubscription from "./index";

describe("checkSubscription", () => {
  const mockTimer = {} as unknown as Timer;

  const mockContext = {} as unknown as InvocationContext;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("can successfully return customers with upcoming subscription as sb messages", async () => {
    const mockCustomerService = {
      getCustomersWithUpcomingSubscription: vi.fn().mockResolvedValue([
        [
          { id: "mock-customer-prepaid-order-1", version: 1 },
          { id: "mock-customer-recurring-order-2", version: 2 },
        ],
        [],
      ]),
    } as unknown as CustomerService;

    ServiceLocator.setCustomerService(mockCustomerService);

    const messages = await checkSubscription(mockTimer, mockContext);

    expect(messages).toStrictEqual([
      {
        id: "mock-customer-prepaid-order-1",
        version: 1,
      },
      {
        id: "mock-customer-recurring-order-2",
        version: 2,
      },
    ]);
  });
});
