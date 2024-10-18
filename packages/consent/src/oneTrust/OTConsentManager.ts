import { SchemaException } from "@ecommerce/utils";

import { CollectionPoint, Consent, ConsentManager } from "../ConsentManager";
import { authenticate } from "./authenticate";
import { getPurposeIds, getPurposes } from "./consentPurposes";
import { env } from "./env";
import translateOneTrustConsent, {
  onetrustConsentsSchema,
} from "./translations/consents";

export default class OTConsentManager implements ConsentManager {
  public async getConsents(userId: string): Promise<Consent> {
    try {
      const bearerToken = await authenticate();

      const response = await fetch(
        `${env.ONETRUST_URL}/api/preferences/v3/datasubjects/profile?includeInstantLinkToken=true`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            identifier: userId,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `OneTrust Get Consent API failed with status code ${response?.status}`,
        );
      }

      const consentParse = onetrustConsentsSchema.safeParse(
        await response.json(),
      );

      if (!consentParse.success) {
        throw new SchemaException(
          "Failed to parse OneTrust Get Consent",
          consentParse.error,
        );
      }

      return translateOneTrustConsent(consentParse.data);
    } catch (error) {
      throw new Error("Failed to get Consent", { cause: error });
    }
  }

  public async postConsents(
    collectionPoint: CollectionPoint,
    userId: string,
    hasMarketingConsent = false,
    country = "US",
  ): Promise<void> {
    try {
      const bearerToken = await authenticate();

      if (bearerToken == null) {
        throw new Error("Invalid bearer token for the collection point");
      }

      const consentPurposes = getPurposes(
        collectionPoint,
        hasMarketingConsent,
        country,
      );

      const collectionPointId =
        country === "US"
          ? env.ONETRUST_US_COLLECTION_POINT_ID
          : env.ONETRUST_UK_UNSUBSCRIBE_COLLECTION_POINT_ID;

      const resp = await fetch(
        `${env.ONETRUST_URL}/api/consentmanager/v1/collectionpoints/${collectionPointId}/token`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            accept: "application/json",
          },
        },
      );

      if (!resp.ok) {
        throw new Error(
          `OneTrust Get Token API failed with status code ${resp?.status}`,
          { cause: await resp.text() },
        );
      }

      const { token } = (await resp.json()) as { token: string };

      const response = await fetch(
        `${env.ONETRUST_PRIVACY_URL}/request/v1/consentreceipts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({
            identifier: userId,
            requestInformation: token,
            purposes: consentPurposes,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `OneTrust API consentReceipts failed with status code ${response?.status}`,
          { cause: await response.text() },
        );
      }
    } catch (error) {
      throw new Error("Failed to post Consent", { cause: error });
    }
  }

  public getGlobalMarketingPurposeIds(): string[] {
    const marketingPurposeIds: string[] = [];
    // TODO maybe get the country codes from a central place
    ["US", "UK"].forEach((countryCode) => {
      const purposeIds = getPurposeIds(countryCode, env.LINGO_ENV);
      marketingPurposeIds.push(
        ...[
          purposeIds.marketing,
          purposeIds.marketingGeneral,
          purposeIds.marketingNonLocal,
        ],
      );
    });
    return marketingPurposeIds;
  }
}
