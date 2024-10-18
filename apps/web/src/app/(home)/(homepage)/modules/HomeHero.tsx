import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import Hero from "~/components/Hero";
import PreLaunchEmailCollectionModalWrapper from "~/components/PreLaunchEmailCollectionModalWrapper";
import { getFeatureFlag } from "~/lib/feature-flags/server";

export default async function HomeHero({ className }: { className?: string }) {
  const cms = ServiceLocator.getCMS();
  const isUsEcommerceEnabled = await getFeatureFlag("DTC_US_EcommerceRelease");

  const { image, alignContentX, alignContentY, theme, items } =
    await cms.getHeroContent("Home");

  return (
    <Hero
      image={image}
      alignContentX={alignContentX}
      alignContentY={alignContentY}
      theme={theme}
      contentItems={items}
      className={className}
      analyticsLocationAttribute={LocationAttributes.HERO}
    >
      {!isUsEcommerceEnabled && <PreLaunchEmailCollectionModalWrapper />}
    </Hero>
  );
}
