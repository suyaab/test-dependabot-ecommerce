import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const accountSubscriptionPageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.08.09",
  subscribed: "n",
  page: {
    pageName: "accountSubscription",
    pageLevel1: "account",
    pageLevel2: "subscription",
    pageLevel3: "subscription",
  },
};

export default accountSubscriptionPageData;
