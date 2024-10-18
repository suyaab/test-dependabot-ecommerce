// import BlogContent from "./modules/BlogContent";
import { Metadata } from "next";

import { ServiceLocator } from "@ecommerce/cms";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import EmailsCollectionModalWrapper from "~/components/EmailsCollectionModalWrapper";
import VeevaNumber from "~/components/VeevaNumber";
import { getFeatureFlag } from "~/lib/feature-flags/server";
import FAQContent from "./modules/FAQContent";
import FeaturesContent from "./modules/FeaturesContent";
import GlucoseInfoContent from "./modules/GlucoseInfoContent";
import HomeHero from "./modules/HomeHero";
import MetabolismMythsContent from "./modules/MetabolismMythsContent";
import NutritionContent from "./modules/NutritionContent";
import ProductHighlightContent from "./modules/ProductHighlightContent";
import ScienceContent from "./modules/ScienceContent";

export async function generateMetadata(): Promise<Metadata> {
  const cms = ServiceLocator.getCMS();
  const metadata = await cms.getMetadata("Home");
  return metadata;
}

export default async function Home() {
  const isEmailCollectionModalEnabled = await getFeatureFlag(
    "DTC_US_Homepage_EmailCollectionModal",
  );
  return (
    <>
      <VeevaNumber source="Home" />

      <AnalyticsPageTracker page="home" />

      <HomeHero className="under-menu" />

      <div data-menu-change />

      {isEmailCollectionModalEnabled && <EmailsCollectionModalWrapper />}

      <NutritionContent />

      <ProductHighlightContent />

      <GlucoseInfoContent />

      <FeaturesContent />

      <ScienceContent />

      {/* Hidden for the urgent release */}
      {/* <BlogContent /> */}

      <MetabolismMythsContent />

      <FAQContent />
    </>
  );
}
