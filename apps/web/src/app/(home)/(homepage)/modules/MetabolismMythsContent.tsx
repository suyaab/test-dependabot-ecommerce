import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import ResponsiveImage from "~/components/ResponsiveImage";
import MetabolismMythsSlides from "./MetabolismMythsSlides/MetabolismMythsSlides";

export default async function MetabolismMythsContent() {
  const cms = ServiceLocator.getCMS();

  const {
    main: { image, title, suptitle, subtitle, cta },
    slides,
  } = await cms.getHomeMetabolismMythsContent();

  return (
    <section
      className="container-full my-24 lg:container max-lg:mb-0"
      data-analytics-location={LocationAttributes.QUIZ}
    >
      <div className="relative lg:-mx-14">
        <ResponsiveImage
          alt={image.alt}
          url={image.url}
          desktopUrl={image.desktopUrl}
          width={image.width}
          height={image.height}
          desktopWidth={image.desktopWidth}
          desktopHeight={image.desktopHeight}
          className="brightness-90 lg:rounded-lg lg:brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-between pb-20 pt-14 text-linen">
          <p className="subtitle">{suptitle}</p>
          <h2 className="text-center font-semibold text-6xl lg:text-8xl">
            {title}
          </h2>
          <div className="space-y-6 text-center">
            <p>{subtitle}</p>
            <MetabolismMythsSlides cta={cta} slides={slides} />
          </div>
        </div>
      </div>
    </section>
  );
}
