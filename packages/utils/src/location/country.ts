import { z } from "zod";

import zodEnum from "../zod/toEnum";
import COUNTRY_CODE_MAP from "./countryCodeMap";

/**
 * COUNTRY NAMES
 */
export const countryNameSchema = z.enum(
  zodEnum(Object.values(COUNTRY_CODE_MAP)),
);
export type CountryName = z.infer<typeof countryNameSchema>;

export function getCountryName(countryCode: CountryCode): CountryName {
  return COUNTRY_CODE_MAP[countryCode];
}

/**
 * COUNTRY CODES
 */
export const countryCodeSchema = z.enum(
  zodEnum(Object.keys(COUNTRY_CODE_MAP) as (keyof typeof COUNTRY_CODE_MAP)[]),
);
export type CountryCode = z.infer<typeof countryCodeSchema>;

/**
 * COUNTRY PATH MAPS
 */
export const BASE_PATHS = ["", "/uk"] as const;

export const countryBasePathSchema = z.enum(BASE_PATHS);
export type CountryBasePath = z.infer<typeof countryBasePathSchema>;

export const COUNTRYCODE_BASEPATH_MAP = new Map<CountryCode, CountryBasePath>([
  ["US", ""],
  ["PR", ""],
  ["GB", "/uk"],
]);

/**
 * COUNTRY STATUS
 */
export const countryStatusSchema = z.union([
  z.literal("shipping"),
  z.literal("coming-soon"),
  z.literal("unsupported"),
  z.literal("unknown"),
]);
export type CountryStatus = z.infer<typeof countryStatusSchema>;

export function getCountryStatus(countryCode: CountryCode): CountryStatus {
  const COUNTRY_CODE_STATUS_MAP = new Map<CountryCode, CountryStatus>([
    ["US", "shipping"],
    ["PR", "shipping"],
    ["GB", "shipping"],
  ]);

  const status = COUNTRY_CODE_STATUS_MAP.get(countryCode);

  if (status == null) {
    return "unsupported";
  }

  return status;
}

/**
 * COUNTRY META INFORMATION
 */
export const UnknownCountryMetadataSchema = z.object({
  countryStatus: z.literal("unknown"),
});

export const ValidCountryMetadataSchema = z.object({
  countryCode: countryCodeSchema,
  countryName: countryNameSchema,
  countryStatus: countryStatusSchema,
  validPath: z.boolean(),
});

export const CountryMetaSchema = z.union([
  UnknownCountryMetadataSchema,
  ValidCountryMetadataSchema,
]);

export type CountryMetadata = z.infer<typeof CountryMetaSchema>;
