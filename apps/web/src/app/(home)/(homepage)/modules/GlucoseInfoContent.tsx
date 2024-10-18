import { ActionAttributes, LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import Hyperlink from "~/components/Hyperlink";

export default async function GlucoseInfoContent() {
  const cms = ServiceLocator.getCMS();

  const { title, text, button } = await cms.getHomeGlucoseInfoBlockContent();

  return (
    <section
      className="container my-8 mb-20 text-center"
      data-analytics-location={LocationAttributes.VALUE}
    >
      <h3 className="subtitle mb-4 opacity-50">{title}</h3>
      <h4 className="headline mb-10 font-semibold">{text.data}</h4>

      <Hyperlink
        text={button.data.text}
        url={button.data.url}
        variant={button.data.variant}
        analyticsActionAttribute={ActionAttributes.VALUE_CTA}
        analyticsLocationAttribute={LocationAttributes.VALUE}
      />
    </section>
  );
}
