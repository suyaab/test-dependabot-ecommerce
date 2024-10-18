import { ServiceLocator } from "@ecommerce/cms";

import ResponsiveImage from "~/components/ResponsiveImage";
import ScrollCarousel from "~/components/ScrollCarousel";
import VeevaNumber from "./VeevaNumber";

export default async function ExpertsCarousel() {
  const cms = ServiceLocator.getCMS();

  const { items } = await cms.getExpertsCarouselContent();

  return (
    <>
      <section>
        <VeevaNumber source="ExpertsCarousel" />
        <ScrollCarousel>
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
                className="mb-6"
              />
              <h3 className="mb-1 font-semibold text-sm">{item.title}</h3>
              <p className="text-sm">{item.description}</p>
            </div>
          ))}
        </ScrollCarousel>
      </section>
    </>
  );
}
