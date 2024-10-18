import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const accountShippingAddressPageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.08.08",
  subscribed: "n",
  page: {
    pageName: "accountShippingAddress",
    pageLevel1: "account",
    pageLevel2: "shippingAddress",
    pageLevel3: "shippingAddress",
  },
};

export default accountShippingAddressPageData;
