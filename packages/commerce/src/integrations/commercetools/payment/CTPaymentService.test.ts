import crypto from "crypto";

import { Payment } from "@ecommerce/finance";

import CommercetoolsSdk, { CommercetoolsSdkClient } from "../CommercetoolsSdk";
import CTPaymentService from "./CTPaymentService";

vi.mock("../CommercetoolsSdk");

describe("CTPaymentService", () => {
  const paymentService = new CTPaymentService();
  const mockCommercetoolsSdk = vi.mocked(CommercetoolsSdk);

  beforeEach(() => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue(
      "fake-crypto-random-transaction-id",
    );
  });

  describe("createPaymentReference", () => {
    it("should create payment info and return the payment ID", async () => {
      const payment: Payment = {
        id: "fake-payment-id",
        currency: "USD",
        amount: 8900,
        channel: "ecommerce",
        paymentInterface: "fake-interface",
        orderNumber: "FAKEORDERNUMBER",
        paymentStatus: {
          interfaceCode: "000.000.000",
          interfaceText: "Fake interface description",
        },
        paymentMethod: {
          id: "fake-payment-method-id",
          type: "CREDIT_CARD",
          brand: "VISA",
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
          card: {
            expiryMonth: "02",
            expiryYear: "2029",
            last4Digits: "2024",
          },
        },
      };

      const transactions = [
        {
          type: "Authorization" as const,
          amount: {
            centAmount: 8900,
            currencyCode: "USD",
          },
          interactionId: "fake-transaction-id",
          timestamp: new Date("2024-03-20T22:17:18.807Z"),
          state: "Pending" as const,
        },
      ];

      const paymentMock = vi.fn().mockReturnThis();
      const postMock = vi.fn().mockReturnThis();
      const executeMock = vi.fn().mockResolvedValueOnce({
        body: {
          id: "fake-payment-reference-id",
          version: 2,
        },
      });

      mockCommercetoolsSdk.getClient.mockReturnValue({
        payments: paymentMock,
        post: postMock,
        execute: executeMock,
      } as unknown as CommercetoolsSdkClient);

      const result = await paymentService.createPaymentReference(
        payment,
        "fake-customer-id",
        transactions,
      );

      expect(result.id).toStrictEqual("fake-payment-reference-id");
      expect(result.version).toStrictEqual(2);

      expect(executeMock).toHaveBeenCalledTimes(1);
      expect(paymentMock).toHaveBeenCalledTimes(1);
      expect(postMock).toHaveBeenCalledWith(
        expect.objectContaining({
          body: {
            amountPlanned: {
              currencyCode: payment.currency,
              centAmount: 8900,
            },
            paymentMethodInfo: {
              paymentInterface: payment.paymentInterface,
              method: payment.paymentMethod.type,
              name: {
                en: payment.paymentMethod.type,
              },
            },
            interfaceId: payment.id,
            paymentStatus: payment.paymentStatus,
            customer: {
              id: "fake-customer-id",
              typeId: "customer",
            },
            transactions: [
              {
                type: "Authorization" as const,
                amount: {
                  centAmount: 8900,
                  currencyCode: "USD",
                },
                interactionId: "fake-crypto-random-transaction-id",
                timestamp: new Date("2024-03-20T22:17:18.807Z").toISOString(),
                state: "Pending" as const,
              },
            ],
            custom: {
              type: {
                key: "payment-reference",
                typeId: "type",
              },
              fields: {
                channel: "ecommerce",
              },
            },
          },
        }),
      );
    });
  });
});
