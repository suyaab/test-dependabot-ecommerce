import { Metadata } from "next";

import { ServiceLocator as CmsServiceLocator } from "@ecommerce/cms";
import { ServiceLocator } from "@ecommerce/commerce";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import ReturnsContainer from "~/components/ReturnsContainer";

export async function generateMetadata(): Promise<Metadata> {
  const cms = CmsServiceLocator.getCMS();
  const metadata = await cms.getMetadata("OrderReturns");
  return metadata;
}

export default async function OrderReturnsPage({
  params,
}: {
  params?: { orderId?: string };
}) {
  const orderId = params?.orderId;

  if (orderId == null) {
    throw new Error("Order Id is required for general returns page");
  }

  const orderService = ServiceLocator.getOrderService();
  const order = await orderService.getOrderById(orderId);

  if (order == null) {
    throw new Error(`Failed to find order ${orderId} for Account Returns page`);
  }

  return (
    <div className="container">
      <AnalyticsPageTracker page="order-returns" />
      <h1 className="my-2">Return your order</h1>
      <ReturnsContainer order={order} />
    </div>
  );
}
