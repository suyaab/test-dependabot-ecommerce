import { Metadata } from "next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/auth";
import { ServiceLocator as CmsServiceLocator } from "@ecommerce/cms";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import { authRegionCheck } from "./helpers";
import MySubscription from "./subscription/MySubscription";

export async function generateMetadata(): Promise<Metadata> {
  const cms = CmsServiceLocator.getCMS();
  const metadata = await cms.getMetadata("Account");
  return metadata;
}

async function AccountPage() {
  await authRegionCheck();

  const authService = ServiceLocator.getAuthService();
  const customer = await authService.getAuthenticatedCustomer();

  if (customer == null) {
    throw new Error("Unable to find customer for account management");
  }
  const subscription = customer.subscription;
  return (
    <div className="container">
      <AnalyticsPageTracker page="account" />
      <div className="my-8 mb-20">
        <h1 className="mb-12 border-b-2 border-b-charcoal/10 pb-6">
          Account management
        </h1>

        <h2 className="headline mb-4 mt-12">Current plan</h2>
        <MySubscription customer={customer} />
        <h2 className="headline my-12">Account details</h2>
        <a
          href="/account/info"
          data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
          data-analytics-action="My account"
        >
          <div className="my-2 rounded-2xl border-2 border-b-charcoal/10 bg-white px-10 py-8">
            My account
          </div>
        </a>
        {subscription != null && (
          <a
            href="/account/subscription"
            data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
            data-analytics-action="My subscription"
          >
            <div className="my-2 rounded-2xl border-2 border-b-charcoal/10 bg-white px-10 py-8">
              My plan
            </div>
          </a>
        )}
        <a
          href="/account/orders"
          data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
          data-analytics-action="Orders"
        >
          <div className="my-2 rounded-2xl border-2 border-b-charcoal/10 bg-white px-10 py-8">
            Orders
          </div>
        </a>
        {subscription != null && (
          <a
            href="/account/payment-details"
            data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
            data-analytics-action="Payment details"
          >
            <div className="my-2 rounded-2xl border-2 border-b-charcoal/10 bg-white px-10 py-8">
              Payment details
            </div>
          </a>
        )}
        <a
          href="/account/shipping-address"
          data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
          data-analytics-action="Shipping address"
        >
          <div className="my-2 rounded-2xl border-2 border-b-charcoal/10 bg-white px-10 py-8">
            Shipping address
          </div>
        </a>
        <a
          href="/account/privacy"
          data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
          data-analytics-action="Privacy and consent"
        >
          <div className="my-2 rounded-2xl border-2 border-b-charcoal/10 bg-white px-10 py-8">
            Privacy and consent
          </div>
        </a>
        <a
          href="/api/auth/logout"
          data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
          data-analytics-action="Logout"
        >
          <div className="my-10 text-center underline">Logout</div>
        </a>
      </div>
    </div>
  );
}

export default withPageAuthRequired(AccountPage, {
  returnTo: "/account",
});
