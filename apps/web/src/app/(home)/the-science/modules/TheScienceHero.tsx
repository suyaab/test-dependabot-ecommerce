import { ServiceLocator } from "@ecommerce/cms";

import Hero from "~/components/Hero";

export default async function TheScienceHero({
  className,
}: {
  className?: string;
}) {
  const cms = ServiceLocator.getCMS();

  const { image, alignContentX, alignContentY, theme, items } =
    await cms.getHeroContent("TheScience");
  return (
    <Hero
      image={image}
      alignContentX={alignContentX}
      alignContentY={alignContentY}
      theme={theme}
      contentItems={items}
      className={className}
    />
  );
}
