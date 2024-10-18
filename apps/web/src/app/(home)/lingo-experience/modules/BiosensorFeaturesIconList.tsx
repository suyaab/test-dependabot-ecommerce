import { ServiceLocator } from "@ecommerce/cms";

import IconItemsList from "~/components/IconItemsList";

export default async function BiosensorFeaturesIconList() {
  const cms = ServiceLocator.getCMS();

  const { title, subtitle, items } = await cms.getIconItemList(
    "LEBiosensorFeatures",
  );

  return (
    <section className="mb-32 mt-20 lg:mb-40">
      <IconItemsList title={title} subtitle={subtitle} items={items} />
    </section>
  );
}
