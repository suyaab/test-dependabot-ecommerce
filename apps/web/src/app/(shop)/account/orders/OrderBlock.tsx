import Link from "next/link";

import { LocationAttributes } from "@ecommerce/analytics";
import { Order } from "@ecommerce/commerce";

// TODO: what should this be called lol
export default function OrderBlock({ order }: { order: Order }) {
  return (
    <div className="my-4 rounded-2xl border-2 border-b-charcoal/10 bg-white px-10 py-8">
      <div className="p-2">
        <div className="my-4">
          <h4 className="headline">{order?.lineItems[0]?.name ?? ""}</h4>
          <h6 className="my-4">{order?.orderNumber}</h6>
        </div>

        <div className="flex gap-6">
          {/* Order Details Link Row */}
          <Link
            href={`/account/orders/${order.id}`}
            className="button-dark flex justify-between py-4"
            data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
            data-analytics-action="Order details"
          >
            Order details
          </Link>

          {/* Return Order Link Row */}
          <Link
            href={`/account/orders/returns/${order.id}`}
            className="button-outline flex justify-between py-4"
            data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
            data-analytics-action="Return order"
          >
            Return order
          </Link>
        </div>
      </div>
    </div>
  );
}
