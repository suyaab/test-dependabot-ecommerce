import { Metadata } from "next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator as AuthServiceLocator } from "@ecommerce/auth";
import { ServiceLocator as CmsServiceLocator } from "@ecommerce/cms";
import { ServiceLocator as ConsentServiceLocator } from "@ecommerce/consent";
import { getLogger } from "@ecommerce/logger";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import Hyperlink from "~/components/Hyperlink";
import { env } from "~/env";
import { authRegionCheck } from "../helpers";

function getSupportRequestUrl() {
  switch (env.LINGO_ENV) {
    case "dev":
    case "qa":
    case "stg":
      return "https://support-us-dev.hellolingo.com/hc/en-us/requests/new";

    case "prod":
    default:
      return "https://support-us.hellolingo.com/hc/en-us/requests/new";
  }
}

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cms = CmsServiceLocator.getCMS();
  const metadata = await cms.getMetadata("Account");
  return metadata;
}

async function AccountPrivacyPage() {
  await authRegionCheck();

  const logger = getLogger({ prefix: "web:account:privacy" });

  const authService = AuthServiceLocator.getAuthService();
  const customer = await authService.getAuthenticatedCustomer();

  if (customer == null) {
    logger.error("Unable to find customer in privacy portal page");
    throw new Error("Unable to find customer in privacy portal page");
  }

  const consentManager = ConsentServiceLocator.getConsentManager();
  const consents = await consentManager.getConsents(customer.externalId);

  const encodedPortalToken = encodeURIComponent(consents.portalToken);
  const portalUrl = `${env.ONETRUST_PRIVACY_URL}/ui/#/preferences/multipage/token/${env.ONETRUST_PRIVACY_PORTAL_ID}/${encodedPortalToken}`;

  const supportRequestUrl = getSupportRequestUrl();

  return (
    <div className="container">
      <AnalyticsPageTracker page="account-privacy" />
      <div className="my-8 mb-20">
        <Breadcrumbs
          links={[
            {
              text: "Account",
              url: "/account",
            },
            {
              text: "Privacy and consent",
              url: "/account/privacy",
            },
          ]}
          analyticsLocationAttribute={LocationAttributes.ACCOUNT_DETAILS}
        />

        <h1 className="my-8 border-b-2 border-b-charcoal/10 pb-6">
          Your Lingo Privacy and Consent Portal
        </h1>

        <div className="m-auto mb-8 h-[800px]">
          <iframe
            className="bg-primary h-full w-full border-none"
            src={portalUrl}
          ></iframe>
        </div>

        <p className="headline mb-4 mt-8">Legal Documents</p>

        <div className="flex gap-6">
          <Hyperlink
            variant="outline"
            url="/privacy-notice"
            text="Privacy Notice"
            analyticsLocationAttribute={LocationAttributes.ACCOUNT_DETAILS}
            analyticsActionAttribute="Privacy Notice"
          />
          <Hyperlink
            variant="outline"
            url="/eula"
            text="EULA"
            analyticsLocationAttribute={LocationAttributes.ACCOUNT_DETAILS}
            analyticsActionAttribute="EULA"
          />
          <Hyperlink
            variant="outline"
            url="/terms-of-sale"
            text="Terms of Sale"
            analyticsLocationAttribute={LocationAttributes.ACCOUNT_DETAILS}
            analyticsActionAttribute="Terms of Sale"
          />
        </div>

        <p className="headline mb-4 mt-8">Data management</p>
        <div className="flex gap-6">
          <Hyperlink
            variant="outline"
            text="Request data"
            url={supportRequestUrl}
            analyticsLocationAttribute={LocationAttributes.ACCOUNT_DETAILS}
            analyticsActionAttribute="Request data"
          />
          <Hyperlink
            variant="outline"
            text="Delete data"
            url={supportRequestUrl}
            analyticsLocationAttribute={LocationAttributes.ACCOUNT_DETAILS}
            analyticsActionAttribute="Delete data"
          />
          <Hyperlink
            variant="outline"
            url={supportRequestUrl}
            text="Delete account"
            analyticsLocationAttribute={LocationAttributes.ACCOUNT_DETAILS}
            analyticsActionAttribute="Delete account"
          />
        </div>
      </div>
    </div>
  );
}

export default withPageAuthRequired(AccountPrivacyPage, {
  returnTo: "/account/privacy",
});
