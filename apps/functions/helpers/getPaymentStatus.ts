import { PaymentStatusCode } from "@ecommerce/commerce";

/**
 * Returns the corresponding PaymentStateType based on the provided statusCode.
 *
 * @param {string} statusCode - The status code of the payment.
 * @returns {PaymentStatusCode} - The corresponding PaymentStateType.
 */
export default function getPaymentStatus(
  statusCode: string,
): PaymentStatusCode {
  switch (statusCode) {
    case "100":
      return "Paid";

    case "200":
      return "Pending";

    case "400":
      return "BalanceDue";

    case "500":
      return "CreditOwed";

    default:
      return "Pending";
  }
}
