import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import IconItemsList from "~/components/IconItemsList";

export default async function FuelBetterItemList() {
  const cms = ServiceLocator.getCMS();

  const { title, subtitle, items } = await cms.getIconItemList(
    "TheScienceFuelBetter",
  );

  return (
    <section
      className="bg-linen pb-12 pt-24 lg:py-32"
      data-analytics-location={LocationAttributes.BENEFITS}
    >
      <IconItemsList title={title} subtitle={subtitle} items={items} />
    </section>
  );
}
