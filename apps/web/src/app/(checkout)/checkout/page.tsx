import { headers } from "next/headers";
import Script from "next/script";

import {
  CheckoutSectionSchema,
  ServiceLocator as CMSServiceLocator,
} from "@ecommerce/cms";
import { ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";
import { SchemaException } from "@ecommerce/utils";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import { extractDynamicData } from "~/components/analytics/extractDynamicData";
import ActionException from "~/app/actions/ActionException";
import { getOrCreateCheckoutSession } from "~/app/actions/checkout/checkoutSession";
import { getCart } from "~/app/actions/checkout/getCart";
import { env } from "~/env";
import CheckoutErrorBlock from "./CheckoutError";
import CheckoutForm from "./CheckoutForm";
import EmptyCart from "./emptyCart";
import OrderSummary from "./orderSummary/OrderSummary";

export const dynamic = "force-dynamic";

export default async function Checkout({
  searchParams: { error },
}: {
  searchParams: { error?: string };
}) {
  const logger = getLogger({
    prefix: "checkout",
    headers: headers(),
  });

  try {
    logger.info("Loading checkout page");

    const cart = await getCart();

    if (cart?.id == null || !cart.isActive || cart.lineItems[0] == null) {
      logger.debug("No active cart found");
      return <EmptyCart />;
    }

    const cms = CMSServiceLocator.getCMS();
    const checkoutSectionContent = await cms.getCheckoutSectionContent();
    const parsedContent = CheckoutSectionSchema.safeParse(
      checkoutSectionContent,
    );

    if (!parsedContent.success) {
      throw new SchemaException(
        "Failed to parse checkout section content",
        parsedContent.error,
      );
    }

    const checkoutSession = await getOrCreateCheckoutSession(cart);

    const productService = ServiceLocator.getProductService();
    const product = await productService.getProduct(
      cart.lineItems[0].product.id,
    );

    logger.info({ product }, "Retrieved product for checkout");

    const productData = extractDynamicData(cart, product);

    return (
      <div className="bg-white">
        <AnalyticsPageTracker page="checkout" dynamicData={productData} />
        <div className="grid-container max-lg:pl-0">
          <Script id="payonOptions" src="/scripts/payon/options.js" />
          <Script
            src={`${env.PAYON_API_URL}/paymentWidgets.js?checkoutId=${checkoutSession.id}`}
          />

          <div className="no-r-gap relative z-10 col-span-full bg-linen-light max-lg:px-6 lg:order-2 lg:col-span-5 lg:col-start-8">
            <OrderSummary cart={cart} checkoutSessionId={checkoutSession.id} />
          </div>
          <div className="absolute right-0 z-0 h-full w-5/12 bg-linen-light max-lg:hidden" />

          <div className="no-l-gap max-lg:no-r-gap col-span-full grid grid-cols-subgrid max-lg:px-6 lg:order-1 lg:col-span-7 lg:pl-[var(--sideGapDesktop)]">
            <div className="col-span-full max-lg:px-[var(--sideGap)] max-lg:pr-0 lg:col-span-6">
              <h1 className="my-10">Checkout</h1>

              <div className="col-span-full">
                {error != null && <CheckoutErrorBlock error={error} />}
              </div>

              <CheckoutForm
                cart={cart}
                checkoutSession={checkoutSession}
                product={product}
                content={parsedContent.data}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    if (!(error instanceof ActionException)) {
      logger.error(error, "Error on checkout page");
    }
    throw error;
  }
}
