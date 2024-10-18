// @vitest-environment: node

import {
  ConsentManager,
  ServiceLocator as ConsentManagerServiceLocator,
  createCollectionPointStub,
} from "@ecommerce/consent";
import {
  createSignupSourceStub,
  MarketingService,
  ServiceLocator as MarketingServiceLocator,
} from "@ecommerce/marketing";

import signup from "./signup";

const { getOrCreateExternalIdMock, getFeatureFlagMock } = vi.hoisted(() => {
  return {
    getOrCreateExternalIdMock: vi.fn().mockReturnValue({
      subscribed: "fake-subscription-status",
      externalId: "fake-external-id",
    }),
    getFeatureFlagMock: vi.fn().mockResolvedValue(true),
  };
});

vi.mock("next/headers", () => ({
  headers: vi.fn().mockReturnValue({
    get: vi.fn().mockReturnValue("fake-geo-country"),
  }),
}));

vi.mock("~/lib/getOrCreateExternalId", () => ({
  default: getOrCreateExternalIdMock,
}));

vi.mock("~/lib/feature-flags/server", () => ({
  getFeatureFlag: getFeatureFlagMock,
}));

const createUserMock = vi.fn();
const mockMarketingService = {
  createUser: createUserMock,
} as unknown as MarketingService;

MarketingServiceLocator.setMarketingService(mockMarketingService);

const postConsentsMock = vi.fn();
const mockConsentManager = {
  postConsents: postConsentsMock,
} as unknown as ConsentManager;

ConsentManagerServiceLocator.setConsentManager(mockConsentManager);

afterEach(() => {
  vi.clearAllMocks();
});

describe("signup", () => {
  it("should create a marketing user and post consents", async () => {
    const email = "fake@email.com";
    const signUpSource = createSignupSourceStub();
    const collectionPoint = createCollectionPointStub();
    const marketingConsent = true;

    await signup(email, signUpSource, collectionPoint, marketingConsent);

    expect(getOrCreateExternalIdMock).toHaveBeenCalledWith(email);
    expect(getFeatureFlagMock).toHaveBeenCalledWith("DTC_Braze");
    expect(createUserMock).toHaveBeenCalledWith(
      "fake-external-id",
      email,
      marketingConsent,
      signUpSource,
      "fake-geo-country",
    );
    expect(postConsentsMock).toHaveBeenCalledWith(
      collectionPoint,
      "fake-external-id",
      marketingConsent,
    );
  });

  it("should not create a user and post consents if Braze is not enabled", async () => {
    const email = "fake@email.com";
    const signUpSource = createSignupSourceStub();
    const collectionPoint = createCollectionPointStub();
    const marketingConsent = true;

    getFeatureFlagMock.mockResolvedValueOnce(false);

    await signup(email, signUpSource, collectionPoint, marketingConsent);

    expect(getOrCreateExternalIdMock).toHaveBeenCalledWith(email);
    expect(getFeatureFlagMock).toHaveBeenCalledWith("DTC_Braze");
    expect(createUserMock).not.toHaveBeenCalled();
    expect(postConsentsMock).not.toHaveBeenCalled();
  });

  it("should pass false to post consent if marketingConsent is false", async () => {
    const email = "fake@email.com";
    const signUpSource = createSignupSourceStub();
    const collectionPoint = createCollectionPointStub();
    const marketingConsent = false;

    await signup(email, signUpSource, collectionPoint, marketingConsent);

    expect(getOrCreateExternalIdMock).toHaveBeenCalledWith(email);
    expect(getFeatureFlagMock).toHaveBeenCalledWith("DTC_Braze");
    expect(createUserMock).toHaveBeenCalledWith(
      "fake-external-id",
      email,
      marketingConsent,
      signUpSource,
      "fake-geo-country",
    );
    expect(postConsentsMock).toHaveBeenCalledWith(
      collectionPoint,
      "fake-external-id",
      marketingConsent,
    );
  });
});
