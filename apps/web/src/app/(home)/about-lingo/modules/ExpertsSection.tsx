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

  const { subtitle, description } = await cms.getExpertsCarouselContent();

  return (
    <div data-analytics-location={LocationAttributes.EXPERTS}>
      <section className={cn("container mb-14", className)}>
        <h2 className="subtitle font-matter mb-6 font-normal text-charcoal/50">
          {subtitle}
        </h2>
        <p className="subtitle">{description}</p>
      </section>
      <ExpertsCarousel />
    </div>
  );
}
