import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const notFoundPageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.03.01",
  subscribed: "n",
  page: {
    pageName: "notFound",
    pageLevel1: "notFound",
    pageLevel2: "notFound",
    pageLevel3: "notFound",
  },
};

export default notFoundPageData;
