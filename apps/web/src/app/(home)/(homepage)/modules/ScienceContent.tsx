import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import DuplexAccordion from "~/components/DuplexAccordion";

export default async function ScienceContent() {
  const cms = ServiceLocator.getCMS();

  const { commonHTML, items, additionalItems } =
    await cms.getDuplexAccordionContent("HomeScience");

  return (
    <section
      className="my-8 mb-20"
      data-analytics-location={LocationAttributes.PROCESS}
    >
      <DuplexAccordion
        commonHTML={commonHTML}
        items={items}
        additionalItems={additionalItems}
        analyticsLocationAttribute={LocationAttributes.PROCESS}
      />
    </section>
  );
}
