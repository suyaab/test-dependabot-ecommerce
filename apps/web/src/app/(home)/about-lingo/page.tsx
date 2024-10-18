import { Metadata } from "next";

import { ServiceLocator } from "@ecommerce/cms";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import VeevaNumber from "~/components/VeevaNumber";
import AboutUsDuplex from "./modules/AboutUsDuplex";
import AboutUsHero from "./modules/AboutUsHero";
import AboutUsTopText from "./modules/AboutUsTopText";
import ExpertsSection from "./modules/ExpertsSection";

export async function generateMetadata(): Promise<Metadata> {
  const cms = ServiceLocator.getCMS();
  const metadata = await cms.getMetadata("AboutUs");
  return metadata;
}

export default function AboutUsPage() {
  return (
    <>
      <AnalyticsPageTracker page="about-lingo" />

      <VeevaNumber source="AboutUs" />

      <AboutUsHero className="under-menu" />

      <div data-menu-change />

      <AboutUsTopText />

      <AboutUsDuplex />

      <ExpertsSection />

      <div className="my-10" />
    </>
  );
}
