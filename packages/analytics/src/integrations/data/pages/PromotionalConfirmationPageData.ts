import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const promotionalConfirmationPageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.14.03",
  subscribed: "n",
  page: {
    pageName: "promotionalConfirmation",
    pageLevel1: "promotional",
    pageLevel2: "confirmation",
    pageLevel3: "confirmation",
  },
};

export default promotionalConfirmationPageData;
