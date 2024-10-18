import { PaymentMethod } from "@ecommerce/finance";

export default function getCreditCardType(paymentMethod: PaymentMethod) {
  switch (paymentMethod.type) {
    case "CREDIT_CARD":
      if (paymentMethod.brand === "VISA") return "VISA";
      if (paymentMethod.brand === "MASTERCARD") return "MC";
      if (paymentMethod.brand === "AMEX") return "AMEX";
      throw new Error(`Invalid Credit Card Brand: ${paymentMethod.brand}`);
    case "PAYPAL":
      return "PAYP";
    case "APPLE_PAY":
      if (paymentMethod.brand === "AMEX") return "APAM";
      return "APPL";
    default:
      throw new Error(
        `Invalid brand ${paymentMethod.brand} for type ${paymentMethod.type}`,
      );
  }
}
