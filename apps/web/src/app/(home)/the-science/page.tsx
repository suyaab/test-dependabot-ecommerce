import { Metadata } from "next";

import { ServiceLocator } from "@ecommerce/cms";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import VeevaNumber from "~/components/VeevaNumber";
import ExpertsSection from "./modules/ExpertsSection";
import FAQContent from "./modules/FAQContent";
import FuelBetterItemList from "./modules/FuelBetterItemList";
import ReferencesSection from "./modules/ReferencesSection";
import TheScienceDuplex from "./modules/TheScienceDuplex";
import TheScienceHero from "./modules/TheScienceHero";
import TheScienceStudyDuplex from "./modules/TheScienceStudyDuplex";
import TheScienceTopText from "./modules/TheScienceTopText";

export async function generateMetadata(): Promise<Metadata> {
  const cms = ServiceLocator.getCMS();
  const metadata = await cms.getMetadata("TheScience");
  return metadata;
}

export default function TheSciencePage() {
  return (
    <>
      <AnalyticsPageTracker page="the-science" />

      <VeevaNumber source="TheScience" />

      <TheScienceHero className="under-menu" />

      <div data-menu-change />

      <TheScienceTopText />

      <TheScienceDuplex />

      <FuelBetterItemList />

      <TheScienceStudyDuplex />

      <ExpertsSection />

      <FAQContent />

      <ReferencesSection />
    </>
  );
}
