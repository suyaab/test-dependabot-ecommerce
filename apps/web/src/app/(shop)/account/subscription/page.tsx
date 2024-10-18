import { Metadata } from "next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/auth";
import { ServiceLocator as CmsServiceLocator } from "@ecommerce/cms";
import { ServiceLocator as CTServiceLocator } from "@ecommerce/commerce";

import PauseResumeButton from "~/components/account/PauseResumeButton";
import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { authRegionCheck } from "../helpers";
import CancelSubscriptionButton from "./CancelSubscriptionButton";
import MostRecentOrder from "./MostRecentOrder";
import MySubscription from "./MySubscription";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cms = CmsServiceLocator.getCMS();
  const metadata = await cms.getMetadata("Account");
  return metadata;
}

async function AccountSubscriptionPage() {
  await authRegionCheck();

  const authService = ServiceLocator.getAuthService();
  const customer = await authService.getAuthenticatedCustomer();

  if (customer?.subscription == null) {
    throw new Error("Unable to find customer for account subscription");
  }

  const {
    subscription,
    status: subscriptionStatus,
    prepaidShipmentsRemaining,
  } = customer.subscription;

  const productService = CTServiceLocator.getProductService();

  // existing product subscription
  const product = await productService.getProduct(subscription);

  return (
    <div className="container">
      <AnalyticsPageTracker page="account-subscription" />
      <div className="my-8 mb-20">
        <Breadcrumbs
          links={[
            {
              text: "Account",
              url: "/account",
            },
            {
              text: "My plan",
              url: "/account/subscription",
            },
          ]}
          analyticsLocationAttribute={LocationAttributes.ACCOUNT_DETAILS}
        />

        <h2 className="headline mb-4 mt-8">Current plan</h2>

        <MySubscription customer={customer} />

        <MostRecentOrder customer={customer} />

        <div className="mt-16 flex items-center justify-center gap-8">
          {(subscriptionStatus === "active" ||
            subscriptionStatus === "paused") &&
            product.type === "subscription" &&
            product.attributes.autoRenew &&
            prepaidShipmentsRemaining === 0 && (
              <PauseResumeButton subscriptionStatus={subscriptionStatus} />
            )}
          {subscriptionStatus !== "cancelled" && <CancelSubscriptionButton />}
        </div>
      </div>
    </div>
  );
}

export default withPageAuthRequired(AccountSubscriptionPage, {
  returnTo: "/account/subscription",
});
