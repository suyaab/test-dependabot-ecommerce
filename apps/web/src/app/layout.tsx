import { ReactNode } from "react";
import localFont from "next/font/local";
import ReactDOM from "react-dom";

// import newrelic from "newrelic";

import commonMetadata from "./metadata";
import commonViewport from "./viewport";

import "~/app/style/global.css";

import Script from "next/script";

import GoogleTagManager from "~/components/analytics/GoogleTagManager";
import { CountryGate } from "~/components/CountryGate";
import PromoBar from "~/components/PromoBar";
import { ToastProvider } from "~/components/Toast";
import { env } from "~/env";
import { BrazeSDKProvider, BrazeSDKServiceConfig } from "~/lib/braze-web-sdk";
import { FeatureFlagProvider } from "~/lib/feature-flags/client";
import { getFeatureFlag } from "~/lib/feature-flags/server";

export const metadata = commonMetadata;
export const viewport = commonViewport;

// @font-face rules
const MatterLight = localFont({
  src: "../../public/fonts/Matter-Light.woff2",
  weight: "300",
  variable: "--font-matter-light",
});
const MatterRegular = localFont({
  src: "../../public/fonts/Matter-Regular.woff2",
  weight: "400",
  variable: "--font-matter-regular",
});
const MatterMedium = localFont({
  src: "../../public/fonts/Matter-Medium.woff2",
  weight: "500",
  variable: "--font-matter-medium",
});
const MatterSemibold = localFont({
  src: "../../public/fonts/Matter-SemiBold.woff2",
  weight: "600",
  variable: "--font-matter-semibold",
});

const Matter = `${MatterLight.variable} ${MatterRegular.variable} ${MatterMedium.variable} ${MatterSemibold.variable}`;

const brazeSDKConfig = {
  LINGO_ENV: env.LINGO_ENV,
  BRAZE_WEB_KEY: env.BRAZE_WEB_KEY,
  BRAZE_SDK_URL: env.BRAZE_SDK_URL,
  BRAZE_SUBSCRIPTION_SPECIAL_OFFERS: env.BRAZE_SUBSCRIPTION_SPECIAL_OFFERS,
  BRAZE_SUBSCRIPTION_NEWS_CONTENT: env.BRAZE_SUBSCRIPTION_NEWS_CONTENT,
  BRAZE_SUBSCRIPTION_PRODUCT_UPDATES: env.BRAZE_SUBSCRIPTION_PRODUCT_UPDATES,
} as BrazeSDKServiceConfig;

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  ReactDOM.prefetchDNS("//cdn.decibelinsight.net");
  ReactDOM.prefetchDNS("//collection.decibelinsight.net");
  // TODO: if we want to use newrelic performance timing
  // const browserTimingHeader = newrelic.getBrowserTimingHeader({
  //   hasToRemoveScriptWrapper: true,
  //   allowTransactionlessInjection: true,
  // });

  const showZendeskChatbot = await getFeatureFlag("DTC_ZendeskChatbot");

  return (
    <html
      lang="en"
      className={Matter}
      data-instance-id={env.WEBSITE_INSTANCE_ID?.slice(0, 9) ?? "n/a"}
      data-commit={env.GIT_SHA?.slice(0, 9) ?? "n/a"}
    >
      {/*<head>*/}
      {/*<Script id="nr" strategy="beforeInteractive">*/}
      {/*  {browserTimingHeader}*/}
      {/*</Script>*/}
      {/*</head>*/}

      <body className="bg-linen-light">
        <GoogleTagManager />

        {/* TrustArc Notice */}
        <div id="consent-banner" />

        <FeatureFlagProvider>
          <BrazeSDKProvider brazeSDKConfig={brazeSDKConfig}>
            <ToastProvider>
              <PromoBar />
              {children}
              <CountryGate />
            </ToastProvider>
            {showZendeskChatbot && (
              <Script
                id="ze-snippet"
                strategy="lazyOnload"
                src="https://static.zdassets.com/ekr/snippet.js?key=2bf1510d-4e4d-4c68-9059-905be531f346"
              />
            )}
          </BrazeSDKProvider>

          {/* TrustArc Auto Block */}
          <Script
            src="https://consent.trustarc.com/v2/autoblockasset/core.min.js?cmId=33ntft"
            strategy="beforeInteractive"
          />
          <Script
            src="https://consent.trustarc.com/v2/autoblock?cmId=33ntft"
            strategy="beforeInteractive"
          />

          {/* New Relic */}
          <Script
            id="newRelic"
            src="/scripts/new-relic.js"
            strategy="beforeInteractive"
          />
          <Script
            id="decibel"
            src="/scripts/decibelInsight.js"
            strategy="beforeInteractive"
          />

          {/* TrustArc Consent Banner */}
          <Script src="https://consent.trustarc.com/v2/notice/33ntft?pcookie" />

          {/* Adobe Analytics */}
          <Script src={env.ADOBE_DTM_SCRIPT} async />

          <Script src="/scripts/googleTagManager/google-tag.js" />
        </FeatureFlagProvider>
      </body>
    </html>
  );
}
