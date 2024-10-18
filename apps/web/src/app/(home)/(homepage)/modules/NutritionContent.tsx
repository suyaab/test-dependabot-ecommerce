import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import ContentBlock from "~/components/ContentBlock";
import ResponsiveImage from "~/components/ResponsiveImage";

export default async function NutritionContent() {
  const cms = ServiceLocator.getCMS();

  const nutritionContent = await cms.getHomeNutritionBlockContent();

  const { url, desktopUrl, alt, width, height, desktopWidth, desktopHeight } =
    await cms.getResponsiveImage("HomeNutrition");

  return (
    <section
      className="grid-container my-8 mb-20"
      data-analytics-location={LocationAttributes.INTRO}
    >
      <div className="lg:order1 order-2 col-span-full flex items-center lg:col-span-5">
        <div className="[&_p]:subtitle flex flex-col items-start gap-6 [&_p]:text-charcoal/60">
          <h2 className="whitespace-pre-line font-semibold">
            {nutritionContent.title}
          </h2>
          <ContentBlock
            items={nutritionContent.items}
            analyticsLocationAttribute={LocationAttributes.INTRO}
          />
        </div>
      </div>
      <div className="max-lg:no-l-gap no-r-gap order-1 col-span-full lg:order-2 lg:col-span-6 lg:col-start-7">
        <ResponsiveImage
          className="mb-10 lg:mb-0 lg:rounded-lg"
          url={url}
          desktopUrl={desktopUrl}
          alt={alt}
          width={width}
          height={height}
          desktopWidth={desktopWidth}
          desktopHeight={desktopHeight}
        />
      </div>
    </section>
  );
}
