import { Metadata } from "next";
import Link from "next/link";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/auth";
import { ServiceLocator as CmsServiceLocator } from "@ecommerce/cms";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import ChevronDown from "~/icons/ChevronDown";
import { authRegionCheck } from "../helpers";
import ShippingAddressForm from "./ShippingAddressForm";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cms = CmsServiceLocator.getCMS();
  const metadata = await cms.getMetadata("Account");
  return metadata;
}

async function AccountShippingPage({
  searchParams,
}: {
  searchParams?: { returnTo?: string };
}) {
  await authRegionCheck();

  const authService = ServiceLocator.getAuthService();
  const customer = await authService.getAuthenticatedCustomer();

  if (customer == null) {
    throw new Error("Unable to find customer shipping address to update");
  }
  const returnTo = searchParams?.returnTo;
  return (
    <div className="container">
      <AnalyticsPageTracker page="account-shipping-address" />

      <div className="my-8 mb-20">
        {returnTo == null && (
          <Breadcrumbs
            links={[
              {
                text: "Account",
                url: "/account",
              },
              {
                text: "Shipping address",
                url: "/account/shipping-address",
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
        <h1 className="my-8 border-b-2 border-b-charcoal/10 pb-6">
          Edit Shipping Address
        </h1>

        <ShippingAddressForm customer={customer} />

        <p className="text-charcoal/60">
          Your next order will ship to your updated address.
        </p>
      </div>
    </div>
  );
}

export default withPageAuthRequired(AccountShippingPage, {
  returnTo: "/account/shipping-address",
});
