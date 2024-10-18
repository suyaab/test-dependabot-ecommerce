import { SchemaException } from "@ecommerce/utils";

import {
  CheckoutSession,
  checkoutSessionSchema,
  CheckoutSessionStatus,
} from "../../../CheckoutService";
import { PayOnCheckoutSession } from "../PayOnCheckoutService";
import { isCheckoutSessionPending, isPayonSuccessful } from "../statusCodes";

function getPayOnStatus(payonCode: string): CheckoutSessionStatus {
  if (isCheckoutSessionPending(payonCode)) {
    return "pending";
  }

  if (isPayonSuccessful(payonCode)) {
    return "success";
  }

  return "failed";
}

export function translatePayOnCheckoutSession(
  payonCheckoutSession: PayOnCheckoutSession,
): CheckoutSession {
  const parse = checkoutSessionSchema.safeParse({
    id: payonCheckoutSession.id,
    timestamp: new Date(payonCheckoutSession.timestamp).toISOString(),
    amount: payonCheckoutSession.amount,
    currency: payonCheckoutSession.currency,
    status: getPayOnStatus(payonCheckoutSession.result.code),
  });

  if (!parse.success) {
    throw new SchemaException(
      "Unable to translate PayOn Checkout Session",
      parse.error,
    );
  }

  return parse.data;
}
