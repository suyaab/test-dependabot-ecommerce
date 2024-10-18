import { PaymentMethodBrand, PaymentMethodType } from "../../PaymentGateway";
import {
  PayOnPayment,
  PayonPaymentBrand,
  PayOnRegistration,
} from "./PayOnPaymentGateway";

export function getPaymentMethodType(
  paymentStatus: PayOnPayment | PayOnRegistration,
): PaymentMethodType {
  switch (paymentStatus.customParameters.tokenSource as PayonPaymentBrand) {
    case "PAYPAL_CONTINUE":
      return "PAYPAL";
    case "GOOGLEPAY":
      return "GOOGLE_PAY";
    case "APPLEPAY":
      return "APPLE_PAY";
    default:
      return "CREDIT_CARD";
  }
}

export function getPaymentMethodBrand(
  payonBrand: PayonPaymentBrand,
): PaymentMethodBrand {
  switch (payonBrand) {
    case "VISA":
      return "VISA";
    case "MASTER":
      return "MASTERCARD";
    case "AMEX":
      return "AMEX";
    case "PAYPAL_CONTINUE":
      return "PAYPAL";
    case "GOOGLEPAY":
      return "GOOGLE_PAY";
    case "APPLEPAY":
      return "APPLE_PAY";
  }
}
