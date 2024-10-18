"use server";

import { headers } from "next/headers";

import { ServiceLocator as SLConsent } from "@ecommerce/consent";
import { getLogger } from "@ecommerce/logger";
import {
  MarketingAttributeType,
  ServiceLocator as MarketingServiceLocator,
} from "@ecommerce/marketing";

import ActionException from "./ActionException";

// TODO: refactor to best practices
export default async function unsubscribe(userId: string) {
  const logger = getLogger({
    prefix: "web:actions:unsubscribe",
    headers: headers(),
  });

  try {
    logger.info("Unsubscribe action called.");

    const consentService = SLConsent.getConsentManager();
    const marketingService = MarketingServiceLocator.getMarketingService();
    const user = await marketingService.getUserById(userId);
    if (user == null) {
      logger.info(
        { userId },
        "User not found in marketing service for unsubscribe.",
      );
      throw Error("User not found");
    }

    logger.info({ userId }, "Unsubscribing user from marketing emails.");

    if (user.subscribed !== "unsubscribed") {
      // TODO: this won't scale let's rethink this
      await consentService.postConsents("UNSUBSCRIBE", userId, false, "US");
      await consentService.postConsents("UNSUBSCRIBE", userId, false, "UK");

      logger.info("User marketing consent withdrawn from OneTrust.");

      await marketingService.updateUserAttributes(
        MarketingAttributeType.Subscription,
        {
          externalId: userId,
          subscriptionStatus: "unsubscribed",
        },
      );

      logger.info(
        "User marketing subscription status updated to unsubscribed.",
      );
    }
  } catch (error) {
    logger.error(error, "Error occurred during unsubscribe process");
    throw new ActionException("Error occurred during unsubscribe process", {
      cause: error,
    });
  }
}
