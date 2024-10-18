import { OrderStatusCode } from "@ecommerce/commerce";

/**
 * Matches the corresponding statusMessage to the OrderStatus
 * @param statusMessage - the status message from the order.
 * @returns {OrderStatusCode} - the corresponding order status for the provided status message.
 */
export default function getOrderStatus(statusMessage: string): OrderStatusCode {
  switch (statusMessage) {
    case "Created - On Hold":
      return "Confirmed";

    case "Created":
      return "Confirmed";

    case "Created - Denied Party":
      return "Cancelled";

    case "In Preparation":
      return "Confirmed";

    case "Cancelled":
      return "Cancelled";

    case "Refund Initiated":
      return "Complete";

    default:
      return "Confirmed";
  }
}
