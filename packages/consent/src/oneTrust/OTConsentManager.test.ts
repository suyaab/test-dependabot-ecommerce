import OTConsentManager from "./OTConsentManager";

vi.mock("./env", () => ({
  env: {
    ONETRUST_URL: "https://fake.onetrust.com",
    ONETRUST_PRIVACY_URL: "https://privacy.url.com",
    ONETRUST_CLIENT_ID: "fake-client-id",
    ONETRUST_CLIENT_SECRET: "fake-client-secret",
  },
}));

vi.mock("./authenticate", () => ({
  authenticate: vi.fn().mockReturnValue("fake-bearer-token"),
}));

vi.mock("./consentPurposes", () => ({
  getPurposes: vi.fn().mockReturnValue([
    {
      id: "fake-collection-point-id",
      transactionType: "CONFIRMED",
    },
  ]),
}));

describe("OTConsentManager", () => {
  const consentManager = new OTConsentManager();

  describe("getConsent", () => {
    it("should successfully get a user's consent", async () => {
      const mockFetch = vi.fn().mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          id: "fake-onetrust-id",
          language: null,
          identifier: "fake-user-id",
          linkToken: "fake-link-token",
          lastUpdatedDate: "2024-05-01T00:18:27.735191478",
          createdDate: "2024-04-25T13:46:44.78",
          dataElements: [],
          purposes: [
            {
              id: "fake-purpose-id",
              lastReceiptId: "fake-receipt-id",
              name: "This is a fake purpose",
              version: 5,
              status: "ACTIVE",
              firstTransactionDate: "2024-05-01T00:18:27.473764678",
              lastTransactionDate: "2024-05-01T00:18:27.473764678",
              withdrawalDate: null,
              consentDate: "2024-05-01T00:18:27.473764678",
              expiryDate: null,
              totalTransactionCount: 1,
              topics: [],
              customPreferences: [],
              lastTransactionCollectionPointId:
                "fake-transaction-collection-point-id",
              lastTransactionCollectionPointVersion: 5,
              lastUpdatedDate: "2024-05-01T00:18:27.473764678",
              lastInteractionDate: "2024-05-01T00:18:27.473764678",
              attributes: {},
            },
          ],
        }),
        status: 200,
        ok: true,
      });

      global.fetch = mockFetch;

      const consent = await consentManager.getConsents("fake-user-id");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://fake.onetrust.com/api/preferences/v3/datasubjects/profile?includeInstantLinkToken=true",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer fake-bearer-token",
            identifier: "fake-user-id",
          },
        },
      );

      expect(consent.externalId).toBe("fake-user-id");
      expect(consent.portalToken).toBe("fake-link-token");
      expect(consent.purposes).toHaveLength(1);
    });

    it("should fail to get consent", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        json: vi.fn(),
        status: 500,
        ok: false,
      });

      await expect(async () => {
        await consentManager.getConsents("fake-user-id");
      }).rejects.toThrow(Error);
    });
  });

  describe("postConsent", () => {
    it("should successfully post consent", async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValueOnce({
          json: vi.fn().mockResolvedValue({
            token: "fake-token",
          }),
          ok: true,
        })
        .mockResolvedValueOnce({
          json: vi.fn(),
          status: 200,
          ok: true,
        });

      global.fetch = mockFetch;

      await consentManager.postConsents("NO_PURCHASE", "fake-user-id", true);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://privacy.url.com/request/v1/consentreceipts",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer fake-bearer-token",
          },
          body: JSON.stringify({
            identifier: "fake-user-id",
            requestInformation: "fake-token",
            purposes: [
              {
                id: "fake-collection-point-id",
                transactionType: "CONFIRMED",
              },
            ],
          }),
        },
      );
    });

    it("should throw if onetrust api fails to post consent", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        json: vi.fn(),
        status: 500,
        ok: false,
      });

      await expect(async () => {
        await consentManager.postConsents("NO_PURCHASE", "fake-user-id", true);
      }).rejects.toThrow(Error);
    });
  });
});
