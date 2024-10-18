import { ServiceLocator } from "@ecommerce/cms";

import References from "~/components/References";

export default async function ReferencesSection() {
  const cms = ServiceLocator.getCMS();
  const referencesData = await cms.getReferencesContent("TheScience");

  return <References {...referencesData} />;
}
