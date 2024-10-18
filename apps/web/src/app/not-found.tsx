import { Metadata } from "next";

import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import ContentBlock from "~/components/ContentBlock";
import Footer from "~/components/Footer";
import Navigation from "~/components/Navigation";
import ResponsiveImage from "~/components/ResponsiveImage";
import VeevaNumber from "~/components/VeevaNumber";
import { getFeatureFlag } from "~/lib/feature-flags/server";

export async function generateMetadata(): Promise<Metadata> {
  const cms = ServiceLocator.getCMS();
  const metadata = await cms.getMetadata("NotFound");
  return metadata;
}

export default async function NotFoundPage() {
  const cms = ServiceLocator.getCMS();

  const navigationContent = await cms.getNavContent();
  const emailCollectionModalContent =
    await cms.getPreLaunchEmailsCollectionModalContent();

  const isUsEcommerceEnabled = await getFeatureFlag("DTC_US_EcommerceRelease");

  const notFoundContent = await cms.getNotFoundContent();
  const image = await cms.getResponsiveImage("NotFound");

  return (
    <>
      <AnalyticsPageTracker page="not-found" />

      <Navigation
        items={navigationContent.items}
        emailCollectionModalContent={emailCollectionModalContent}
        button={navigationContent.button}
        className="z-10"
        isUsEcommerceEnabled={isUsEcommerceEnabled}
      >
        <VeevaNumber source="Navigation" />
        {/* FIXME: Remove after launch */}
        <VeevaNumber source="PreLaunchEmailsCollectionModal" />
      </Navigation>

      <main data-layout="home" className="relative z-0">
        <section
          className="grid-container my-8 mb-20"
          data-analytics-location={LocationAttributes.NOT_FOUND}
        >
          <div className="lg:order1 order-2 col-span-full flex items-center lg:col-span-5">
            <div className="flex flex-col items-start gap-6 [&_p]:text-charcoal/60">
              <span className="font-semibold text-2xl">
                {notFoundContent.suptitle}
              </span>
              <h2 className="whitespace-pre-line font-semibold">
                {notFoundContent.title}
              </h2>
              <ContentBlock
                items={notFoundContent.items}
                analyticsLocationAttribute={LocationAttributes.NOT_FOUND}
              />
            </div>
          </div>

          <div className="max-lg:no-l-gap no-r-gap order-1 col-span-full lg:order-2 lg:col-span-6 lg:col-start-7">
            <ResponsiveImage
              className="mb-10 lg:mb-0 lg:rounded-lg"
              url={image.url}
              desktopUrl={image.desktopUrl}
              alt={image.alt}
              width={image.width}
              height={image.height}
              desktopWidth={image.desktopWidth}
              desktopHeight={image.desktopHeight}
            />
          </div>
        </section>
      </main>

      <Footer className="z-0" />
    </>
  );
}
