"use server";

import { headers } from "next/headers";

import { CountryGateContent, ServiceLocator } from "@ecommerce/cms";
import { getLogger } from "@ecommerce/logger";
import { CountryMetadata } from "@ecommerce/utils";

export async function getCountryGateContent(
  meta: CountryMetadata,
): Promise<CountryGateContent | null> {
  const logger = getLogger({
    prefix: "web:actions:getCountryGateContent",
    headers: headers(),
  });

  if (meta.countryStatus === "unknown" || meta.countryCode == null) {
    return null;
  }

  try {
    const cms = ServiceLocator.getCMS();

    switch (meta.countryStatus) {
      case "unsupported":
        return await cms.getCountryGateDialogContent();
      case "shipping":
        return await cms.getCountryGateRedirectDialogContent(meta.countryCode);
      case "coming-soon":
        return await cms.getCountryGateSignupDialogContent();
      default:
        return null;
    }
  } catch (error) {
    logger.error(error, `Failed to get CMS content for ${meta.countryCode}:`);

    return null;
  }
}
