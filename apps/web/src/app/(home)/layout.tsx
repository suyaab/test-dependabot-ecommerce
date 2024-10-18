import { ReactNode } from "react";

import { ServiceLocator } from "@ecommerce/cms";

import Footer from "~/components/Footer";
import Navigation from "~/components/Navigation";
import VeevaNumber from "~/components/VeevaNumber";
import { getFeatureFlag } from "~/lib/feature-flags/server";

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const cms = ServiceLocator.getCMS();

  const { items: menuItems, button } = await cms.getNavContent();
  const emailCollectionModalContent =
    await cms.getPreLaunchEmailsCollectionModalContent();

  const isUsEcommerceEnabled = await getFeatureFlag("DTC_US_EcommerceRelease");

  return (
    <>
      <Navigation
        items={menuItems}
        emailCollectionModalContent={emailCollectionModalContent}
        button={button}
        className="z-10"
        isUsEcommerceEnabled={isUsEcommerceEnabled}
      >
        <VeevaNumber source="Navigation" />
        {/* FIXME: Remove after launch */}
        <VeevaNumber source="PreLaunchEmailsCollectionModal" />
      </Navigation>

      <main data-layout="home" className="relative z-0">
        {children}
      </main>

      <Footer className="z-0" />
    </>
  );
}
