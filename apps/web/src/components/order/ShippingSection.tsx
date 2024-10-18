import { Order } from "@ecommerce/commerce";

export default function ShippingSection({
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
        {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
      </p>
      <p>{order.shippingAddress?.addressLine1}</p>
      <p>{order.shippingAddress?.addressLine2}</p>
      <p>
        {`${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.postalCode}`}
      </p>

      <p>{order.shippingAddress?.countryCode}</p>
    </div>
  );
}
