import { ReactNode } from "react";
import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

import { ActionAttributes, LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import Footer from "~/components/Footer";
import LingoLogo from "~/icons/LingoLogo";

export async function generateMetadata(): Promise<Metadata> {
  const cms = ServiceLocator.getCMS();
  const metadata = await cms.getMetadata("Checkout");
  return metadata;
}

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Script
        src="/scripts/jquery-3.6.4.slim.min.js"
        type="text/javascript"
        async
      />
      <Script src="https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js" />

      <nav
        data-analytics-location={LocationAttributes.NAVIGATION}
        className="relative lg:bg-white"
      >
        <div className="grid-container h-[var(--navigationHeight)] lg:pl-[var(--sideGapDesktop)]">
          <div className="max-lg:no-r-gap col-span-full flex h-full items-center max-lg:px-2 lg:col-span-7">
            <Link
              href="/"
              data-analytics-action={ActionAttributes.LOGO_CTA}
              data-analytics-location={LocationAttributes.NAVIGATION}
            >
              <LingoLogo className="mt-1 text-white" />
            </Link>
          </div>
          <div className="absolute right-0 z-0 h-full w-5/12 bg-linen-light max-lg:hidden" />
          <div className="no-r-gap relative z-10 col-span-full h-full bg-linen-light max-lg:hidden max-lg:px-6 lg:col-span-5 lg:col-start-8" />
        </div>
      </nav>

      <main data-layout="checkout" className="relative z-0">
        {children}
      </main>

      {/* TODO: add checkout footer */}
      <Footer className="z-0" />
    </>
  );
}
