import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const accountExistsPageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.08.20",
  subscribed: "n",
  page: {
    pageName: "accountExists",
    pageLevel1: "authentication",
    pageLevel2: "accountExists",
    pageLevel3: "accountExists",
  },
};

export default accountExistsPageData;
