import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const checkoutPageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.12.01",
  subscribed: "n",
  page: {
    pageName: "checkout",
    pageLevel1: "checkout",
    pageLevel2: "checkout",
    pageLevel3: "checkout",
  },
};

export default checkoutPageData;
