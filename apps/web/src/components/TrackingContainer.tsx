import { Order } from "@ecommerce/commerce";

import { env } from "~/env";

export default function TrackingContainer({ order }: { order: Order }) {
  return (
    <>
      <script async src={env.NEXT_PUBLIC_ARVATO_TRACKING_SCRIPT} />

      <arvato-track-and-trace-widget
        id="arvato-tracking-widget-iframe"
        data-testid="arvato-tracking-widget"
        country={order.shippingAddress.countryCode}
        orderid={order.orderNumber}
        zipcode={order.shippingAddress.postalCode}
        lang="en"
      />
    </>
  );
}
