import { ActionAttributes, LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import Hyperlink from "~/components/Hyperlink";

export default async function ResearchInfoContent() {
  const cms = ServiceLocator.getCMS();

  const { text, button } = await cms.getLEResearchInfoBlockContent();

  return (
    <section
      className="container mb-32 text-center lg:mb-52 lg:mt-8"
      data-analytics-location={LocationAttributes.INTRO}
    >
      <h3 className="headline h4 mb-10 font-semibold">{text.data}</h3>
      <Hyperlink
        text={button.data.text}
        url={button.data.url}
        variant={button.data.variant}
        analyticsLocationAttribute={LocationAttributes.INTRO}
        analyticsActionAttribute={ActionAttributes.INTRO_CTA}
      />
    </section>
  );
}
