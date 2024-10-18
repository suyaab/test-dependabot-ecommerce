import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import ResponsiveImage from "~/components/ResponsiveImage";
import ScrollCarousel from "~/components/ScrollCarousel";

export default async function NextStepsCarousel() {
  const cms = ServiceLocator.getCMS();

  const { title, items } = await cms.getPDPNextStepsCarouselContent();

  return (
    <section
      data-analytics-location={LocationAttributes.HOW_IT_WORKS}
      className="my-24"
    >
      <div className="container mb-10">
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div>
        <ScrollCarousel itemClassName="lg:basis-1/3">
          {items.map((item) => (
            <div className="mb-12 w-full" key={item.title}>
              <ResponsiveImage
                url={item.image.url}
                desktopUrl={item.image.desktopUrl}
                alt={item.image.alt}
                width={item.image.width}
                height={item.image.height}
                desktopHeight={item.image.desktopHeight}
                desktopWidth={item.image.desktopWidth}
                className="mb-6 rounded-lg"
                quality={85}
              />
              <h3 className="subtitle mb-4 font-semibold">{item.title}</h3>
              <p className="text-charcoal/70">{item.description}</p>
            </div>
          ))}
        </ScrollCarousel>
      </div>
    </section>
  );
}
