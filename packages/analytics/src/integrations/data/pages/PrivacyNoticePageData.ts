import { AnalyticsPreset } from "src/integrations/AnalyticsTracking";

const privacyNoticePageData: AnalyticsPreset = {
  event: "screen_view",
  beaconId: "02.02.02",
  subscribed: "n",
  page: {
    pageName: "legal",
    pageLevel1: "privacyNotice",
    pageLevel2: "privacyNotice",
    pageLevel3: "privacyNotice",
  },
};

export default privacyNoticePageData;
