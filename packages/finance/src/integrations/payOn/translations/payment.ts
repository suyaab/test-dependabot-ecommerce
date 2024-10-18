import { addressCountryCodeSchema, currencySchema } from "@ecommerce/utils";

import { Payment, paymentSchema, PSP_OPTIONS } from "../../../PaymentGateway";
import { getPaymentMethodBrand, getPaymentMethodType } from "../paymentMethod";
import { PayOnPayment } from "../PayOnPaymentGateway";

export function translatePayOnPayment(paymentStatus: PayOnPayment): Payment {
  return paymentSchema.parse({
    id: paymentStatus.id,
    orderNumber: paymentStatus.merchantTransactionId,
    channel: "ecommerce",
    amount: paymentStatus.amount * 100, // note: amount is represented in cents
    currency: currencySchema.parse(paymentStatus.currency),
    paymentInterface: PSP_OPTIONS.PAYON,
    paymentStatus: {
      interfaceCode: paymentStatus.result.code,
      interfaceText: paymentStatus.result.description,
    },
    // TODO: Can we determine a way to refactor this to use translatePaymentMethod
    paymentMethod: {
      id: paymentStatus.registrationId,
      type: getPaymentMethodType(paymentStatus),
      brand: getPaymentMethodBrand(paymentStatus.paymentBrand),
      billingAddress: {
        firstName: paymentStatus.customer.givenName,
        lastName: paymentStatus.customer.surname,
        addressLine1: paymentStatus.billing.street1,
        addressLine2: paymentStatus.billing.street2,
        city: paymentStatus.billing.city,
        state: paymentStatus.billing.state,
        postalCode: paymentStatus.billing.postcode,
        countryCode: addressCountryCodeSchema.parse(
          paymentStatus.billing.country,
        ),
      },
      card: {
        expiryMonth: paymentStatus.card.expiryMonth,
        expiryYear: paymentStatus.card.expiryYear,
        last4Digits: paymentStatus.card.last4Digits,
      },
    },
  });
}
