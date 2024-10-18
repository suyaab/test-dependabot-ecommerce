import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const eulaPageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.02.01",
  subscribed: "n",
  page: {
    pageName: "legal",
    pageLevel1: "eula",
    pageLevel2: "eula",
    pageLevel3: "eula",
  },
};

export default eulaPageData;
