"use server";

import crypto from "crypto";

import logger from "@ecommerce/logger";
import {
  ServiceLocator as MarketingServiceLocator,
  MarketingUser,
} from "@ecommerce/marketing";

export default async function getOrCreateExternalId(
  email: string,
): Promise<MarketingUser> {
  const marketingService = MarketingServiceLocator.getMarketingService();
  const marketingUser = await marketingService.getUser(email).catch((err) => {
    logger.error(
      err,
      "marketingService getUser called failed during getOrCreateExternalId",
    );
  });

  if (marketingUser != null) {
    return {
      subscribed: marketingUser.subscribed,
      externalId: marketingUser.externalId,
    };
  }

  // generate a new random id to be used as external (Lingo) id
  const newExternalId = crypto.randomUUID();

  logger.info({ newExternalId }, "generated new external id");

  return { subscribed: "unsubscribed", externalId: newExternalId };
}
