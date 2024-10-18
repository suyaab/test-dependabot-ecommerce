import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import { DuplexTextAndImage } from "~/components/Duplex";

export default async function TheScienceDuplex() {
  const cms = ServiceLocator.getCMS();
  const duplexContentList = await cms.getDuplexContentList("Science");

  return (
    <section data-analytics-location={LocationAttributes.METABOLISM}>
      {duplexContentList.map((content) => {
        return <DuplexTextAndImage key={content.title.text} {...content} />;
      })}
    </section>
  );
}
