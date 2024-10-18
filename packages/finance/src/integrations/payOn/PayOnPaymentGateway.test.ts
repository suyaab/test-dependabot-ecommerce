import { PaymentGateway } from "../../PaymentGateway";
import PayOnPaymentGateway from "./PayOnPaymentGateway";

vi.mock("./env", () => ({
  env: {
    PAYON_MOTO_ENTITY_ID: "MOCK_PAYON_MOTO_ENTITY_ID",
    PAYON_ECOMM_ENTITY_ID: "MOCK_PAYON_ECOMM_ENTITY_ID",
    PAYON_API_URL: "MOCK_PAYON_API_URL",
    PAYON_AUTH_TOKEN: "MOCK_PAYON_AUTH_TOKEN",
  },
}));

describe("PayOnPaymentGateway", () => {
  let paymentGateway: PaymentGateway;

  beforeEach(() => {
    paymentGateway = new PayOnPaymentGateway();
  });

  describe("getChannelDetails", () => {
    it("should return channel details correctly for Moto", () => {
      const channelDetails = paymentGateway.getChannelDetails("moto");

      expect(channelDetails).toMatchObject({
        channel: "moto",
        ccLocId: "CU",
        entityId: "MOCK_PAYON_MOTO_ENTITY_ID",
      });
    });

    it("should return channel details correctly for Ecommerce", () => {
      const channelDetails = paymentGateway.getChannelDetails("ecommerce");

      expect(channelDetails).toMatchObject({
        channel: "ecommerce",
        ccLocId: "I1",
        entityId: "MOCK_PAYON_ECOMM_ENTITY_ID",
      });
    });
  });

  describe("getSavedPaymentMethod", () => {
    it("should get saved payment method", async () => {
      const mockRegistration = {
        id: "fake-registration-id",
        amount: 100,
        currency: "USD",
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
          postcode: "fake postcode",
          country: "US",
        },
        paymentBrand: "VISA" as const,
        card: {
          expiryMonth: "10",
          expiryYear: "2025",
          last4Digits: "1234",
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockRegistration),
        status: 200,
        ok: true,
      });

      const paymentMethod = await paymentGateway.getSavedPaymentMethod(
        "fake-registration-id",
      );

      expect(paymentMethod).toEqual({
        id: mockRegistration.id,
        type: "CREDIT_CARD",
        brand: "VISA",
        billingAddress: {
          firstName: "fake givenName",
          lastName: "fake surname",
          addressLine1: "fake street1",
          city: "fake city",
          state: "CA",
          postalCode: "fake postcode",
          countryCode: "US",
        },
        card: {
          expiryMonth: "10",
          expiryYear: "2025",
          last4Digits: "1234",
        },
      });
    });

    it("should fail to get saved payment method", async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

      await expect(async () => {
        await paymentGateway.getSavedPaymentMethod("fake-registration-id");
      }).rejects.toThrow(Error);
    });
  });
});
