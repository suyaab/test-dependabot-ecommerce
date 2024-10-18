import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

export default async function AboutUsTopText() {
  const cms = ServiceLocator.getCMS();

  const { data } = await cms.getTextContent("AboutUsTopText");

  return (
    <div
      className="grid-container -mt-12 mb-20 lg:mb-32 lg:mt-8"
      data-analytics-location={LocationAttributes.INTRO}
    >
      <div className="headline col-span-full max-lg:text-charcoal/60 lg:col-span-9">
        {data}
      </div>
    </div>
  );
}
