import { Metadata } from "next";

import { ServiceLocator as CmsServiceLocator } from "@ecommerce/cms";
import type { Product, ProductService } from "@ecommerce/commerce";
import { ServiceLocator } from "@ecommerce/commerce";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import FAQContent from "./FAQContent";
import NextStepsCarousel from "./NextStepsCarousel";
import Products from "./Products";

// TODO: remove when we setup Github build
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cms = CmsServiceLocator.getCMS();
  const metadata = await cms.getMetadata("PDP");
  return metadata;
}

export default async function ProductsPage() {
  const cms = CmsServiceLocator.getCMS();
  const productService: ProductService = ServiceLocator.getProductService();
  const productFeaturesContent = await cms.getProductFeaturesContent();
  const displayProducts: Product[] =
    await productService.getProductsByCategory("pdp");
  const displaySkus = displayProducts.map((p) => p.sku);

  const productContent = await cms.getProductCardsContent(displaySkus);
  const productCarouselContent = await cms.getProductCarouselContent();
  const productFormContent = await cms.getProductFormContent();
  const productDecideDialogContent = await cms.getProductDecideDialogContent();

  return (
    <section className="pb-10">
      <AnalyticsPageTracker page="products" />
      <div className="grid-container">
        <Products
          products={displayProducts}
          productCarouselContent={productCarouselContent}
          productContent={productContent}
          productFeaturesContent={productFeaturesContent}
          productFormContent={productFormContent}
          productDecideDialogContent={productDecideDialogContent}
        />
      </div>

      <NextStepsCarousel />

      <FAQContent />
    </section>
  );
}
