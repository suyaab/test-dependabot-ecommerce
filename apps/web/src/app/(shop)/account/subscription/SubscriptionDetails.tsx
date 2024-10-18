import { ServiceLocator as CMSServiceLocator } from "@ecommerce/cms";
import { Product, ServiceLocator, Subscription } from "@ecommerce/commerce";
import { formatCurrency } from "@ecommerce/utils";

import PauseResumeButton from "~/components/account/PauseResumeButton";
import Hyperlink from "~/components/Hyperlink";
import TooltipIcon from "~/components/TooltipIcon";
import NoActiveSubscription from "~/app/(shop)/account/subscription/NoActiveSubscription";
import ChangeSubscriptionDate from "./ChangeSubscriptionDate";
import { isWithinDays } from "./NextPlanDetails";

/**
 * calculate next renewal date by taking `nextOrderDate` and adding product of `prepaidShipments` & `shipmentFrequency`
 *
 * Usage:
 * ```ts
 * getRenewalDate(subscription, subscriptionProduct)
 * ```
 *
 * ```
 * example:
 * 07-01-2024 + (28 days shipment frequency * 1 prepaid shipment) = 07-29-2024
 * ```
 *
 * @param subscription
 * @param subscriptionProduct
 */
// TODO: Move this logic into `SubscriptionService`
export function getRenewalDate(
  subscription: Subscription,
  subscriptionProduct: Product & { type: "subscription" },
): Date {
  const nextShipmentDate = new Date(subscription.nextOrderDate);

  return new Date(
    nextShipmentDate.setDate(
      nextShipmentDate.getDate() +
        subscription.prepaidShipmentsRemaining *
          subscriptionProduct.attributes.shipmentFrequency,
    ),
  );
}

export default async function SubscriptionDetails({
  subscription,
}: {
  subscription: Subscription;
}) {
  if (
    subscription?.status === "cancelled" ||
    subscription.status === "inactive"
  ) {
    return <NoActiveSubscription />;
  }

  const orderService = ServiceLocator.getOrderService();
  const mostRecentOrder = await orderService.getMostRecentOrder(
    subscription.customerId,
  );

  const parentOrder = await orderService.getOrderByOrderNumber(
    subscription.parentOrderNumber,
  );

  if (parentOrder == null || mostRecentOrder == null) {
    throw new Error("Unable to find account subscription orders");
  }

  const productService = ServiceLocator.getProductService();
  const subscriptionProduct = await productService.getProduct(
    subscription.subscription,
  );

  if (subscriptionProduct == null) {
    throw new Error("Unable to find account subscription product");
  }

  if (subscriptionProduct.type !== "subscription") {
    throw new Error("Subscription details product is not a subscription");
  }

  const cms = CMSServiceLocator.getCMS();
  const productContent = await cms.getProductCardContent(
    subscriptionProduct.sku,
  );

  const renewalDate = getRenewalDate(subscription, subscriptionProduct);

  if (subscription?.status === "paused") {
    return (
      <div className="mt-3 flex items-start rounded-2xl border border-charcoal/10 bg-white px-10 py-8 max-sm:flex-col sm:justify-between">
        <p className="font-bold max-sm:mb-8">Subscription Paused</p>
        <div className="flex flex-col gap-4">
          <PauseResumeButton subscriptionStatus={subscription.status} />
          {!isWithinDays(7, renewalDate) && (
            <Hyperlink
              url="/account/subscription/update"
              variant="outline"
              text="Change plan"
              className="mt-4 lg:mt-0"
            />
          )}
        </div>
      </div>
    );
  }

  if (subscription.nextPlan != null) {
    return (
      <>
        <div className="my-2 rounded-2xl border border-charcoal/10 bg-white px-10 py-8">
          <div className="flex items-center justify-between">
            <h4 className="headline">{productContent.title}</h4>
          </div>

          <hr className="my-2 border-linen" />

          {/* Next Order Date Row */}
          <div className="my-2 flex flex-col items-start justify-between lg:flex-row">
            <div className="flex items-center justify-center">
              <p>Plan ending date</p>
            </div>

            <div className="flex justify-between">
              <p>{renewalDate.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // show different ui if subscription isn't auto-renewing
  if (!subscriptionProduct.attributes.autoRenew) {
    return (
      <>
        <div className="my-2 rounded-2xl border border-charcoal/10 bg-white px-10 py-8">
          <div className="flex items-center justify-between">
            <h4 className="headline">{productContent.title}</h4>
          </div>

          <hr className="my-2 border-linen" />

          {/* Next Order Date Row */}
          <div className="my-2 flex flex-col items-start justify-between lg:flex-row">
            <div className="flex items-center justify-center">
              <p>Plan ending date</p>
            </div>

            <div className="flex justify-between">
              <p>{subscription.nextOrderDate.toLocaleDateString()} - </p>
              <a href="/account/subscription/update" className="ml-2 underline">
                Order more now
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="my-2 rounded-2xl border border-charcoal/10 bg-white px-10 py-8">
        <div className="flex items-center justify-between">
          <h4 className="headline my-4">{productContent.title}</h4>
        </div>

        <hr className="my-2 border-linen" />

        {/* Auto Renewal Payment Row */}
        <div className="my-2 flex flex-col items-start justify-between lg:flex-row">
          <div className="flex items-center justify-center">
            <p className="mr-1">Auto-renewal date and price</p>
            <TooltipIcon tooltipContent="This is the amount your card will be authorized for, please allow 1-3 business days from the date indicated for your purchase to be updated and taken from your account." />
          </div>

          <div className="flex justify-between">
            <p>
              {formatCurrency(
                subscriptionProduct.price.currency,
                subscriptionProduct.price.amount,
              )}
              {" + Applicable Tax, "}
              on {renewalDate.toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Next Order Date Row */}
        <div className="my-2 mt-4 flex flex-col items-start justify-between lg:mt-0 lg:flex-row">
          <div className="flex items-center justify-center">
            <p className="mr-1">Auto-renewal order date</p>
            <TooltipIcon tooltipContent="This is the date your order will be updated, please allow ~5-7 business days for processing and shipping." />
          </div>

          <div className="flex justify-between">
            <ChangeSubscriptionDate subscription={subscription} />

            <p>{subscription.nextOrderDate.toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </>
  );
}
