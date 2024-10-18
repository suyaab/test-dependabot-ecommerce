import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import { DuplexTextAndImage } from "~/components/Duplex";

export default async function LingoExperienceDuplex() {
  const cms = ServiceLocator.getCMS();
  const duplexContentList = await cms.getDuplexContentList("LingoExperience");

  return (
    <section data-analytics-location={LocationAttributes.SHOP}>
      {duplexContentList.map((content) => {
        return (
          <DuplexTextAndImage
            key={content.title.text}
            {...content}
            bleedOut={false}
          />
        );
      })}
    </section>
  );
}
