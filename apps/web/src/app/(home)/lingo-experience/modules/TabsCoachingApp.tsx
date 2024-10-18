import { Fragment } from "react";

import { LocationAttributes } from "@ecommerce/analytics";
import { ResponsiveImageContent, ServiceLocator } from "@ecommerce/cms";

import ResponsiveImage from "~/components/ResponsiveImage";
import TabsContent from "~/components/TabsContent";
import cn from "~/lib/utils";

interface CoachingAppTabProps {
  title?: string;
  text: string;
  invertTextColor?: boolean;
  image: ResponsiveImageContent;
  phoneImage: ResponsiveImageContent;
}

function CoachingAppTab({
  text,
  invertTextColor,
  image,
  phoneImage,
}: CoachingAppTabProps) {
  return (
    <div className="relative mb-32 pt-24">
      <ResponsiveImage
        url={image.url}
        desktopUrl={image.desktopUrl}
        alt={image.alt}
        width={image.width}
        height={image.height}
        desktopWidth={image.desktopWidth}
        desktopHeight={image.desktopHeight}
        className="absolute left-0 right-0 top-0 -z-10 max-h-[375px] object-cover lg:h-[682px] lg:max-h-none"
      />

      <ResponsiveImage
        url={phoneImage.url}
        desktopUrl={phoneImage.desktopUrl}
        alt={phoneImage.alt}
        width={phoneImage.width}
        height={phoneImage.height}
        desktopWidth={phoneImage.desktopWidth}
        desktopHeight={phoneImage.desktopHeight}
        className="mx-auto w-auto lg:max-w-[398px]"
      />
      <div className="lg:grid-container max-lg:container lg:absolute lg:bottom-52">
        <div className="lg:col-span-3 xl:col-span-4">
          <p
            className={cn("max-lg:opacity-70", {
              "lg:text-white": invertTextColor,
            })}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function TabsCoachingApp() {
  const cms = ServiceLocator.getCMS();
  const { title, description, tabs } = await cms.getLECoachingAppTabsContent();

  return (
    <section
      className="my-8"
      data-analytics-location={LocationAttributes.APP_HIGHLIGHT}
    >
      <div className="container mb-4 space-y-6 lg:mb-16">
        <h2 className="font-semibold">{title}</h2>
        <p>{description}</p>
      </div>

      <TabsContent
        tabNames={tabs.map(({ title }) => title)}
        analyticsLocationAttribute={LocationAttributes.APP_HIGHLIGHT}
      >
        {tabs.map(({ text, invertTextColor, image, phoneImage }) => (
          <Fragment key={title}>
            <CoachingAppTab
              text={text}
              invertTextColor={invertTextColor}
              image={image}
              phoneImage={phoneImage}
            />
          </Fragment>
        ))}
      </TabsContent>
    </section>
  );
}
