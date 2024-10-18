import AnalyticsTracking from "./AnalyticsTracking";
import aboutLingoPageData from "./data/pages/AboutLingoPageData";
import homePageData from "./data/pages/HomePageData";
import lingoExperiencePageData from "./data/pages/LingoExperiencePageData";
import theSciencePageData from "./data/pages/TheSciencePageData";

describe("trackPage", () => {
  beforeEach(() => {
    window.adobeDataLayer = [];
    window.dataLayer = [];
  });

  const adobeAnalytics = new AnalyticsTracking();

  it("should call adobe analytics for home page", () => {
    adobeAnalytics.trackPage("home");

    expect(window.adobeDataLayer).toEqual([homePageData]);
  });

  it("should call adobe analytics for lingo experience page", () => {
    adobeAnalytics.trackPage("lingo-experience");

    expect(window.adobeDataLayer).toEqual([lingoExperiencePageData]);
  });

  it("should call adobe analytics for the science page", () => {
    adobeAnalytics.trackPage("the-science");

    expect(window.adobeDataLayer).toEqual([theSciencePageData]);
  });

  it("should call adobe analytics for about lingo page", () => {
    adobeAnalytics.trackPage("about-lingo");

    expect(window.adobeDataLayer).toEqual([aboutLingoPageData]);
  });
});
