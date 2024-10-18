import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const unsubscribePageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.07.01",
  subscribed: "n",
  page: {
    pageName: "unsubscribe",
    pageLevel1: "unsubscribe",
    pageLevel2: "unsubscribe",
    pageLevel3: "unsubscribe",
  },
};

export default unsubscribePageData;
