import { Order } from "@ecommerce/commerce";

export default function BillingSection({
  order,
  content,
}: {
  order: Order;
  content: { title: string };
}) {
  return (
    <div className="mb-16 space-y-4 lg:mb-0">
      <h3 className="subtitle mb-6 font-medium">{content.title}</h3>

      <p>
        {order.billingAddress?.firstName} {order.billingAddress?.lastName}
      </p>
      <p>{order.billingAddress?.addressLine1}</p>
      <p>{order.billingAddress?.addressLine2}</p>
      <p>
        {`${order.billingAddress?.city}, ${order.billingAddress?.state} ${order.billingAddress?.postalCode}`}
      </p>

      <p>{order.billingAddress?.countryCode}</p>
    </div>
  );
}
