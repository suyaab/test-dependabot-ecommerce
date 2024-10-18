import { Metadata } from "next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/auth";
import { ServiceLocator as CmsServiceLocator } from "@ecommerce/cms";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { authRegionCheck } from "../helpers";
import UserInfoForm from "./UserInfoForm";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cms = CmsServiceLocator.getCMS();
  const metadata = await cms.getMetadata("Account");
  return metadata;
}

async function AccountInfoPage() {
  await authRegionCheck();

  const authService = ServiceLocator.getAuthService();
  const customer = await authService.getAuthenticatedCustomer();

  if (customer == null) {
    throw new Error("Unable to find customer");
  }

  return (
    <div className="container">
      <AnalyticsPageTracker page="account-info" />
      <div className="my-8 mb-20">
        <Breadcrumbs
          links={[
            {
              text: "Account",
              url: "/account",
            },
            {
              text: "Info",
              url: "/account/info",
            },
          ]}
          analyticsLocationAttribute={LocationAttributes.ACCOUNT_DETAILS}
        />

        <h1 className="mb-12 mt-8 border-b-2 border-b-charcoal/10 pb-6">
          Edit Account Information
        </h1>

        <UserInfoForm customer={customer} />
      </div>
    </div>
  );
}

export default withPageAuthRequired(AccountInfoPage, {
  returnTo: "/account/info",
});
