import crypto from "crypto";

import {
  MarketingService,
  ServiceLocator as MarketingServiceLocator,
} from "@ecommerce/marketing";

import getOrCreateExternalId from "./getOrCreateExternalId";

describe("getOrCreateExternalId", () => {
  it("should return a MarketingUser object with a new externalId if the user does not exist", async () => {
    const mockMarketingService = {
      getUser: vi.fn().mockResolvedValue(undefined),
    } as unknown as MarketingService;
    MarketingServiceLocator.setMarketingService(mockMarketingService);

    const mockExternalId = "sfsesfef-efef-efef-efef-efefefefefef";
    vi.spyOn(crypto, "randomUUID").mockReturnValue(mockExternalId);

    const email = "fake@email.com";
    const marketingUser = await getOrCreateExternalId(email);

    expect(marketingUser).toEqual({
      subscribed: "unsubscribed",
      externalId: mockExternalId,
    });
    expect(mockMarketingService.getUser).toHaveBeenCalledWith(email);
    expect(crypto.randomUUID).toHaveBeenCalled();
  });

  it("should return a MarketingUser object with the existing externalId if the user exists", async () => {
    const mockExternalId = "sfsesfef-efef-efef-efef-efefefefefef";
    const mockMarketingUser = {
      subscribed: "subscribed",
      externalId: mockExternalId,
    };
    const mockMarketingService = {
      getUser: vi.fn().mockResolvedValue(mockMarketingUser),
    } as unknown as MarketingService;
    MarketingServiceLocator.setMarketingService(mockMarketingService);

    vi.spyOn(crypto, "randomUUID").mockReturnValue(mockExternalId);

    const email = "fake@email.com";
    const marketingUser = await getOrCreateExternalId(email);

    expect(marketingUser).toEqual(mockMarketingUser);
    expect(mockMarketingService.getUser).toHaveBeenCalledWith(email);
    expect(crypto.randomUUID).not.toHaveBeenCalled();
  });

  it("should return a MarketingUser object with a new externalId if the marketing service throws an error", async () => {
    const mockMarketingService = {
      getUser: vi.fn().mockRejectedValue(new Error()),
    } as unknown as MarketingService;
    MarketingServiceLocator.setMarketingService(mockMarketingService);

    const mockExternalId = "sfsesfef-efef-efef-efef-efefefefefef";
    vi.spyOn(crypto, "randomUUID").mockReturnValue(mockExternalId);

    const email = "fake@email.com";
    const marketingUser = await getOrCreateExternalId(email);

    expect(marketingUser).toEqual({
      subscribed: "unsubscribed",
      externalId: mockExternalId,
    });
    expect(mockMarketingService.getUser).toHaveBeenCalledWith(email);
    expect(crypto.randomUUID).toHaveBeenCalled();
  });
});
