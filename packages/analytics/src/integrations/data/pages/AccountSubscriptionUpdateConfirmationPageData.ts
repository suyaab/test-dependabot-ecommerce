import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const accountSubscriptionUpdateConfirmationPageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.08.11",
  subscribed: "n",
  page: {
    pageName: "accountSubscriptionUpdate",
    pageLevel1: "account",
    pageLevel2: "subscription",
    pageLevel3: "update > confirmation",
  },
};

export default accountSubscriptionUpdateConfirmationPageData;
