import {
  BASE_PATHS,
  COUNTRYCODE_BASEPATH_MAP,
  countryCodeSchema,
  CountryMetadata,
  getCountryName,
  getCountryStatus,
} from "@ecommerce/utils";

import { CookieKey } from "~/app/actions/constants/CookieKey";
import { getCookie } from "~/lib/cookies";

export default function getCountryMetadata(pathName: string): CountryMetadata {
  const xGeoCountry = getCookie(CookieKey.X_GEO_COUNTRY);

  const countryCodeParse = countryCodeSchema.safeParse(xGeoCountry);

  if (!countryCodeParse.success) {
    return {
      countryStatus: "unknown",
    };
  }

  const countryCode = countryCodeParse.data;

  const countryStatus = getCountryStatus(countryCode);

  if (countryStatus == null) {
    return {
      countryStatus: "unknown",
    };
  }

  const basePath = COUNTRYCODE_BASEPATH_MAP.get(countryCode);
  const countryName = getCountryName(countryCode);
  const validPath = validatePath(pathName, basePath);

  return {
    countryCode,
    countryName,
    countryStatus,
    validPath,
  };
}

function validatePath(
  pathName: string,
  basePath: string | undefined | null,
): boolean {
  if (basePath == null) {
    return false;
  }

  // US has no base path, so ensure the path does not start with any other base paths
  if (basePath === "") {
    return !BASE_PATHS.filter((path) => path !== basePath).some((other) =>
      pathName.startsWith(other),
    );
  }

  // otherwise we check if the path starts with the country's base path
  return pathName.startsWith(basePath);
}
