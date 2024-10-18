import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ServiceLocator as CMSServiceLocator,
  PromotionalCheckoutSectionSchema,
} from "@ecommerce/cms";
import { ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";
import { SchemaException } from "@ecommerce/utils";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import { extractDynamicData } from "~/components/analytics/extractDynamicData";
import { getPromoCart } from "~/app/actions/promotional/getPromoCart";
import { getFeatureFlag } from "~/lib/feature-flags/server";
import OrderSummary from "./orderSummary/OrderSummary";
import PromotionalForm from "./PromotionalForm";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function PromotionalPage({
  params,
}: {
  params: { sku: string };
}) {
  const logger = getLogger({ prefix: "web:promoCheckout:PromotionalPage" });

  logger.info({ sku: params.sku }, "Promotional checkout page");

  const isPromotionalCheckoutEnabled = await getFeatureFlag(
    "DTC_US_PromotionalCheckout",
  );

  if (!isPromotionalCheckoutEnabled) {
    notFound();
  }

  const productService = ServiceLocator.getProductService();
  const product = await productService.getProductBySku(params.sku);

  logger.info({ product }, "Product found");

  const cart = await getPromoCart(product);

  if (cart.lineItems[0] == null) {
    throw new Error("Cart not found");
  }

  const cms = CMSServiceLocator.getCMS();
  const content = await cms.getPromotionalCheckoutSectionContent();
  const parsedContent = PromotionalCheckoutSectionSchema.safeParse(content);

  if (!parsedContent.success) {
    throw new SchemaException(
      "Failed to parse checkout section content",
      parsedContent.error,
    );
  }

  const productData = extractDynamicData(cart, product);

  return (
    <div className="bg-white">
      <AnalyticsPageTracker
        page="promotional-checkout"
        dynamicData={productData}
      />
      <div className="grid-container max-lg:pl-0">
        <div className="no-r-gap relative z-10 col-span-full bg-linen-light max-lg:px-6 lg:order-2 lg:col-span-5 lg:col-start-8">
          <OrderSummary sku={params.sku} />
        </div>
        <div className="absolute right-0 z-0 h-full w-5/12 bg-linen-light max-lg:hidden" />

        <div className="no-l-gap max-lg:no-r-gap col-span-full grid grid-cols-subgrid max-lg:px-6 lg:order-1 lg:col-span-7 lg:pl-[var(--sideGapDesktop)]">
          <div className="col-span-full max-lg:px-[var(--sideGap)] max-lg:pr-0 lg:col-span-6">
            <h1 className="my-8">Promotional Checkout</h1>

            <div className="mb-12 rounded-lg bg-linen-light p-3">
              <p>
                <strong>
                  Please enter your information and promotional code to
                  checkout.
                </strong>
              </p>
              <p className="text-charcoal/80">
                If you have any questions or concerns, please email{" "}
                <a
                  className="underline"
                  href="mailto:lingosupport-us@hellolingo.com"
                >
                  lingosupport-us@hellolingo.com
                </a>
              </p>
            </div>

            <PromotionalForm cart={cart} content={parsedContent.data} />
          </div>
        </div>
      </div>
    </div>
  );
}
