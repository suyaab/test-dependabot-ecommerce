import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const orderConfirmationPageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.09.01",
  subscribed: "n",
  page: {
    pageName: "orderConfirmation",
    pageLevel1: "orderConfirmation",
    pageLevel2: "orderConfirmation",
    pageLevel3: "orderConfirmation",
  },
};

export default orderConfirmationPageData;
