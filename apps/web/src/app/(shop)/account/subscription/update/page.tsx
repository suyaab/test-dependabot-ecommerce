import { Metadata } from "next";
import { redirect } from "next/navigation";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator as AuthServiceLocator } from "@ecommerce/auth";
import { ServiceLocator as CMSServiceLocator } from "@ecommerce/cms";
import { ServiceLocator as CommerceServiceLocator } from "@ecommerce/commerce";
import logger from "@ecommerce/logger";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { authRegionCheck } from "../../helpers";
import UpdateSubscriptionProducts from "./UpdateSubscriptionProducts";

export async function generateMetadata(): Promise<Metadata> {
  const cms = CMSServiceLocator.getCMS();
  const metadata = await cms.getMetadata("Account");
  return metadata;
}

async function AccountMembershipUpdatePage() {
  await authRegionCheck();

  const authService = AuthServiceLocator.getAuthService();
  const customer = await authService.getAuthenticatedCustomer();

  if (customer?.subscription == null) {
    logger.error("Unable to find customer for account subscription update");
    redirect("/account/subscription");
  }

  const productService = CommerceServiceLocator.getProductService();
  const products = await productService.getProductsByCategory("update");

  const cms = CMSServiceLocator.getCMS();
  const availableSkus = products.map((product) => product.sku);
  const productContent = await cms.getProductCardsContent(availableSkus);

  return (
    <div className="container">
      <AnalyticsPageTracker page="account-subscription-update" />
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
            // TODO: do we add `/update` to breadcrumbs?
          ]}
          analyticsLocationAttribute={LocationAttributes.ACCOUNT_DETAILS}
        />

        <h1 className="my-3">Get more sensors</h1>
        <p className="mb-8">
          Place a new one-time purchase order OR enroll in a new subscription
          that auto-renews
        </p>

        <UpdateSubscriptionProducts
          products={products}
          productContent={productContent}
          customer={customer}
        />
      </div>
    </div>
  );
}

export default withPageAuthRequired(AccountMembershipUpdatePage, {
  returnTo: "/account/subscription/update",
});
