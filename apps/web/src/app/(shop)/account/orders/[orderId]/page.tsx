import { Metadata } from "next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator as CMSServiceLocator } from "@ecommerce/cms";
import { ServiceLocator } from "@ecommerce/commerce";
import { formatCurrency } from "@ecommerce/utils";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import BillingSection from "~/components/order/BillingSection";
import PaymentSection from "~/components/order/PaymentSection";
import ShippingSection from "~/components/order/ShippingSection";
import TrackingContainer from "~/components/TrackingContainer";
import { authRegionCheck } from "../../helpers";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cms = CMSServiceLocator.getCMS();
  return await cms.getMetadata("Account");
}

async function AccountOrdersPage({
  params,
}: {
  params?: { orderId?: string };
}) {
  await authRegionCheck();

  const orderId = params?.orderId;
  if (orderId == null) {
    throw new Error("Order Id is required for account returns page");
  }

  const orderService = ServiceLocator.getOrderService();

  const order = await orderService.getOrderById(orderId);

  if (order == null) {
    throw new Error(`Unable to find order details ${orderId}`);
  }

  const cms = CMSServiceLocator.getCMS();
  const orderConfirmationContent = await cms.getOrderConfirmationContent();

  return (
    <div className="container">
      <AnalyticsPageTracker page="account-order" />
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

        <h2 className="my-4">Order Details</h2>
        <hr className="my-4 border-linen" />

        {/* Order number row */}
        <div className="my-4 flex justify-between">
          <p>Order number</p>
          <p>{order.orderNumber}</p>
        </div>

        {/* Placed On row */}
        <div className="my-4 flex justify-between">
          <p>Placed on</p>
          <p>{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Total Price Amount row */}
        <div className="my-4 flex justify-between">
          <p>Amount</p>
          <p>{formatCurrency(order.currencyCode, order.totalNet)}</p>
        </div>

        {/* Order number row */}
        <div className="my-4 flex justify-between">
          <p>Status</p>
          <p>{order.status}</p>
        </div>

        <hr className="my-4 border-linen" />

        <TrackingContainer order={order} />

        <div className="mt-14 grid-cols-3 gap-36 lg:grid">
          <PaymentSection
            order={order}
            content={orderConfirmationContent.payment}
          />
          <ShippingSection
            content={orderConfirmationContent.shipping}
            order={order}
          />
          <BillingSection
            order={order}
            content={orderConfirmationContent.billing}
          />
        </div>
      </div>
    </div>
  );
}

// TODO: we can go one step further and redirect them to the orderId page
export default withPageAuthRequired(AccountOrdersPage, {
  returnTo: "/account/orders",
});
