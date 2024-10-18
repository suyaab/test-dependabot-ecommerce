"use client";

import { z } from "zod";

import ErrorAlert from "~/components/ErrorAlert";

const ERROR_MESSAGES = {
  PaymentFailed: "There was an error processing your payment.",
  InvalidCountry:
    "Unfortunately we are unable to ship to this region at this time.",
  InvalidEmail:
    "It looks like you may already have an account, please log in to your account to make a purchase.",
  Unrecoverable:
    "We are sorry. An unexpected error has occurred, please reach out to customer service.",
  Unknown:
    "We’re sorry. An unexpected error has occurred, please try again. If error continues, please reach out to our customer service team via chat or phone.",
};

const checkoutErrorSchema = z.union([
  z.literal("PaymentFailed"),
  z.literal("InvalidCountry"),
  z.literal("InvalidEmail"),
  z.literal("PaymentFailed"),
  z.literal("Unrecoverable"),
  z.literal("Unknown"),
]);

export type CheckoutError = z.infer<typeof checkoutErrorSchema>;

function getErrorType(error?: string): CheckoutError {
  const errorParse = checkoutErrorSchema.safeParse(error);

  if (errorParse.success) {
    return errorParse.data;
  }

  return "Unknown";
}

export default function CheckoutErrorBlock({ error }: { error: string }) {
  const errorType = getErrorType(error);

  const message = ERROR_MESSAGES[errorType];

  return <ErrorAlert message={message} />;
}
