import { Metadata } from "next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator as AuthServiceLocator } from "@ecommerce/auth";
import { ServiceLocator as CmsServiceLocator } from "@ecommerce/cms";
import { ServiceLocator as CommerceServiceLocator } from "@ecommerce/commerce";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { authRegionCheck } from "../helpers";
import OrderBlock from "./OrderBlock";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cms = CmsServiceLocator.getCMS();
  const metadata = await cms.getMetadata("Account");
  return metadata;
}

async function AccountOrdersPage() {
  await authRegionCheck();

  const authService = AuthServiceLocator.getAuthService();
  const customer = await authService.getAuthenticatedCustomer();

  if (customer == null) {
    throw new Error("Unable to find customer for orders page");
  }

  const orderService = CommerceServiceLocator.getOrderService();

  const orders = await orderService.getAllOrders(customer.id);

  return (
    <div className="container">
      <AnalyticsPageTracker page="account-orders" />

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

        <h1 className="my-8 border-b-2 border-b-charcoal/10 pb-6">
          Order History
        </h1>

        {orders.map((order) => (
          <OrderBlock key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

export default withPageAuthRequired(AccountOrdersPage, {
  returnTo: "/account/orders",
});
