import { Metadata } from "next";

import { ServiceLocator } from "@ecommerce/cms";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import VeevaNumber from "~/components/VeevaNumber";
import cn from "~/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const cms = ServiceLocator.getCMS();
  const metadata = await cms.getMetadata("TermsOfSale");
  return metadata;
}

export default async function TermsOfSalePage() {
  const cms = ServiceLocator.getCMS();
  const content = await cms.getRawHTMLContent("TermsOfSale");
  return (
    <main className="container my-20 [&_a]:underline">
      <AnalyticsPageTracker page="terms-of-sale" />
      <VeevaNumber source="TermsOfSale" />

      <section
        className={cn("[&>p]:my-8", "[&_a:hover]:no-underline [&_a]:underline")}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </main>
  );
}
