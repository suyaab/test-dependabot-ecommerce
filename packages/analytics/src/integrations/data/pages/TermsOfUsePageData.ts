import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const termsOfUsePageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.02.04",
  subscribed: "n",
  page: {
    pageName: "legal",
    pageLevel1: "websiteTermsOfUse",
    pageLevel2: "websiteTermsOfUse",
    pageLevel3: "websiteTermsOfUse",
  },
};

export default termsOfUsePageData;
