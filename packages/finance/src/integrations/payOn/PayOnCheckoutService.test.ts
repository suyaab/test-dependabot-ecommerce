import { CheckoutService } from "../../CheckoutService";
import PayOnCheckoutService from "./PayOnCheckoutService";
import { PayOnPayment } from "./PayOnPaymentGateway";

vi.mock("./env", () => ({
  env: {
    PAYON_MOTO_ENTITY_ID: "MOCK_PAYON_MOTO_ENTITY_ID",
    PAYON_ECOMM_ENTITY_ID: "MOCK_PAYON_ECOMM_ENTITY_ID",
    PAYON_API_URL: "MOCK_PAYON_API_URL",
    PAYON_AUTH_TOKEN: "MOCK_PAYON_AUTH_TOKEN",
  },
}));

const mockOrderNumber = "mock-order-number";

describe("PayOnCheckoutSession", () => {
  let checkoutService: CheckoutService;

  const mockPayOnPayment: PayOnPayment = {
    id: "fake-payment-status-id",
    registrationId: "fake-registration-id",
    amount: 100,
    currency: "USD",
    timestamp: new Date().toISOString(),
    merchantTransactionId: "fake-order-number",
    result: {
      code: "000.000.200",
      description: "This is a fake success message for this payment!",
    },
    customParameters: {
      tokenSource: "test-token-source",
    },
    customer: {
      givenName: "fake givenName",
      surname: "fake surname",
      email: "fake email",
    },
    billing: {
      street1: "fake street1",
      city: "fake city",
      state: "CA",
      postcode: "87684",
      country: "US",
    },
    paymentBrand: "VISA",
    card: {
      expiryMonth: "10",
      expiryYear: "2025",
      last4Digits: "1234",
    },
  };

  beforeEach(() => {
    checkoutService = new PayOnCheckoutService();
  });

  describe("createCheckoutSession", () => {
    it("should create payon checkout session", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({
          id: "fake-payon-checkout-id",
          timestamp: "2024-06-25 16:40:05+0000",
          result: {
            code: "000.200.000",
            description: "fake description",
          },
          amount: "89.00",
          currency: "USD",
        }),
        status: 200,
        ok: true,
      });

      const checkoutSession = await checkoutService.createCheckoutSession(
        "GBL919191",
        89.0,
        "USD",
      );

      expect(checkoutSession.id).toBe("fake-payon-checkout-id");
    });

    it("should throw error for payon checkout session failure", async () => {
      global.fetch = vi
        .fn()
        .mockRejectedValueOnce(new Error("PayOn Timeout Error"));

      await expect(async () => {
        await checkoutService.createCheckoutSession("GBL919191", 89.0, "USD");
      }).rejects.toThrow(Error);
    });
  });

  describe("getCheckoutSession", () => {
    it("should successfully get a full checkout session", async () => {
      const checkoutSessionId = "fake-payon-checkout-id";

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({
          id: checkoutSessionId,
          result: {
            code: "000.200.000",
            description: "fake description",
          },
          amount: "89.00",
          currency: "USD",
          timestamp: new Date().toISOString(),
        }),
        status: 200,
        ok: true,
      });

      const checkoutSession =
        await checkoutService.getCheckoutSession(checkoutSessionId);

      expect(checkoutSession.id).toBe(checkoutSessionId);
      expect(checkoutSession.amount).toBe("89.00");
      expect(checkoutSession.currency).toBe("USD");
    });
  });

  describe("updateCheckoutSessionAddress", () => {
    it("should update payon checkout session address", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({
          result: {
            code: "000.200.000",
          },
        }),
        status: 200,
        ok: true,
      });

      await expect(
        checkoutService.updateCheckoutSessionAddress("fake-payon-checkout-id", {
          firstName: "Will",
          lastName: "Abbott",
          addressLine1: "9509 Alameda Lane",
          addressLine2: "Unit 501",
          city: "Alameda",
          state: "CA",
          postalCode: "02145",
          countryCode: "US",
        }),
      ).resolves.not.toThrow();
    });

    it("should throw error for payon checkout session failure", async () => {
      global.fetch = vi
        .fn()
        .mockRejectedValueOnce(new Error("PayOn Timeout Error"));

      await expect(async () => {
        await checkoutService.updateCheckoutSessionAddress(
          "fake-payon-checkout-id",
          {
            firstName: "Will",
            lastName: "Abbott",
            addressLine1: "9509 Alameda Lane",
            addressLine2: "Unit 501",
            city: "Alameda",
            state: "CA",
            postalCode: "02145",
            countryCode: "US",
          },
        );
      }).rejects.toThrow(Error);
    });
  });

  describe("updateCheckoutSessionCustomer", () => {
    it("should update payon checkout session address", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({
          id: "fake-payon-checkout-id",
          result: {
            code: "000.200.000",
          },
          amount: "89.00",
          currency: "USD",
          customer: {
            ip: "9509 Alameda Lane",
            givenName: "firstname",
            surname: "lastname",
            email: "fake@email.com",
            phone: "6121112222",
          },
        }),
        status: 200,
        ok: true,
      });

      await expect(
        checkoutService.updateCheckoutSessionCustomer(
          "fake-payon-checkout-id",
          "127.127.0.1",
          "Will",
          "Abbott",
          "fake@email.com",
          "6121112222",
        ),
      ).resolves.not.toThrow();
    });

    it("should throw error for payon checkout session failure", async () => {
      global.fetch = vi
        .fn()
        .mockRejectedValueOnce(new Error("PayOn Timeout Error"));

      await expect(async () => {
        await checkoutService.updateCheckoutSessionCustomer(
          "fake-payon-checkout-id",
          "127.127.0.1",
          "Will",
          "Abbott",
          "fake@email.com",
          "6121112222",
        );
      }).rejects.toThrow(Error);
    });

    it("should update authorized price successfully", async () => {
      const checkoutSessionId = "testSessionId";
      const currency = "USD";
      const totalAmount = 100.0;

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({
          id: "fake-payon-checkout-id",
          result: {
            code: "000.200.000",
          },
          amount: "89.00",
          currency: "USD",
        }),
        status: 200,
        ok: true,
      });

      const updateCheckoutPrice = await checkoutService.updateAuthorizedPrice(
        currency,
        totalAmount,
        checkoutSessionId,
      );
      expect(updateCheckoutPrice).toBeTruthy();
    });
  });

  describe("getCheckoutPayment", () => {
    it("should return correct payment info for credit cart if payment is successful", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockPayOnPayment),
        status: 200,
        ok: true,
      });

      const payment = await checkoutService.getCheckoutPayment(mockOrderNumber);

      expect(payment).toEqual({
        id: mockPayOnPayment.id,
        orderNumber: mockPayOnPayment.merchantTransactionId,
        channel: "ecommerce",
        amount: 10000,
        currency: "USD",
        paymentInterface: "payon",
        paymentStatus: {
          interfaceCode: mockPayOnPayment.result.code,
          interfaceText: mockPayOnPayment.result.description,
        },
        paymentMethod: {
          id: mockPayOnPayment.registrationId,
          type: "CREDIT_CARD",
          brand: "VISA",
          billingAddress: {
            firstName: "fake givenName",
            lastName: "fake surname",
            addressLine1: "fake street1",
            city: "fake city",
            state: "CA",
            postalCode: "87684",
            countryCode: "US",
          },
          card: {
            expiryMonth: "10",
            expiryYear: "2025",
            last4Digits: "1234",
          },
        },
      });
    });

    it("should throw error when payon api fails", async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

      await expect(async () => {
        await checkoutService.getCheckoutPayment(mockOrderNumber);
      }).rejects.toThrow(Error);
    });

    it("should throw an error if payment is not successful", async () => {
      const mockResponse = {
        result: { code: "800.123.123" }, // invalid code
        registrationId: "fake-registration-id",
      };

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
        status: 200,
        ok: true,
      });

      await expect(async () => {
        await checkoutService.getCheckoutPayment(mockOrderNumber);
      }).rejects.toThrow(Error);
    });

    it("should return payment info for apple pay if payment is successful", async () => {
      const paymentStatus: PayOnPayment = {
        ...mockPayOnPayment,
        customParameters: {
          tokenSource: "APPLEPAY",
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(paymentStatus),
        status: 200,
        ok: true,
      });

      const payment = await checkoutService.getCheckoutPayment(mockOrderNumber);

      expect(payment.paymentMethod.type).toBe("APPLE_PAY");
      expect(payment.paymentMethod.brand).toBe("VISA");
    });

    it("should return correct payment info for google pay if payment is successful", async () => {
      const paymentStatus: PayOnPayment = {
        ...mockPayOnPayment,
        customParameters: {
          tokenSource: "GOOGLEPAY",
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(paymentStatus),
        status: 200,
        ok: true,
      });

      const payment = await checkoutService.getCheckoutPayment(mockOrderNumber);

      expect(payment.paymentMethod.type).toBe("GOOGLE_PAY");
      expect(payment.paymentMethod.brand).toBe("VISA");
    });

    it("should return correct payment info for paypal if payment is successful", async () => {
      const paymentStatus: PayOnPayment = {
        ...mockPayOnPayment,
        customParameters: {
          tokenSource: "PAYPAL_CONTINUE",
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(paymentStatus),
        status: 200,
        ok: true,
      });

      const payment = await checkoutService.getCheckoutPayment(mockOrderNumber);

      expect(payment.paymentMethod.type).toBe("PAYPAL");
      expect(payment.paymentMethod.brand).toBe("VISA");
    });
  });
});
