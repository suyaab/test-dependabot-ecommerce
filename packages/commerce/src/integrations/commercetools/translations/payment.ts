import { Payment as CTPayment } from "@commercetools/platform-sdk";

import { SchemaException } from "@ecommerce/utils";

import {
  paymentChannelSchema,
  PaymentMethod,
  PaymentReference,
  paymentReferenceSchema,
  PaymentStatus,
} from "../../../Payment";

export function translatePaymentReference(
  ctPayment: CTPayment,
): PaymentReference {
  const parse = paymentReferenceSchema.safeParse({
    id: ctPayment.id,
    version: ctPayment.version,
    interfaceId: ctPayment.interfaceId,
    channel: paymentChannelSchema.parse(ctPayment.custom?.fields?.channel),
    paymentInterface: ctPayment.paymentMethodInfo.paymentInterface,
    paymentMethod: ctPayment.paymentMethodInfo.method as PaymentMethod,
    paymentStatus:
      ctPayment?.paymentStatus?.interfaceCode != null &&
      ctPayment?.paymentStatus?.interfaceText != null
        ? (ctPayment.paymentStatus as PaymentStatus)
        : undefined,
    amount: ctPayment.amountPlanned.centAmount,
    currency: ctPayment.amountPlanned.currencyCode,
  });

  if (!parse.success) {
    throw new SchemaException(
      "Failed to translate CTPayment to Payment Reference",
      parse.error,
    );
  }

  return parse.data;
}
