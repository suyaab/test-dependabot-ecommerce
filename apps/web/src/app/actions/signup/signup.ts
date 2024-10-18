"use server";

import { headers } from "next/headers";

import {
  CollectionPoint,
  ServiceLocator as SLConsent,
} from "@ecommerce/consent";
import { getLogger } from "@ecommerce/logger";
import {
  ServiceLocator as MarketingServiceLocator,
  SignupSource,
} from "@ecommerce/marketing";

import { HttpHeaderKey } from "~/app/actions/constants/HttpHeaderKey";
import { getFeatureFlag } from "~/lib/feature-flags/server";
import getOrCreateExternalId from "~/lib/getOrCreateExternalId";
import ActionException from "../ActionException";

export default async function signup(
  email: string,
  signUpSource: SignupSource,
  collectionPoint: CollectionPoint,
  marketingConsent = true,
) {
  const logger = getLogger({
    prefix: "web:actions:signup",
    headers: headers(),
  });

  try {
    logger.info(
      { email, signUpSource, collectionPoint, marketingConsent },
      "Signing up User",
    );

    const { externalId } = await getOrCreateExternalId(email);

    const geoCountryCode = headers().get(HttpHeaderKey.X_GEO_COUNTRY) ?? "";

    // TODO: move this flag check to marketing package level
    const isBrazeEnabled = await getFeatureFlag("DTC_Braze");

    if (isBrazeEnabled) {
      const marketingService = MarketingServiceLocator.getMarketingService();
      await marketingService.createUser(
        externalId,
        email,
        marketingConsent,
        signUpSource,
        geoCountryCode,
      );

      logger.info({ externalId }, "Created Marketing User");

      const consentService = SLConsent.getConsentManager();
      await consentService.postConsents(
        collectionPoint,
        externalId,
        marketingConsent,
      );

      logger.info("Posted consent and completed signup");
    }
  } catch (error) {
    logger.error(error, "Error occurred during sign up process");

    throw new ActionException("Error occurred during sign up process", {
      cause: error,
    });
  }
}
