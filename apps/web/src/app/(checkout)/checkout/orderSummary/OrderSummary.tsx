import { headers } from "next/headers";
import Link from "next/link";

import { LocationAttributes } from "@ecommerce/analytics";
import {
  CheckoutProductsContent,
  ServiceLocator as CMSServiceLocator,
  ProductCardContent,
} from "@ecommerce/cms";
import { Cart } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";
import { formatCurrency } from "@ecommerce/utils";

import CheckoutProductCartItem from "~/components/CheckoutProductCartItem";
import ResponsiveImage from "~/components/ResponsiveImage";
import TooltipIcon from "~/components/TooltipIcon";
import ActionException from "~/app/actions/ActionException";
import DiscountCodeForm from "./DiscountCodeForm";

function mapCartLineItemsToProductCardContent(
  cart: Cart,
  productsDetails: CheckoutProductsContent,
): ProductCardContent[] {
  return cart.lineItems.map((lineItem) => {
    const newPriceDetails = {
      priceDetails: {
        price: {
          amount: lineItem.price,
          currency: cart.currency,
        },
        discount: {
          amount: lineItem.totalDiscount,
          currency: cart.currency,
        },
        tax: {
          amount:
            lineItem.taxRate != null ? lineItem.price * lineItem.taxRate : 0,
          currency: cart.currency,
        },
      },
    };
    if (productsDetails[lineItem.product.sku] == null) {
      throw new Error(
        `Product with SKU ${lineItem.product.sku} not found in CMS`,
      );
    }
    return {
      ...productsDetails[lineItem.product.sku]!,
      ...newPriceDetails,
    };
  });
}

export default async function OrderSummary({
  cart,
  checkoutSessionId,
}: {
  cart: Cart;
  checkoutSessionId: string;
}) {
  const logger = getLogger({
    prefix: "web:checkout:OrderSummary",
    headers: headers(),
  });

  try {
    const cms = CMSServiceLocator.getCMS();

    const checkoutProductsDetails = await cms.getCheckoutProductsContent();
    const completeProductsData = mapCartLineItemsToProductCardContent(
      cart,
      checkoutProductsDetails,
    );

    const {
      discountCodeForm,
      totalSectionLabels,
      subscriptionTotalLabel,
      subscriptionTooltip,
      taxAmountPlaceholder,
      moneybackImage,
    } = await cms.getCheckoutOrderSummaryContent();

    return (
      <div className="py-6 lg:py-36 lg:pl-6 lg:pr-24">
        {completeProductsData.map((product) => {
          return (
            <CheckoutProductCartItem product={product} key={product.title} />
          );
        })}

        <DiscountCodeForm
          formContent={discountCodeForm}
          cart={cart}
          checkoutSessionId={checkoutSessionId}
        />

        <div className="mt-14 flex justify-between">
          <p>{totalSectionLabels.subtotalLabel}</p>
          <p>
            <strong>{formatCurrency(cart.currency, cart.subtotal)}</strong>
          </p>
        </div>

        {cart.totalDiscount != null && (
          <div className="mt-6 flex justify-between">
            <p>{totalSectionLabels.discountLabel}</p>
            <p className="text-charcoal/50">
              {formatCurrency(cart.currency, cart.totalDiscount)}
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <p>{totalSectionLabels.taxLabel}</p>
          <p className="text-charcoal/50">
            {cart.totalTaxAmount != null
              ? formatCurrency(cart.currency, cart.totalTaxAmount)
              : taxAmountPlaceholder}
          </p>
        </div>

        <div className="mt-6 flex justify-between">
          <p>{totalSectionLabels.shippingLabel}</p>
          <p className="text-charcoal/50">Free</p>
        </div>

        <div className="mt-6 flex justify-between text-2xl">
          <p>{totalSectionLabels.estimatedTotalLabel}</p>
          <p>
            <strong>{formatCurrency(cart.currency, cart.totalPrice)}</strong>
          </p>
        </div>

        <div className="mt-6 border-b border-charcoal/50" />

        {completeProductsData.length > 0 &&
          completeProductsData[0]?.deliveryDetails !== null && (
            <div className="relative mt-6 flex justify-between text-charcoal/50 max-lg:text-sm">
              <div>
                {subscriptionTotalLabel}{" "}
                <TooltipIcon tooltipContent={subscriptionTooltip} />
              </div>
              <div>
                {formatCurrency(cart.currency, cart.totalPrice)} every{" "}
                {completeProductsData[0]?.deliveryDetails?.count}{" "}
                {completeProductsData[0]?.deliveryDetails?.frequency}
              </div>
            </div>
          )}

        <div className="mt-16 flex">
          <ResponsiveImage {...moneybackImage} />
          <div className="ml-6">
            <p className="text-lg">
              <strong>30 day money back guarantee</strong>
            </p>
            <p className="text-sm text-charcoal/60">
              We’re confident you’ll see the power of Lingo within 30 days. If
              not, we’ll give you your money back.{" "}
              <strong>Applies to your first purchase only</strong>. See our{" "}
              <Link
                href="/terms-of-sale"
                target="_blank"
                rel="noreferrer"
                data-analytics-action="Terms of Sale"
                data-analytics-location={LocationAttributes.CHECKOUT}
                className="underline hover:no-underline"
              >
                Terms of sale
              </Link>{" "}
              for details.
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    if (!(error instanceof ActionException)) {
      logger.error(error, "Failed to load order summary");
    }
    throw error;
  }
}
