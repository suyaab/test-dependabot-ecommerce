import { Order } from "@ecommerce/commerce";

import { env } from "~/env";

export default function ReturnsContainer({ order }: { order: Order }) {
  return (
    <>
      <script async src={env.NEXT_PUBLIC_ARVATO_RETURN_SCRIPT} />

      <arvato-returns-widget
        key="/order/returns"
        id="arvato-return-widget-iframe"
        data-testid="arvato-return-widget"
        lang="en" // TODO: revaluate for multi-language
        country={order.shippingAddress.countryCode}
        orderid={order.orderNumber} // `orderid` prop needs to be the OrderNumber
        zipcode={order.shippingAddress.postalCode}
        email={order.customerEmail}
      />
    </>
  );
}
