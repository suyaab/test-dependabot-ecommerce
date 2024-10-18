// PayOn Result Codes: https://arvato.docs.oppwa.com/reference/resultCodes

// REGEX: Result codes for:
// 1. successfully processed transactions (SUCCESS) OR
// 2. successfully processed transactions that should be manually reviewed (SUCCESS_REVIEW)
export const payonSuccessfulTransactionsRegex =
  /^(000.000.|000.100.1|000.[36]|000.400.[1][12]0|000.400.0[^3]|000.400.100)/;

export function isPayonSuccessful(code: string) {
  return payonSuccessfulTransactionsRegex.test(code);
}

// REGEX: Result codes for:
// 1. all pending checkout sessions
export const payonPendingTransactionsRegex = /^(000\.200)/;

export function isCheckoutSessionPending(code: string) {
  return payonPendingTransactionsRegex.test(code);
}
