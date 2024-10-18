import { app, InvocationContext } from "@azure/functions";
import { z } from "zod";

import {
  ServiceLocator as SLConsent,
  SUBSCRIBED_CONSENT_STATUSES,
  UNSUBSCRIBED_CONSENT_STATUSES,
} from "@ecommerce/consent";
import { getLogger } from "@ecommerce/logger";
import {
  MarketingAttributeType,
  ServiceLocator as MarketingServiceLocator,
} from "@ecommerce/marketing";
import { SchemaException } from "@ecommerce/utils";

import { checkUniformStatus } from "./helper";

const marketingStatusUpdateSchema = z.object({
  identifiers: z.object({
    lingoId: z.string(),
  }),
  purpose: z.array(
    z.object({
      id: z.string(),
      status: z.string(),
    }),
  ),
});

/**
 * This function is trigged by an Event Hub message from One Trust.
 * Specifically, it is triggered when a user updates their preferences
 * in the One Trust iFrame of the account privacy page.
 *
 * We use this to update Braze's marketing preferences when they change
 * their marketing consent preference.
 *
 * @param payload Comes from One Trust
 * @param context Provided by Azure Functions
 * @returns void
 */
export async function updateMarketingPreferences(
  payload: unknown,
  context: InvocationContext,
): Promise<void> {
  const logger = getLogger({
    correlationId: context.invocationId,
    prefix: "update-marketing-preferences",
  });
  try {
    logger.info(
      { payload },
      "Starting to process Event Hub triggered consent payload.",
    );

    const parsedMessage = marketingStatusUpdateSchema.safeParse(payload);

    if (!parsedMessage.success) {
      logger.error("Schema parsing error:", parsedMessage.error.errors);
      throw new SchemaException(
        "Error occurred during parsing the schema for update marketing status.",
        parsedMessage.error,
      );
    }

    const marketingService = MarketingServiceLocator.getMarketingService();
    const consentService = SLConsent.getConsentManager();
    const globalMarketingPurposeIds =
      consentService.getGlobalMarketingPurposeIds();

    const {
      identifiers: { lingoId },
      purpose: purposes,
    } = parsedMessage.data;

    const marketingPurposes = purposes.filter((purpose) =>
      globalMarketingPurposeIds.includes(purpose.id),
    );

    if (marketingPurposes?.[0] == null) {
      logger.info("No marketing purposes found to process.");
      return;
    } else if (
      marketingPurposes.length > 1 &&
      !checkUniformStatus(marketingPurposes)
    ) {
      throw new Error("The status of the marketing purposes do not match.");
    }

    const consentPurpose = marketingPurposes[0];

    let emailSubscriptionState: "subscribed" | "unsubscribed" | null = null;

    const user = await marketingService.getUserById(lingoId);
    if (user == null) {
      throw new Error("User does not exist in marketing platform");
    }

    if (SUBSCRIBED_CONSENT_STATUSES.includes(consentPurpose.status)) {
      if (user.subscribed !== "opted_in") {
        logger.info(
          `Email opt-in state will be set to subscribed for ${lingoId}`,
        );
        emailSubscriptionState = "subscribed";
      }
    } else if (UNSUBSCRIBED_CONSENT_STATUSES.includes(consentPurpose.status)) {
      emailSubscriptionState = "unsubscribed";
    }

    if (emailSubscriptionState != null) {
      await marketingService.updateUserAttributes(
        MarketingAttributeType.Subscription,
        {
          externalId: lingoId,
          subscriptionStatus: emailSubscriptionState,
        },
      );

      logger.info(
        `Successfully updated marketing consent for user ID: ${lingoId} to ${emailSubscriptionState.toUpperCase()}`,
      );
    }
  } catch (error) {
    logger.error(error, "Error on updating marketing preferences.");
  }
}

app.eventHub("update-marketing-preferences", {
  eventHubName: "evh-consent",
  connection: "PRIVACY_EH_CONN_STR",
  handler: updateMarketingPreferences,
});
