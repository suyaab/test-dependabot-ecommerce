// @vitest-environment: node

import { mock, mockReset } from "vitest-mock-extended";

import {
  ConsentManager,
  ServiceLocator as SLConsent,
} from "@ecommerce/consent";
import {
  MarketingAttributeType,
  MarketingService,
  ServiceLocator as MarketingServiceLocator,
} from "@ecommerce/marketing";

import Unsubscribe from "./page";

vi.mock("next/headers");

describe("Unsubscribe", () => {
  const mockConsentManager = mock<ConsentManager>();
  const mockMarketingService = mock<MarketingService>();

  const mockUserId = "mock-user-id";
  const mockRequest = {
    params: {
      userId: mockUserId,
    },
  };

  beforeEach(() => {
    mockReset(mockConsentManager);
    mockReset(mockMarketingService);
  });

  it("should handle successful unsubscribe", async () => {
    mockMarketingService.getUserById.mockResolvedValue({
      externalId: "fake-external-id",
      subscribed: "subscribed",
    });

    SLConsent.setConsentManager(mockConsentManager);
    MarketingServiceLocator.setMarketingService(mockMarketingService);

    await Unsubscribe(mockRequest);

    expect(mockConsentManager.postConsents).toHaveBeenCalledWith(
      "UNSUBSCRIBE",
      mockUserId,
      false,
      "US",
    );
    expect(mockMarketingService.updateUserAttributes).toHaveBeenCalledWith(
      MarketingAttributeType.Subscription,
      {
        externalId: mockUserId,
        subscriptionStatus: "unsubscribed",
      },
    );
  });

  it("should handle user already unsubscribed", async () => {
    mockMarketingService.getUserById.mockResolvedValue({
      externalId: "fake-external-id",
      subscribed: "unsubscribed",
    });

    SLConsent.setConsentManager(mockConsentManager);
    MarketingServiceLocator.setMarketingService(mockMarketingService);

    await Unsubscribe(mockRequest);

    expect(mockConsentManager.postConsents).not.toHaveBeenCalled();
    expect(mockMarketingService.updateUserAttributes).not.toHaveBeenCalled();
  });

  it("should handle user not found", async () => {
    MarketingServiceLocator.setMarketingService(mockMarketingService);

    await Unsubscribe(mockRequest);

    expect(mockConsentManager.postConsents).not.toHaveBeenCalled();
    expect(mockMarketingService.updateUserAttributes).not.toHaveBeenCalled();
  });

  it("should handle error during unsubscribe process", async () => {
    mockMarketingService.getUserById.mockResolvedValue({
      externalId: "fake-external-id",
      subscribed: "subscribed",
    });

    mockConsentManager.postConsents.mockRejectedValue(
      "This is a network error",
    );

    SLConsent.setConsentManager(mockConsentManager);
    MarketingServiceLocator.setMarketingService(mockMarketingService);

    await Unsubscribe(mockRequest);

    expect(mockConsentManager.postConsents).toHaveBeenCalledWith(
      "UNSUBSCRIBE",
      mockUserId,
      false,
      "US",
    );
    expect(mockMarketingService.updateUserAttributes).not.toHaveBeenCalled();
  });
});
