import { ServiceLocator as CMSServiceLocator } from "@ecommerce/cms";
import { ServiceLocator, Subscription } from "@ecommerce/commerce";
import { formatCurrency } from "@ecommerce/utils";

import { getRenewalDate } from "~/app/(shop)/account/subscription/SubscriptionDetails";
import UpcomingChange from "~/app/(shop)/account/subscription/UpcomingChange";

export function isWithinDays(days: number, date: Date): boolean {
  const today = new Date();

  // Set the `today` date to X days from now
  const xDaysFromToday = new Date();
  xDaysFromToday.setDate(today.getDate() + days);

  return date <= xDaysFromToday;
}

export default async function NextPlanDetails({
  subscription,
}: {
  subscription: Subscription;
}) {
  const cms = CMSServiceLocator.getCMS();
  const productService = ServiceLocator.getProductService();

  // existing product subscription
  const product = await productService.getProduct(subscription.subscription);

  if (product == null || product.type !== "subscription") {
    throw new Error("Unable to find account next plan subscription product");
  }

  const renewalDate = getRenewalDate(subscription, product);

  // user has already changed to a new, upcoming subscription
  if (subscription.nextPlan != null) {
    const nextPlanProduct = await productService.getProduct(
      subscription.nextPlan,
    );

    const nextPlanProductContent = await cms.getProductCardContent(
      nextPlanProduct.sku,
    );

    return (
      <>
        <h2 className="headline mb-4 mt-8">Next Plan</h2>

        <div className="my-2 rounded-2xl border border-charcoal/10 bg-white px-10 py-8">
          <div className="flex items-center justify-between">
            <h4 className="headline">{nextPlanProductContent.title}</h4>
          </div>

          <hr className="my-2 border-linen" />

          {/* Plan Start Date Row */}
          <div className="my-2 flex flex-col items-start justify-between lg:flex-row">
            <div className="flex items-center justify-center">
              <p>Plan start date</p>
            </div>

            <div className="flex justify-between">
              <p>{renewalDate.toLocaleDateString()}</p>
            </div>
          </div>

          {/* Plan Cost Row */}
          <div className="my-2 flex flex-col items-start justify-between lg:flex-row">
            <div className="flex items-center justify-center">
              <p>Plan price (USD)</p>
            </div>

            <div className="flex justify-between">
              <p>
                {formatCurrency(
                  nextPlanProduct.price.currency,
                  nextPlanProduct.price.amount,
                )}
                {" + Applicable Tax"}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // user's plan is inactive
  if (subscription.status === "inactive") {
    return (
      <UpcomingChange
        title="We notice your plan has ended."
        subtitle="Would you like to order more Lingo biosensors?"
        buttonText="Order more Lingo biosensors"
      />
    );
  }

  // user non-auto-renew plan is ending
  if (
    !product.attributes.autoRenew &&
    isWithinDays(5, subscription.nextOrderDate)
  ) {
    return (
      <UpcomingChange
        title="We notice your plan ends soon."
        subtitle="Would you like to order more Lingo biosensors?"
        buttonText="Order more Lingo biosensors"
      />
    );
  }

  // subscription auto-renew is approaching
  if (isWithinDays(7, renewalDate)) {
    return (
      <UpcomingChange
        title="We notice your subscription is renewing soon."
        subtitle="Would you like to change your Lingo plan?"
        buttonText="Change plan"
      />
    );
  }

  return null;
}
