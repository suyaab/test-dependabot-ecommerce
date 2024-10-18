"use client";

import "@ecommerce/utils";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { CountryGateContent } from "@ecommerce/cms";

import CountryGateDialog from "~/components/CountryGateDialog";
import CountryGateRedirectDialog from "~/components/CountryGateRedirectDialog";
import CountryGateSignupDialog from "~/components/CountryGateSignupDialog";
import { CookieKey } from "~/app/actions/constants/CookieKey";
import { getCountryGateContent } from "~/app/actions/getCountryGateContent";
import { getCookie } from "~/lib/cookies";
import getCountryMetadata from "~/lib/country/getCountryMetadata";

export function CountryGate() {
  const pathName = usePathname(); // TODO: we could make `getCountryMetadata` back into a hook and move `usePathname` inside `useCountryMetadata`
  const metadata = getCountryMetadata(pathName);
  const [cmsContent, setCmsContent] = useState<CountryGateContent | null>(null);

  useEffect(() => {
    const setContent = async () => {
      if (metadata.countryStatus === "unknown") {
        return;
      }

      if (metadata.validPath) {
        return;
      }

      const cmsContent = await getCountryGateContent(metadata);
      setCmsContent(cmsContent);
    };

    void setContent();
  }, [metadata.countryStatus]);

  if (metadata.countryStatus === "unknown" || cmsContent == null) {
    return null;
  }

  if (
    metadata.countryStatus === "unsupported" &&
    cmsContent.type === "unsupported"
  ) {
    return <CountryGateDialog autoOpen={true} content={cmsContent} />;
  }

  if (
    metadata.countryStatus === "shipping" &&
    cmsContent.type === "redirect" &&
    !metadata.validPath
  ) {
    const hasClosedCountryGateModal =
      getCookie(CookieKey.COUNTRY_GATE_CLOSED) === "true";

    return (
      <CountryGateRedirectDialog
        autoOpen={!hasClosedCountryGateModal}
        content={cmsContent}
        countryName={metadata.countryName}
      />
    );
  }

  if (
    metadata.countryStatus === "coming-soon" &&
    cmsContent.type === "signup"
  ) {
    const hasSignedUpInCountryGateModal =
      getCookie(CookieKey.COUNTRY_GATE_SIGNED_UP) === "true";

    if (hasSignedUpInCountryGateModal) {
      return null;
    }
    return <CountryGateSignupDialog autoOpen={true} content={cmsContent} />;
  }

  return null;
}
