import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import DuplexAccordion from "~/components/DuplexAccordion";

export default async function BiosensorAccordion() {
  const cms = ServiceLocator.getCMS();

  const { commonHTML, items, additionalItems } =
    await cms.getDuplexAccordionContent("LingoExperienceBiosensor");

  return (
    <section
      className="my-8 mb-20 lg:flex"
      data-analytics-location={LocationAttributes.HARDWARE_HIGHLIGHT}
    >
      <DuplexAccordion
        commonHTML={commonHTML}
        items={items}
        additionalItems={additionalItems}
        analyticsLocationAttribute={LocationAttributes.HARDWARE_HIGHLIGHT}
      />
    </section>
  );
}
