import { Metadata } from "next";

import { ServiceLocator } from "@ecommerce/cms";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import VeevaNumber from "~/components/VeevaNumber";
import BiosensorAccordion from "./modules/BiosensorAccordion";
import BiosensorFeaturesIconList from "./modules/BiosensorFeaturesIconList";
import ExperienceCarousel from "./modules/ExperienceCarousel";
import FAQContent from "./modules/FAQContent";
import LingoExperienceDuplex from "./modules/LingoExperienceDuplex";
import LingoExperienceHero from "./modules/LingoExperienceHero";
import ProductHighlightContent from "./modules/ProductHighlightContent";
import ReferenceText from "./modules/ReferenceText";
import ResearchInfoContent from "./modules/ResearchInfoContent";
import TabsCoachingApp from "./modules/TabsCoachingApp";
import WhatToExpect from "./modules/WhatToExpect";

export async function generateMetadata(): Promise<Metadata> {
  const cms = ServiceLocator.getCMS();
  const metadata = await cms.getMetadata("LingoExperience");
  return metadata;
}

export default function LingoExperiencePage() {
  return (
    <>
      <AnalyticsPageTracker page="lingo-experience" />

      <VeevaNumber source="LingoExperience" />

      <LingoExperienceHero className="under-menu" />

      <div data-menu-change />

      <ResearchInfoContent />

      <ExperienceCarousel />

      <BiosensorAccordion />

      <BiosensorFeaturesIconList />

      <TabsCoachingApp />

      <WhatToExpect />

      <LingoExperienceDuplex />

      <ProductHighlightContent />

      <FAQContent />

      <ReferenceText />
    </>
  );
}
