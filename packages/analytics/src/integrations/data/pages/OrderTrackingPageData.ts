import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const orderTrackingPageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.10.02",
  subscribed: "n",
  page: {
    pageName: "orderTracking",
    pageLevel1: "orders",
    pageLevel2: "orderTracking",
    pageLevel3: "orderTracking",
  },
};

export default orderTrackingPageData;
