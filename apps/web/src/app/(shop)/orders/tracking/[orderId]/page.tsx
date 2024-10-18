import { Metadata } from "next";

import { ServiceLocator as CmsServiceLocator } from "@ecommerce/cms";
import { ServiceLocator } from "@ecommerce/commerce";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import TrackingContainer from "~/components/TrackingContainer";

export async function generateMetadata(): Promise<Metadata> {
  const cms = CmsServiceLocator.getCMS();
  const metadata = await cms.getMetadata("OrderTracking");
  return metadata;
}

export default async function OrderTrackingPage({
  params,
}: {
  params?: { orderId?: string };
}) {
  const orderId = params?.orderId;

  if (orderId == null) {
    throw new Error("Order Id is required for Order Tracking page");
  }

  const orderService = ServiceLocator.getOrderService();
  const order = await orderService.getOrderById(orderId);

  if (order == null) {
    throw new Error(`Failed to find order ${orderId} for Order Tracking page`);
  }

  return (
    <div className="container">
      <AnalyticsPageTracker page="order-tracking" />
      <h1 className="my-2">Track your order</h1>

      <TrackingContainer order={order} />
    </div>
  );
}
