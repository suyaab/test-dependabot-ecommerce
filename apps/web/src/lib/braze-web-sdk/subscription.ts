import { User } from "@braze/web-sdk";

import { BrazeSDKServiceConfig } from "./types";

export default function updateUserEmailSubscription(
  config: BrazeSDKServiceConfig,
  brazeUser: User,
  subscribed: boolean,
): void {
  if (
    config?.BRAZE_SUBSCRIPTION_NEWS_CONTENT == null ||
    config?.BRAZE_SUBSCRIPTION_PRODUCT_UPDATES == null ||
    config?.BRAZE_SUBSCRIPTION_SPECIAL_OFFERS == null
  ) {
    throw new Error("Missing subscription group config");
  }

  if (subscribed) {
    brazeUser.addToSubscriptionGroup(config.BRAZE_SUBSCRIPTION_NEWS_CONTENT);
    brazeUser.addToSubscriptionGroup(config.BRAZE_SUBSCRIPTION_PRODUCT_UPDATES);
    brazeUser.addToSubscriptionGroup(config.BRAZE_SUBSCRIPTION_SPECIAL_OFFERS);
  } else {
    brazeUser.removeFromSubscriptionGroup(
      config.BRAZE_SUBSCRIPTION_NEWS_CONTENT,
    );
    brazeUser.removeFromSubscriptionGroup(
      config.BRAZE_SUBSCRIPTION_PRODUCT_UPDATES,
    );
    brazeUser.removeFromSubscriptionGroup(
      config.BRAZE_SUBSCRIPTION_SPECIAL_OFFERS,
    );
  }
}
