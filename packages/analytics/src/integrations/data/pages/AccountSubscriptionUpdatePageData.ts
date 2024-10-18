import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const accountSubscriptionUpdatePageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.08.10",
  subscribed: "n",
  page: {
    pageName: "accountSubscriptionUpdate",
    pageLevel1: "account",
    pageLevel2: "subscription",
    pageLevel3: "update",
  },
};

export default accountSubscriptionUpdatePageData;
