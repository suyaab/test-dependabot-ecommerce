import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const orderReturnsPageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.10.01",
  subscribed: "n",
  page: {
    pageName: "orderReturn",
    pageLevel1: "orders",
    pageLevel2: "orderReturn",
    pageLevel3: "orderReturn",
  },
};

export default orderReturnsPageData;
