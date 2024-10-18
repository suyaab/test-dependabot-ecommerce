import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import { DuplexTextAndImage } from "~/components/Duplex";

export default async function AboutUsDuplex() {
  const cms = ServiceLocator.getCMS();
  const duplexContentList = await cms.getDuplexContentList("AboutUs");

  return (
    <section data-analytics-location={LocationAttributes.PROCESS}>
      {duplexContentList.map((content) => {
        return <DuplexTextAndImage key={content.title.text} {...content} />;
      })}
    </section>
  );
}
