import { addressCountryCodeSchema, stateSchema } from "@ecommerce/utils";

import { PaymentMethod } from "../../../PaymentGateway";
import { getPaymentMethodBrand, getPaymentMethodType } from "../paymentMethod";
import { PayOnRegistration } from "../PayOnPaymentGateway";

export function translatePayOnPaymentMethod(
  paymentMethod: PayOnRegistration,
): PaymentMethod {
  return {
    id: paymentMethod.id,
    type: getPaymentMethodType(paymentMethod),
    brand: getPaymentMethodBrand(paymentMethod.paymentBrand),
    billingAddress: {
      firstName: paymentMethod.customer.givenName,
      lastName: paymentMethod.customer.surname,
      addressLine1: paymentMethod.billing.street1,
      addressLine2: paymentMethod.billing.street2,
      city: paymentMethod.billing.city,
      state: stateSchema.parse(paymentMethod.billing.state),
      postalCode: paymentMethod.billing.postcode,
      countryCode: addressCountryCodeSchema.parse(
        paymentMethod.billing.country,
      ),
    },
    card: {
      expiryMonth: paymentMethod.card.expiryMonth,
      expiryYear: paymentMethod.card.expiryYear,
      last4Digits: paymentMethod.card.last4Digits,
    },
  };
}
