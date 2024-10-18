import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import FAQ from "~/components/FAQ";

export default async function FAQContent() {
  const cms = ServiceLocator.getCMS();

  const faqData = await cms.getFAQContent("TheScience");

  return (
    <FAQ content={faqData} dataAnalyticsLocation={LocationAttributes.FAQ} />
  );
}
