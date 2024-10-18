import { z } from "zod";

import { US_INPUT_LIMITS } from "../form-utils";
import { countryCodeSchema, CountryName } from "./country";
import { stateSchema } from "./state";

export const addressLine1Schema = z
  .string()
  .trim()
  .min(1, "Invalid street address")
  .max(US_INPUT_LIMITS.address, "Invalid street address");

export const addressLine2Schema = z
  .string()
  .max(US_INPUT_LIMITS.addressDetails, "Invalid apartment, suite, etc.")
  .optional();

export const citySchema = z
  .string()
  .trim()
  .min(1, "Invalid city")
  .max(US_INPUT_LIMITS.city, "Invalid city");

// TODO: address scaling issues with other countries/locales
export const postalCodeSchema = z
  .string()
  .regex(/^\d{5}(-\d{4})?$/, "Invalid zipcode");

// For shipping and billing addresses, we must use `XI` for Northern Ireland and `GB` for Great Britain
export const addressCountryCodeSchema = z.union([
  countryCodeSchema,
  z.literal("XI"),
]);
export type AddressCountryCode = z.infer<typeof addressCountryCodeSchema>;

export const addressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  addressLine1: addressLine1Schema,
  addressLine2: addressLine2Schema,
  city: citySchema,
  state: stateSchema,
  postalCode: postalCodeSchema,
  countryCode: addressCountryCodeSchema,
});

export type Address = z.infer<typeof addressSchema>;

// TODO: (gifting) when we add gifting we will make all addresses have name fields
// Then we can remove the omit here from the schema here
export const addressFormSchema = addressSchema
  .omit({
    firstName: true,
    lastName: true,
  })
  .extend({
    state: z.union([stateSchema, z.literal("")]),
  })
  .refine((form) => form.state !== "", {
    path: ["state"],
    message: "State is required",
  });

export type AddressFormData = z.infer<typeof addressFormSchema>;

/**
 * Retrieves the country name based on the provided country code.
 *
 * @param {AddressCountryCode} addressCountryCode - The country code to retrieve the country name for.
 *
 * @return {CountryName} - The country name corresponding to the provided country code.
 *
 * @example
 * ```ts
 * getAddressCountryName("US") === "United States"
 * ```
 */
export function getAddressCountryName(
  addressCountryCode: AddressCountryCode,
): CountryName {
  const COUNTRY_NAME_MAP = new Map<AddressCountryCode, CountryName>([
    ["US", "United States"],
    ["GB", "United Kingdom"],
    ["XI", "United Kingdom"],
  ]);

  const name = COUNTRY_NAME_MAP.get(addressCountryCode);

  if (name == null) {
    throw new Error(`Unable to find Country Name for ${addressCountryCode}`);
  }

  return name;
}

/**
 * A function that takes the name of a country as an argument and returns its corresponding country code.
 *
 * @param {CountryName} addressCountryName - The name of the country.
 * @returns The corresponding country code for the given country name.
 *
 * @warning
 * This function does not provide a 1-1 mapping because of the `XI/GB` -> `United Kingdom` **one-to-many**
 * relationship.  Must use cautiously as to not incorrectly, double convert `XI` to `United Kingdom` to
 * `GB`
 *
 * @example
 * ```ts
 * getAddressCountryCode("United States") === "US"
 * ```
 */
export function getAddressCountryCode(
  addressCountryName: CountryName,
): AddressCountryCode {
  const COUNTRY_CODE_MAP = new Map<CountryName, AddressCountryCode>([
    ["United States", "US"],
    ["United Kingdom", "GB"],
  ]);

  const code = COUNTRY_CODE_MAP.get(addressCountryName);

  if (code == null) {
    throw new Error(`Unable to find Country Code for ${addressCountryName}`);
  }

  return code;
}
