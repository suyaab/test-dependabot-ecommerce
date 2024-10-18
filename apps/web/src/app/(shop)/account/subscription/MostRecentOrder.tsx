import { LocationAttributes } from "@ecommerce/analytics";
import { Customer, ServiceLocator } from "@ecommerce/commerce";

import OrderBlock from "../orders/OrderBlock";

export default async function MostRecentOrder({
  customer,
}: {
  customer: Customer;
}) {
  const orderService = ServiceLocator.getOrderService();

  const order = await orderService.getMostRecentOrder(customer.id);

  return (
    <>
      <div className="mt-16 flex items-center justify-between">
        <h3 className="headline">Most recent order</h3>
        <a
          href="/account/orders"
          className="underline"
          data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
          data-analytics-action="See all orders"
        >
          See all orders
        </a>
      </div>

      {order != null && <OrderBlock order={order} />}
    </>
  );
}
