/**
 @vi-environment node
 */

import {
  MarketingAttributeType,
  MarketingEventType,
} from "../MarketingService";
import { BrazeMarketingService } from "./BrazeMarketingService";

vi.mock("./env", () => ({
  env: {
    BRAZE_LINGO_DATA_PLATFORM_ID: "MOCK_BRAZE_LINGO_DATA_PLATFORM_ID",
    BRAZE_API_URL: "https://mock-braze-url.com",
    BRAZE_API_KEY: "MOCK_BRAZE_API_KEY",
    BRAZE_SUBSCRIPTION_SPECIAL_OFFERS: "MOCK_BRAZE_SUBSCRIPTION_SPECIAL_OFFERS",
    BRAZE_SUBSCRIPTION_NEWS_CONTENT: "MOCK_BRAZE_SUBSCRIPTION_NEWS_CONTENT",
    BRAZE_SUBSCRIPTION_PRODUCT_UPDATES:
      "MOCK_BRAZE_SUBSCRIPTION_PRODUCT_UPDATES",
  },
}));

vi.mock("./utils", () => ({
  getDateFromISO: vi.fn().mockReturnValue("mock-time"),
}));

describe("BrazeMarketingService", () => {
  let brazeMarketingService: BrazeMarketingService;

  const mockExternalId = "test-external-id";
  const mockDate = "2024-04-10T00:00:00.000Z";

  beforeEach(() => {
    brazeMarketingService = new BrazeMarketingService();

    vi.useFakeTimers();
    vi.setSystemTime(new Date(mockDate));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  // TODO: Implement these tests
  // describe("createUser", () => {});
  // describe("getUserById", () => {});

  describe("getUser", () => {
    it("should successfully get user", async () => {
      const mockFetch = vi.fn().mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce({
          users: [
            {
              external_id: mockExternalId,
              email_subscribe: "subscribed",
            },
          ],
        }),
        status: 200,
        ok: true,
      });

      global.fetch = mockFetch;

      const user = await brazeMarketingService.getUser("test@email.com");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/users/export/ids"),
        expect.objectContaining({
          body: JSON.stringify({
            email_address: "test@email.com",
            fields_to_export: ["email_subscribe", "external_id"],
          }),
        }),
      );
      expect(user).toEqual({
        externalId: mockExternalId,
        subscribed: "subscribed",
      });
    });

    it("should send email lowercased in payload", async () => {
      const mockFetch = vi.fn().mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce({
          users: [
            {
              external_id: mockExternalId,
              email_subscribe: "subscribed",
            },
          ],
        }),
        status: 200,
        ok: true,
      });

      global.fetch = mockFetch;

      const user = await brazeMarketingService.getUser(
        "CAPITALIZED.test@email.com",
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/users/export/ids"),
        expect.objectContaining({
          body: JSON.stringify({
            email_address: "capitalized.test@email.com",
            fields_to_export: ["email_subscribe", "external_id"],
          }),
        }),
      );
      expect(user).toEqual({
        externalId: mockExternalId,
        subscribed: "subscribed",
      });
    });
  });

  describe("sendEvent", () => {
    it("should successfully send purchase event", async () => {
      const mockFetch = vi.fn().mockResolvedValueOnce({
        json: vi.fn(),
        status: 200,
        ok: true,
      });

      global.fetch = mockFetch;

      await brazeMarketingService.sendEvent(MarketingEventType.Purchase, {
        externalId: mockExternalId,
        email: "test@email.com",
        product: {
          productId: "test-product-id",
          currency: "test-currency",
          price: 89.0,
          properties: {
            productType: "test-product-type",
          },
        },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://mock-braze-url.com/users/track",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer MOCK_BRAZE_API_KEY",
          },
          body: JSON.stringify({
            purchases: [
              {
                external_id: mockExternalId,
                app_id: "MOCK_BRAZE_LINGO_DATA_PLATFORM_ID",
                name: "purchase",
                time: mockDate,
                email: "test@email.com",
                product_id: "test-product-id",
                currency: "test-currency",
                price: 89.0,
                properties: {
                  product_type: "test-product-type",
                },
              },
            ],
            events: [
              {
                name: "purchase",
                time: mockDate,
                external_id: mockExternalId,
                email: "test@email.com",
                app_id: "MOCK_BRAZE_LINGO_DATA_PLATFORM_ID",
                properties: {
                  productId: "test-product-id",
                  currency: "test-currency",
                  price: 89.0,
                  properties: {
                    productType: "test-product-type",
                  },
                },
              },
            ],
          }),
        },
      );
    });
  });

  describe("updateUserAttributes", () => {
    it("should update user subscription attributes", async () => {
      const mockFetch = vi.fn().mockResolvedValueOnce({
        json: vi.fn(),
        status: 200,
        ok: true,
      });

      global.fetch = mockFetch;

      await brazeMarketingService.updateUserAttributes(
        MarketingAttributeType.Subscription,
        {
          externalId: mockExternalId,
          subscriptionStatus: "unsubscribed",
        },
      );

      expect(mockFetch).toHaveBeenCalledWith(
        "https://mock-braze-url.com/users/track",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer MOCK_BRAZE_API_KEY",
          },
          body: JSON.stringify({
            attributes: [
              {
                external_id: mockExternalId,
                email_subscribe: "unsubscribed",
                subscription_groups: [
                  {
                    subscription_group_id:
                      "MOCK_BRAZE_SUBSCRIPTION_NEWS_CONTENT",
                    subscription_state: "unsubscribed",
                  },
                  {
                    subscription_group_id:
                      "MOCK_BRAZE_SUBSCRIPTION_PRODUCT_UPDATES",
                    subscription_state: "unsubscribed",
                  },
                  {
                    subscription_group_id:
                      "MOCK_BRAZE_SUBSCRIPTION_SPECIAL_OFFERS",
                    subscription_state: "unsubscribed",
                  },
                ],
              },
            ],
          }),
        },
      );
    });

    it("should build correct Braze data for purchase attributes", async () => {
      const attributeData = {
        externalId: mockExternalId,
        email: "test@email.com",
        sku: "mockSkuName",
        promoCode: "mockPromoCode",
      };

      const mockFetch = vi.fn().mockResolvedValueOnce({
        json: vi.fn(),
        status: 200,
        ok: true,
      });

      global.fetch = mockFetch;

      await brazeMarketingService.updateUserAttributes(
        MarketingAttributeType.Purchase,
        attributeData,
      );

      expect(mockFetch).toHaveBeenCalledWith(
        "https://mock-braze-url.com/users/track",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer MOCK_BRAZE_API_KEY",
          },
          body: JSON.stringify({
            attributes: [
              {
                external_id: mockExternalId,
                email: "test@email.com",
                sku_name: "mockSkuName",
                promo_codes: { add: ["mockPromoCode"] },
              },
            ],
          }),
        },
      );
    });
  });
});
