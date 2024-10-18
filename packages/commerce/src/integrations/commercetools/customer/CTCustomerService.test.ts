import {
  Customer as CTCustomer,
  CustomerGroup as CTCustomerGroup,
} from "@commercetools/platform-sdk";

import {
  Address,
  createStub,
  defaultAddressStub,
  LingoEnv,
} from "@ecommerce/utils";

import { Cart } from "../../../Cart";
import defaultCart from "../../../stubs/defaultCart";
import CommercetoolsSdk, { CommercetoolsSdkClient } from "../CommercetoolsSdk";
import { env } from "../env";
import CTCustomerService from "./CTCustomerService";
import defaultCTCreateCustomer from "./stubs/defaultCTCreateCustomer";
import defaultCTCustomer from "./stubs/defaultCTCustomer";
import defaultCTCustomerGroup from "./stubs/defaultCTCustomerGroup";

vi.mock("../CommercetoolsSdk");

describe("CTCustomerService", () => {
  const ctCustomerService = CTCustomerService.getInstance();

  const mockEnv = vi.mocked(env);
  const mockCommercetoolsService = vi.mocked(CommercetoolsSdk);

  const cases: { env: LingoEnv; expectedRegex: RegExp }[] = [
    { env: "dev", expectedRegex: /^91[A-Z0-9]{7}$/ },
    { env: "qa", expectedRegex: /^92[A-Z0-9]{7}$/ },
    { env: "stg", expectedRegex: /^93[A-Z0-9]{7}$/ },
    { env: "prod", expectedRegex: /^[A-Z0-9]{9}$/ },
  ];

  describe("generateCustomerNumber", () => {
    it.each(cases)(
      "should generate correct customer number with length 9 in $env environment",
      ({ env, expectedRegex }) => {
        mockEnv.LINGO_ENV = env;

        const customerNumber = ctCustomerService.generateCustomerNumber();

        expect(customerNumber).toMatch(expectedRegex);
        expect(customerNumber).toHaveLength(9);
      },
    );
  });

  describe("createCustomerFromCart", () => {
    const mockCart = createStub<Cart>(defaultCart);

    it("can successfully create a customer from a cart", async () => {
      mockCommercetoolsService.getClient.mockReturnValue({
        customers: vi.fn().mockReturnThis(),
        post: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({
          body: {
            customer: createStub<CTCustomer>(defaultCTCustomer, {
              id: "fake-customer-id",
              externalId: "fake-external-id-1",
            }),
          },
        }),
      } as unknown as CommercetoolsSdkClient);

      const { id: customerId } = await ctCustomerService.createCustomerFromCart(
        "fake-external-id-1",
        mockCart,
      );

      expect(customerId).toBe("fake-customer-id");
    });

    it("can fails to create customer from cart with invalid cart", async () => {
      await expect(async () => {
        await ctCustomerService.createCustomerFromCart(
          "fake-external-id-1",
          undefined as unknown as Cart,
        );
      }).rejects.toThrow(Error);
    });
  });

  describe("createCustomer", () => {
    const mockCustomer = {
      externalId: "fake-external-id",
      firstName: "fake-first-name",
      lastName: "fake-last-name",
      email: "FAKE-email@sfsd.com",
      phone: "6127778888",
    };

    it("can successfully create a customer", async () => {
      const postCall = vi.fn();
      mockCommercetoolsService.getClient.mockReturnValue({
        customers: vi.fn().mockReturnThis(),
        post: postCall.mockReturnThis(),
        execute: vi.fn().mockResolvedValue({
          body: { customer: createStub<CTCustomer>(defaultCTCreateCustomer) },
        }),
      } as unknown as CommercetoolsSdkClient);

      const response = await ctCustomerService.createCustomer(
        mockCustomer.externalId,
        mockCustomer.firstName,
        mockCustomer.lastName,
        mockCustomer.email,
        mockCustomer.phone,
      );
      expect(postCall).toHaveBeenCalledWith({
        body: {
          externalId: mockCustomer.externalId,
          email: "fake-email@sfsd.com",
          firstName: mockCustomer.firstName,
          lastName: mockCustomer.lastName,
          addresses: [{ phone: mockCustomer.phone, country: "US" }],
          defaultShippingAddress: 0,
          authenticationMode: "ExternalAuth",
        },
      });
      expect(response).toBeDefined();
      expect(response?.id).toBe("fake-customer-id-1");
    });
  });

  describe("getCustomer", () => {
    it("can successfully get customer by email", async () => {
      mockCommercetoolsService.getClient.mockReturnValue({
        customers: vi.fn().mockReturnThis(),
        get: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValueOnce({
          body: {
            results: [
              createStub<CTCustomer>(defaultCTCustomer, {
                email: "fake-email1@example.com",
              }),
            ],
          },
        }),
      } as unknown as CommercetoolsSdkClient);

      const customer = await ctCustomerService.getCustomerByEmail(
        "fake-email1@example.com",
      );

      expect(customer).toBeDefined();
      expect(customer?.id).toBe("fake-customer-id-1");
      expect(customer?.email).toBeDefined();
    });

    it("can successfully get customer by id", async () => {
      mockCommercetoolsService.getClient.mockReturnValue({
        customers: vi.fn().mockReturnThis(),
        withId: vi.fn().mockReturnThis(),
        get: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValueOnce({
          body: createStub<CTCustomer>(defaultCTCustomer, {
            email: "fake-email1@example.com",
            firstName: "Will",
          }),
        }),
      } as unknown as CommercetoolsSdkClient);

      const customer = await ctCustomerService.getCustomerById("fake-id-1");

      expect(customer?.email).toBe("fake-email1@example.com");
      expect(customer?.firstName).toBe("Will");
    });

    it("can successfully get customer group by name", async () => {
      mockCommercetoolsService.getClient.mockReturnValue({
        customerGroups: vi.fn().mockReturnThis(),
        get: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValueOnce({
          body: {
            results: [createStub<CTCustomerGroup>(defaultCTCustomerGroup)],
          },
        }),
      } as unknown as CommercetoolsSdkClient);

      const customerGroup =
        await ctCustomerService.getCustomerGroupByName("Fake Group Name");

      expect(customerGroup?.name).toBe("Fake Group Name");
      expect(customerGroup?.id).toBeDefined();
    });
  });

  describe("getCustomersWithUpcomingSubscription", () => {
    it("can successfully get active customers with monthly subscription", async () => {
      const mockCustomerWithUpcomingSubscription = createStub<CTCustomer>(
        defaultCTCustomer,
        {
          custom: {
            type: {
              typeId: "type",
              id: "fake-custom-type-id",
            },
            fields: {
              status: "active",
              parentOrderNumber: "mock-parent-order-number",
              subscription: {
                typeId: "product",
                id: "mock-lingo-product-id",
              },
              nextOrderDate: "2022-01-01T00:00:00.000Z",
              notified: false,
              prepaidShipmentsRemaining: 0,
              paymentMethodId: "mock-payment-method-id",
            },
          },
        },
      );

      mockCommercetoolsService.getClient.mockReturnValue({
        customers: vi.fn().mockReturnThis(),
        get: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValueOnce({
          body: {
            results: [
              mockCustomerWithUpcomingSubscription,
              mockCustomerWithUpcomingSubscription,
            ],
          },
        }),
      } as unknown as CommercetoolsSdkClient);

      const response =
        await ctCustomerService.getCustomersWithUpcomingSubscription();

      expect(response).toHaveLength(2);
      expect(response[0]).toHaveLength(2);
      expect(response[0][0]?.id).toBeDefined();
    });

    it("can successfully get active customers with prepaid shipments remaining", async () => {
      const mockCustomerWithUpcomingSubscription = createStub<CTCustomer>(
        defaultCTCustomer,
        {
          custom: {
            type: {
              typeId: "type",
              id: "fake-custom-type-id",
            },
            fields: {
              status: "active",
              parentOrderNumber: "mock-parent-order-number",
              subscription: {
                typeId: "product",
                id: "mock-lingo-product-id",
              },
              nextOrderDate: "2022-01-01T00:00:00.000Z",
              notified: false,
              prepaidShipmentsRemaining: 3,
              paymentMethodId: "mock-payment-method-id",
            },
          },
        },
      );

      mockCommercetoolsService.getClient.mockReturnValue({
        customers: vi.fn().mockReturnThis(),
        get: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValueOnce({
          body: {
            results: [
              mockCustomerWithUpcomingSubscription,
              mockCustomerWithUpcomingSubscription,
            ],
          },
        }),
      } as unknown as CommercetoolsSdkClient);

      const response =
        await ctCustomerService.getCustomersWithUpcomingSubscription();

      expect(response).toHaveLength(2);
      expect(response[0]).toHaveLength(2);
      expect(response[0][0]?.id).toBeDefined();
    });

    it("can successfully get cancelled customers with prepaid shipments remaining", async () => {
      const mockCustomerWithUpcomingSubscription = createStub<CTCustomer>(
        defaultCTCustomer,
        {
          custom: {
            type: {
              typeId: "type",
              id: "fake-custom-type-id",
            },
            fields: {
              status: "cancelled",
              parentOrderNumber: "mock-parent-order-number",
              subscription: {
                typeId: "product",
                id: "mock-lingo-product-id",
              },
              nextOrderDate: "2022-01-01T00:00:00.000Z",
              notified: false,
              prepaidShipmentsRemaining: 3,
              paymentMethodId: "mock-payment-method-id",
            },
          },
        },
      );

      mockCommercetoolsService.getClient.mockReturnValue({
        customers: vi.fn().mockReturnThis(),
        get: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValueOnce({
          body: {
            results: [
              mockCustomerWithUpcomingSubscription,
              mockCustomerWithUpcomingSubscription,
            ],
          },
        }),
      } as unknown as CommercetoolsSdkClient);

      const response =
        await ctCustomerService.getCustomersWithUpcomingSubscription();

      expect(response).toHaveLength(2);
      expect(response[0]).toHaveLength(2);
      expect(response[0][0]?.id).toBeDefined();
    });
  });

  describe("updateCustomer", () => {
    it("can successfully update customer information", async () => {
      mockCommercetoolsService.getClient.mockReturnValue({
        customers: vi.fn().mockReturnThis(),
        withId: vi.fn().mockReturnThis(),
        get: vi.fn().mockReturnThis(),
        post: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({
          body: createStub<CTCustomer>(defaultCTCustomer),
        }),
      } as unknown as CommercetoolsSdkClient);

      const customer = await ctCustomerService.updateCustomerInformation(
        "fake-id-1",
        2,
        "updated-first-name",
        "updated-first-name",
        "6127778888",
      );

      expect(customer?.firstName).toBe("updated-first-name");
      expect(customer?.lastName).toBe("updated-last-name");
      expect(customer?.email).toBe("updated-email@example.com");
    });

    it("can successfully update customer billing address", async () => {
      const mockBillingAddress = createStub<Address>(defaultAddressStub, {
        firstName: "FakeFirstName",
        lastName: "FakeLastName",
        addressLine1: "321 Alameda Creek",
        addressLine2: "Unit 2",
        postalCode: "02145",
        city: "Alameda",
        state: "MN",
        countryCode: "US",
      });

      mockCommercetoolsService.getClient.mockReturnValue({
        customers: vi.fn().mockReturnThis(),
        withId: vi.fn().mockReturnThis(),
        get: vi.fn().mockReturnThis(),
        post: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({
          body: createStub<CTCustomer>(defaultCTCustomer),
        }),
      } as unknown as CommercetoolsSdkClient);

      const customer = await ctCustomerService.updateCustomerBillingAddress(
        "fake-id-1",
        2,
        mockBillingAddress,
      );

      expect(customer?.billingAddress).toEqual(mockBillingAddress);
    });

    it("can fails to update customer billing with invalid address", async () => {
      await expect(async () => {
        await ctCustomerService.updateCustomerBillingAddress(
          "fake-id-1",
          2,
          undefined as unknown as Address,
        );
      }).rejects.toThrow(Error);
    });

    it("can successfully update customer shipping address", async () => {
      const mockShippingAddress = createStub<Address>(defaultAddressStub, {
        firstName: "FakeFirstName",
        lastName: "FakeLastName",
        addressLine1: "123 Alameda Creek",
        addressLine2: "Unit 1",
        postalCode: "02145",
        city: "Alameda",
        state: "MN",
        countryCode: "US",
      });

      mockCommercetoolsService.getClient.mockReturnValue({
        customers: vi.fn().mockReturnThis(),
        withId: vi.fn().mockReturnThis(),
        get: vi.fn().mockReturnThis(),
        post: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({
          body: createStub<CTCustomer>(defaultCTCustomer),
        }),
      } as unknown as CommercetoolsSdkClient);

      const customer = await ctCustomerService.updateCustomerShippingAddress(
        "fake-id-1",
        2,
        mockShippingAddress,
      );

      expect(customer?.shippingAddress).toEqual(mockShippingAddress);
    });
    it("can successfully add and set as default customer shipping address when no defaultShippingAddressId", async () => {
      const mockShippingAddress = createStub<Address>(defaultAddressStub, {
        firstName: "FakeFirstName",
        lastName: "FakeLastName",
        addressLine1: "123 Alameda Creek",
        addressLine2: "Unit 1",
        postalCode: "02145",
        city: "Alameda",
        state: "MN",
        countryCode: "US",
      });

      mockCommercetoolsService.getClient.mockReturnValue({
        customers: vi.fn().mockReturnThis(),
        withId: vi.fn().mockReturnThis(),
        get: vi.fn().mockReturnThis(),
        post: vi.fn().mockReturnThis(),
        execute: vi
          .fn()
          .mockResolvedValueOnce({
            body: createStub<CTCustomer>(defaultCTCustomer, {
              addresses: undefined,
              defaultShippingAddressId: undefined,
            }),
          })
          .mockResolvedValueOnce({
            body: createStub<CTCustomer>(defaultCTCustomer),
          }),
      } as unknown as CommercetoolsSdkClient);

      await ctCustomerService.updateCustomerShippingAddress(
        "fake-id-1",
        2,
        mockShippingAddress,
      );
      const mockAddress = {
        firstName: "FakeFirstName",
        lastName: "FakeLastName",
        streetName: "123 Alameda Creek",
        additionalStreetInfo: "Unit 1",
        postalCode: "02145",
        city: "Alameda",
        state: "MN",
        country: "US",
        phone: undefined,
      };
      expect(
        mockCommercetoolsService
          .getClient()
          .customers()
          .withId({ ID: "fake-id-1" }).post,
      ).toHaveBeenCalledWith({
        body: {
          version: 2,
          actions: [
            {
              action: "addAddress",
              address: { ...mockAddress, key: "default-shipping" },
            },
            {
              action: "setDefaultShippingAddress",
              addressKey: "default-shipping",
            },
          ],
        },
      });
    });

    it("can fails to update customer shipping with invalid address", async () => {
      await expect(async () => {
        await ctCustomerService.updateCustomerShippingAddress(
          "fake-id-1",
          2,
          undefined as unknown as Address,
        );
      }).rejects.toThrow(Error);
    });
  });
});
