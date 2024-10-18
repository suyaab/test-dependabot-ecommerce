import { Metadata } from "next";

import { ServiceLocator } from "@ecommerce/cms";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import LegalAccordion from "~/components/LegalAccordion";
import VeevaNumber from "~/components/VeevaNumber";
import cn from "~/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const cms = ServiceLocator.getCMS();
  const metadata = await cms.getMetadata("PrivacyNotice");
  return metadata;
}

export default async function PrivacyNoticePage() {
  const cms = ServiceLocator.getCMS();
  const privacyNoticeTopContent = await cms.getRawHTMLContent("PrivacyNotice");
  const privacyNoticeItems = await cms.getPrivacyNoticeContent();

  const accordionItems = privacyNoticeItems.map((item) => ({
    sectionTitle: item.title,
    content: item.content,
  }));

  return (
    <main className="container my-20 break-words">
      <AnalyticsPageTracker page="privacy-notice" />
      <VeevaNumber source="PrivacyNotice" />

      <section>
        <div
          className={cn(
            "[&>p]:my-8",
            "[&_a:hover]:no-underline [&_a]:underline",
          )}
          dangerouslySetInnerHTML={{ __html: privacyNoticeTopContent }}
        />
        <LegalAccordion
          contentItems={accordionItems}
          contentClassName={cn(
            "[&>p]:my-8",
            "[&_table]:table-fixed [&_table]:border-collapse [&_table]:border-spacing-1 [&_table]:border [&_table]:border-charcoal",
            "[&_table]:max-lg:text-sm [&_table_td]:border [&_table_td]:border-charcoal [&_table_td]:p-1",
            "[&_ol]:ml-10 [&_ol]:list-[upper-roman] [&_ol_ol]:list-[lower-alpha] [&_ol_ol_ol]:list-[lower-roman] [&_ul]:ml-10",
            "[&_.lower-roman]:list-[lower-roman]",
            "[&_a:hover]:no-underline [&_a]:underline",
            "text-charcoal/70",
          )}
        />
      </section>
    </main>
  );
}
