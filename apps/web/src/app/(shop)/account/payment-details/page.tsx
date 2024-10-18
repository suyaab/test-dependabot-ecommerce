import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator as AuthServiceLocator } from "@ecommerce/auth";
import { ServiceLocator as CmsServiceLocator } from "@ecommerce/cms";
import { ServiceLocator as CommerceServiceLocator } from "@ecommerce/commerce";
import { ServiceLocator as PaymentServiceLocator } from "@ecommerce/finance";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { env } from "~/env";
import ChevronDown from "~/icons/ChevronDown";
import { authRegionCheck } from "../helpers";
import EditPaymentLayout from "./EditPaymentLayout";
import PaymentDetails from "./PaymentDetails";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cms = CmsServiceLocator.getCMS();
  const metadata = await cms.getMetadata("Account");
  return metadata;
}

async function AccountPaymentPage({
  searchParams,
}: {
  searchParams?: { error?: string; returnTo?: string };
}) {
  await authRegionCheck();

  const authService = AuthServiceLocator.getAuthService();
  const customer = await authService.getAuthenticatedCustomer();

  if (customer == null) {
    throw new Error("Unable to find customer for account management");
  }

  const checkoutService = PaymentServiceLocator.getCheckoutService();
  const paymentGateway = PaymentServiceLocator.getPaymentGateway();

  let paymentMethod;
  if (customer.subscription?.paymentMethodId != null) {
    paymentMethod = await paymentGateway.getSavedPaymentMethod(
      customer.subscription.paymentMethodId,
    );
  }
  const orderService = CommerceServiceLocator.getOrderService();
  const orderNumber = orderService.generateOrderNumber();
  const checkoutSession = await checkoutService.createCheckoutSession(
    orderNumber,
    1.0,
    "USD", // TODO: make the currency based on locale
  );
  const returnTo = searchParams?.returnTo;
  return (
    <div className="container mb-16">
      <AnalyticsPageTracker page="account-payment-details" />

      <div className="my-8">
        {returnTo == null && (
          <Breadcrumbs
            links={[
              {
                text: "Account",
                url: "/account",
              },
              {
                text: "Payment details",
                url: "/account/payment-details",
              },
            ]}
            analyticsLocationAttribute={LocationAttributes.ACCOUNT_DETAILS}
          />
        )}
        {returnTo != null && (
          <div className="flex items-center">
            <Link href={returnTo} className="flex">
              <ChevronDown color="black" className="size-8 rotate-90" />
              <p className="ml-6 text-lg">Back to Order Summary</p>
            </Link>
          </div>
        )}
        <Script
          src="/scripts/jquery-3.6.4.slim.min.js"
          type="text/javascript"
        />

        <Script
          src={`${env.PAYON_API_URL}/paymentWidgets.js?checkoutId=${checkoutSession.id}`}
        />

        <EditPaymentLayout
          customer={customer}
          checkoutSession={checkoutSession}
          returnTo={returnTo}
        >
          <PaymentDetails customer={customer} paymentMethod={paymentMethod} />
        </EditPaymentLayout>

        {searchParams?.error != null && (
          <div className="mt-12 flex items-center justify-center">
            <p className="text-red">
              Unable to update payment details, please try again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default withPageAuthRequired(AccountPaymentPage, {
  returnTo: "/account/payment-details",
});
