import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceLocator as CmsServiceLocator } from "@ecommerce/cms";
import { ServiceLocator } from "@ecommerce/commerce";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import { getFeatureFlag } from "~/lib/feature-flags/server";
import FAQContent from "./FAQContent";
import NextStepsCarousel from "./NextStepsCarousel";
import Products from "./Products";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

// TODO: remove when we setup Github build
export const dynamic = "force-dynamic";

export default async function SamplePage() {
  const isPromotionalCheckoutEnabled = await getFeatureFlag(
    "DTC_US_PromotionalCheckout",
  );

  if (!isPromotionalCheckoutEnabled) {
    notFound();
  }

  const productService = ServiceLocator.getProductService();

  const cms = CmsServiceLocator.getCMS();
  const productFeaturesContent = await cms.getProductFeaturesContent();
  const displayProducts = await productService.getProductsByCategory("sample");
  const displaySkus = displayProducts.map((p) => p.sku);

  const productContent =
    await cms.getPromotionalProductCardsContent(displaySkus);
  const productCarouselContent =
    await cms.getPromotionalProductCarouselContent();
  const productFormContent = await cms.getPromotionalProductFormContent();

  return (
    <section className="pb-10">
      <AnalyticsPageTracker page="promotional-products" />
      <div className="grid-container">
        <Products
          productCarouselContent={productCarouselContent}
          productContent={productContent}
          productFeaturesContent={productFeaturesContent}
          productFormContent={productFormContent}
        />
      </div>

      <NextStepsCarousel />

      <FAQContent />
    </section>
  );
}
