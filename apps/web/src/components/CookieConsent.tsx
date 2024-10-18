"use client";

import { useEffect } from "react";

export default function CookieConsent() {
  useEffect(() => {
    if (window?.truste?.eu != null) {
      window.truste.eu.init();
    }
  });

  return (
    <div id="cookieLink" data-testid="cookieConsent">
      <p
        id="teconsent"
        data-analytics-action="Cookie Policy"
        className="underline-offset-4 hover:underline"
      />
    </div>
  );
}
