import { z } from "zod";

import { AddressCountryCode } from "../location";

export const currencySchema = z.enum(["USD", "GBP"]);

export type Currency = z.infer<typeof currencySchema>;

export const COUNTRY_CURRENCY_MAP = new Map<AddressCountryCode, Currency>([
  ["US", "USD"],
  ["GB", "GBP"],
  ["XI", "GBP"],
]);

export function formatCurrency(
  currencyCode: string,
  centAmount: number,
  isFractionalDigitsVisible = true,
  locale = "en",
): string {
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: isFractionalDigitsVisible ? 2 : 0,
    maximumFractionDigits: isFractionalDigitsVisible ? 2 : 0,
  });
  return currencyFormatter.format(centAmount / 100);
}
