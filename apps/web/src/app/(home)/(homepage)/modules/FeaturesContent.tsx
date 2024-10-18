import Image from "next/image";

import { LocationAttributes } from "@ecommerce/analytics";
import { HomeFeatureContentItem, ServiceLocator } from "@ecommerce/cms";

import {
  Dialog,
  DialogContentWithCloseButton,
  DialogTrigger,
} from "~/components/Dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselTo,
} from "~/components/EmblaCarousel";
import ResponsiveImage from "~/components/ResponsiveImage";
import MagnifyingIcon from "~/icons/MagnifyingIcon";
import cn from "~/lib/utils";

export default async function FeaturesContent() {
  const cms = ServiceLocator.getCMS();

  const featuresContent = await cms.getHomeFeaturesContent();

  const { url, desktopUrl, alt, width, height, desktopWidth, desktopHeight } =
    await cms.getResponsiveImage("HomeFeatures");

  return (
    <section
      className="overflow-clip"
      data-analytics-location={LocationAttributes.HOW_IT_WORKS}
    >
      <div className="container my-8 mb-20">
        <Dialog>
          <DialogTrigger asChild>
            <div className="group relative -mx-8 flex cursor-pointer flex-wrap justify-center lg:-mx-40">
              <ResponsiveImage
                url={url}
                desktopUrl={desktopUrl}
                alt={alt}
                width={width}
                height={height}
                desktopWidth={desktopWidth}
                desktopHeight={desktopHeight}
              />
              <MagnifyingIcon
                className="my-4 rounded-full bg-charcoal transition-all duration-200 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:scale-50 lg:transform lg:bg-charcoal/50 lg:group-hover:scale-100 lg:group-hover:bg-charcoal"
                color="white"
              />
            </div>
          </DialogTrigger>

          <DialogContentWithCloseButton
            className="h-full w-full max-w-none border-none bg-linen-light p-0"
            data-analytics-location={`${LocationAttributes.HOW_IT_WORKS}Dialog`}
          >
            <Carousel className="relative flex h-full max-lg:flex-col">
              <CarouselContent
                wrapperClassName="grow overflow-hidden"
                className="flex h-full items-start"
              >
                {featuresContent?.items.map(
                  (feature: HomeFeatureContentItem) => (
                    <CarouselItem
                      key={feature.title}
                      className="relative h-full overflow-y-auto pb-4 lg:flex lg:pb-0"
                    >
                      {feature.mainImage.url !== null && (
                        <Image
                          src={feature.mainImage.url}
                          alt={feature.mainImage.alt}
                          width={feature.mainImage.width}
                          height={feature.mainImage.height}
                          className="absolute z-0 w-full lg:hidden"
                        />
                      )}
                      <div className="relative max-h-full w-1/2 shrink-0 grow-0 basis-1/2 max-lg:hidden lg:order-2">
                        {feature.mainImage.desktopUrl !== null && (
                          <Image
                            src={feature.mainImage.desktopUrl}
                            alt={feature.mainImage.alt}
                            fill
                            objectFit="cover"
                            sizes="50vw"
                          />
                        )}
                      </div>
                      <div className="relative z-10 pt-24 lg:order-1 lg:flex lg:shrink-0 lg:grow-0 lg:basis-1/2 lg:flex-col lg:justify-end lg:p-20 lg:pr-64">
                        <ResponsiveImage
                          url={feature.centerImage.url}
                          desktopUrl={feature.centerImage.desktopUrl}
                          alt={feature.centerImage.alt}
                          width={feature.centerImage.width}
                          height={feature.centerImage.height}
                          desktopWidth={feature.centerImage.desktopWidth}
                          desktopHeight={feature.centerImage.desktopHeight}
                          className={cn(
                            "max-lg:w-full lg:absolute lg:right-0 lg:top-1/2 lg:max-w-[640px] lg:-translate-y-1/2 lg:translate-x-1/2 lg:transform",
                            {
                              "max-lg:hidden": feature.centerImage.url === null,
                              "lg:hidden":
                                feature.centerImage.desktopUrl === null,
                            },
                          )}
                        />
                        <div className="max-lg:container">
                          <h3 className="subtitle mb-4 lg:max-w-96">
                            {feature.title}
                          </h3>
                          <div
                            className="text-charcoal/70 lg:max-w-96"
                            dangerouslySetInnerHTML={{
                              __html: feature.description,
                            }}
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ),
                )}
              </CarouselContent>

              <div className="flex h-12 shrink-0 grow-0 items-center justify-center gap-2 bg-linen-light px-4 lg:hidden">
                {featuresContent?.items.map((item, index) => (
                  <CarouselTo
                    key={item.title}
                    index={index}
                    className={cn(
                      "size-2 rounded-xl bg-charcoal/70 transition-all duration-300",
                      "data-[selected=true]:bg-charcoal",
                      "outline-none focus:outline-none",
                    )}
                  />
                ))}
              </div>

              <div className="absolute left-0 right-0 top-1/2 z-30 h-0 transform max-lg:hidden">
                <CarouselPrevious className="absolute left-8 disabled:cursor-default disabled:opacity-15" />
                <CarouselNext className="absolute right-10 disabled:cursor-default disabled:opacity-15" />
              </div>
            </Carousel>
          </DialogContentWithCloseButton>
        </Dialog>
      </div>
    </section>
  );
}
