import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const promotionalCheckoutPageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.14.02",
  subscribed: "n",
  page: {
    pageName: "promotionalCheckout",
    pageLevel1: "promotional",
    pageLevel2: "checkout",
    pageLevel3: "checkout",
  },
};

export default promotionalCheckoutPageData;
