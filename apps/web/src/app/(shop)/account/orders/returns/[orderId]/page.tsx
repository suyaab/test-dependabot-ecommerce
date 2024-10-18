import { Metadata } from "next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator as CmsServiceLocator } from "@ecommerce/cms";
import { ServiceLocator } from "@ecommerce/commerce";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import ReturnsContainer from "~/components/ReturnsContainer";
import { authRegionCheck } from "../../../helpers";

export async function generateMetadata(): Promise<Metadata> {
  const cms = CmsServiceLocator.getCMS();
  const metadata = await cms.getMetadata("Account");
  return metadata;
}

async function AccountReturnsPage({
  params,
}: {
  params?: { orderId?: string };
}) {
  await authRegionCheck();
  const orderId = params?.orderId;

  if (orderId == null) {
    throw new Error("Order Id is required for Account Order Return page");
  }

  const orderService = ServiceLocator.getOrderService();
  const order = await orderService.getOrderById(orderId);

  if (order == null) {
    throw new Error(
      `Failed to find order ${orderId} for Account Order Returns page`,
    );
  }

  return (
    <div className="container">
      <AnalyticsPageTracker page="account-orders-returns" />
      <div className="my-8 mb-20">
        <Breadcrumbs
          links={[
            {
              text: "Account",
              url: "/account",
            },
            {
              text: "Orders",
              url: "/account/orders",
            },
          ]}
          analyticsLocationAttribute={LocationAttributes.ACCOUNT_DETAILS}
        />

        <h2 className="my-4">Return your order</h2>
        <hr className="my-4 border-linen" />

        <ReturnsContainer order={order} />
      </div>
    </div>
  );
}

export default withPageAuthRequired(AccountReturnsPage, {
  returnTo: "/account/orders",
});
