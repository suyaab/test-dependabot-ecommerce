import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const accountOrdersReturnsPageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.08.05",
  subscribed: "n",
  page: {
    pageName: "accountOrdersReturns",
    pageLevel1: "account",
    pageLevel2: "orders",
    pageLevel3: "returns",
  },
};

export default accountOrdersReturnsPageData;
