import { Metadata } from "next";

import { ServiceLocator } from "@ecommerce/cms";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import VeevaNumber from "~/components/VeevaNumber";
import cn from "~/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const cms = ServiceLocator.getCMS();
  const metadata = await cms.getMetadata("EULA");
  return metadata;
}

export default async function EULAPage() {
  const cms = ServiceLocator.getCMS();
  const content = await cms.getRawHTMLContent("EULA");
  return (
    <main className="container my-20 break-words">
      <AnalyticsPageTracker page="eula" />
      <VeevaNumber source="EULA" />

      <section
        className={cn(
          "[&>p]:my-8",
          "[&_ol]:mb-14 [&_ol]:ml-10 [&_ol]:mt-10 [&_ol]:list-decimal [&_ol_li]:my-6",
          "[&_.lower-alpha]:list-[lower-alpha]",
          "[&_.lower-roman]:list-[lower-roman]",
          "[&_a:hover]:no-underline [&_a]:underline",
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </main>
  );
}
