import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import { DuplexTextAndImage } from "~/components/Duplex";

export default async function TheScienceStudyDuplex() {
  const cms = ServiceLocator.getCMS();
  const duplexContentList = await cms.getDuplexContentList("ScienceStudy");

  return (
    <section data-analytics-location={LocationAttributes.HARDWARE_HIGHLIGHT}>
      {duplexContentList.map((content) => {
        return <DuplexTextAndImage key={content.title.text} {...content} />;
      })}
    </section>
  );
}
