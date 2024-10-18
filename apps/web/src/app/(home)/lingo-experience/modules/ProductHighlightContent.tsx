import Image from "next/image";

import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import PreLaunchEmailCollectionModalWrapper from "~/components/PreLaunchEmailCollectionModalWrapper";
import { getFeatureFlag } from "~/lib/feature-flags/server";
import ProductHighlightEcommerceContentBlock from "./ProductHighlightEcommerceContentBlock";
import ProductHighlightNoEcommerceContentBlock from "./ProductHighlightNoEcommerceContentBlock";

export default async function ProductHighlightContent() {
  const isUseEcommerceEnabled = await getFeatureFlag("DTC_US_EcommerceRelease");

  return isUseEcommerceEnabled
    ? ProductHighlightContentEcommerce()
    : ProductHighlightContentNoEcommrce();
}

export async function ProductHighlightContentEcommerce() {
  const cms = ServiceLocator.getCMS();

  const productHighlight = await cms.getHomeProductHighlightEcommerceContent();

  const { url, desktopUrl, alt, width, height, desktopWidth, desktopHeight } =
    await cms.getResponsiveImage("HomeProductHighlight");

  return (
    <>
      {/* Aspect Ratio Style Setting to avoid CLS */}
      <style>{`
        @media (min-width: 1024px) {
          .aspect-ratio-desktop-hl { aspect-ratio: ${desktopWidth}/${desktopHeight}; }
        }
      `}</style>
      <section
        className="ProductHighlightContent container-full aspect-ratio-desktop-hl mb-32 mt-8 bg-linen pt-6 lg:relative lg:mt-28 lg:flex lg:items-center lg:py-24"
        data-analytics-location={LocationAttributes.SHOP}
      >
        <div className="container z-10 py-12 max-lg:mb-6 lg:relative">
          <ProductHighlightEcommerceContentBlock content={productHighlight} />
        </div>
        <Image
          src={url}
          alt={alt}
          width={width}
          height={height}
          className="w-full lg:hidden"
        />
        <Image
          src={desktopUrl}
          alt={alt}
          className="z-0 object-cover max-lg:hidden"
          fill
        />
      </section>
    </>
  );
}

export async function ProductHighlightContentNoEcommrce() {
  const cms = ServiceLocator.getCMS();

  const productHighlight = await cms.getHomeProductHighlightContent();

  const { url, desktopUrl, alt, width, height, desktopWidth, desktopHeight } =
    await cms.getResponsiveImage("HomeProductHighlight");
  return (
    <>
      {/* Aspect Ratio Style Setting to avoid CLS */}
      <style>{`
        @media (min-width: 1024px) {
          .aspect-ratio-desktop-hl { aspect-ratio: ${desktopWidth}/${desktopHeight}; }
        }
      `}</style>
      <section
        className="ProductHighlightContent container-full aspect-ratio-desktop-hl mb-32 mt-8 bg-linen pt-6 lg:relative lg:mt-28 lg:flex lg:items-center lg:py-24"
        data-analytics-location={LocationAttributes.SHOP}
      >
        <div className="container z-10 py-12 max-lg:mb-6 lg:relative">
          <ProductHighlightNoEcommerceContentBlock content={productHighlight}>
            <PreLaunchEmailCollectionModalWrapper />
          </ProductHighlightNoEcommerceContentBlock>
        </div>
        <Image
          src={url}
          alt={alt}
          width={width}
          height={height}
          className="w-full lg:hidden"
        />
        <Image
          src={desktopUrl}
          alt={alt}
          className="z-0 object-cover max-lg:hidden"
          fill
        />
      </section>
    </>
  );
}
