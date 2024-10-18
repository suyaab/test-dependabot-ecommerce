import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const promotionalProductsPageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.14.01",
  subscribed: "n",
  page: {
    pageName: "promotionalProducts",
    pageLevel1: "promotional",
    pageLevel2: "products",
    pageLevel3: "products",
  },
};

export default promotionalProductsPageData;
