import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const accountOrderPageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.08.04",
  subscribed: "n",
  page: {
    pageName: "accountOrder",
    pageLevel1: "account",
    pageLevel2: "orders",
    pageLevel3: "order",
  },
};

export default accountOrderPageData;
