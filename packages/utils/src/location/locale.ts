import { z } from "zod";

import { AddressCountryCode } from "./address";

export const localeSchema = z.enum(["en", "en-GB"]);
export type Locale = z.infer<typeof localeSchema>;

export function getLocale(countryCode: AddressCountryCode): Locale {
  const COUNTRY_LOCALE_MAP = new Map<AddressCountryCode, Locale>([
    ["US", "en"],
    ["GB", "en-GB"],
  ]);

  const locale = COUNTRY_LOCALE_MAP.get(countryCode);

  if (locale == null) {
    // default to the US if country code doesn't match a locale
    return "en";
  }

  return locale;
}
