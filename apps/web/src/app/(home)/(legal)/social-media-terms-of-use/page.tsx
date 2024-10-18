import { Metadata } from "next";

import { ServiceLocator } from "@ecommerce/cms";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import VeevaNumber from "~/components/VeevaNumber";
import cn from "~/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const cms = ServiceLocator.getCMS();
  const metadata = await cms.getMetadata("SocialMediaTermsOfUse");
  return metadata;
}

export default async function SocialMediaTermsOfUsePage() {
  const cms = ServiceLocator.getCMS();
  const content = await cms.getRawHTMLContent("SocialMediaTermsOfUse");
  return (
    <main className="container my-20 [&>p]:my-8">
      <AnalyticsPageTracker page="social-media-terms-of-use" />
      <VeevaNumber source="SocialMediaTermsOfUse" />

      <section
        className={cn(
          "[&>p]:my-8",
          "[&_ol]:mb-14 [&_ol]:ml-10 [&_ol]:mt-10 [&_ol_li]:my-6",
          "[&_ul]:mb-14 [&_ul]:ml-10 [&_ul]:mt-10 [&_ul_li]:my-6",
          "[&_.lower-alpha]:list-[lower-alpha]",
          "[&_.lower-roman]:list-[lower-roman]",
          "[&_a:hover]:no-underline [&_a]:underline",
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </main>
  );
}
