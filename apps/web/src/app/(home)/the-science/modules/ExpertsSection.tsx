import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import ExpertsCarousel from "~/components/ExpertsCarousel";
import cn from "~/lib/utils";

export default async function ExpertsSection({
  className,
}: {
  className?: string;
}) {
  const cms = ServiceLocator.getCMS();

  const { title } = await cms.getExpertsCarouselContent();

  return (
    <div data-analytics-location={LocationAttributes.EXPERTS}>
      <section className={cn("container mb-10", className)}>
        <h2 className="font-semibold">{title}</h2>
      </section>
      <ExpertsCarousel />
    </div>
  );
}
