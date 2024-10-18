import Image from "next/image";

import { LocationAttributes } from "@ecommerce/analytics";
import {
  ProductCarouselContent,
  type ResponsiveImageContent,
} from "@ecommerce/cms";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselTo,
} from "~/components/EmblaCarousel";
import ResponsiveImage from "~/components/ResponsiveImage";
import TooltipTag from "~/components/TooltipTag";

interface Props {
  content: ProductCarouselContent;
}

export default function ProductCarousel({ content }: Props) {
  return (
    <>
      <Carousel
        className="sticky top-10 col-span-full grid w-lvw grid-cols-subgrid self-start"
        data-testid="pdp-carousel"
      >
        {/* TODO figure out a better full width breaking out of grid solution */}
        <CarouselContent
          wrapperClassName="overflow-hidden -mx-6 lg:mx-0 lg:mb-0 col-span-full lg:col-span-6 grid lg:order-2"
          className="flex lg:gap-8"
        >
          {content?.items.map((slide: ResponsiveImageContent) => (
            <CarouselItem key={slide.alt} className="lg:[&>img]:rounded-lg">
              <ResponsiveImage {...slide} quality={90} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="col-span-full lg:order-1 lg:col-span-1">
          <div className="mt-2 flex items-center justify-center lg:mt-1 lg:flex-col">
            {content?.items.map(
              (slide: ResponsiveImageContent, index: number) => (
                <CarouselTo
                  key={slide.alt}
                  index={index}
                  className="mx-1 size-2 bg-charcoal/40 data-[selected=true]:bg-charcoal lg:mx-0 lg:mb-4 lg:size-auto lg:rounded lg:bg-transparent lg:outline lg:outline-2 lg:outline-charcoal/30 lg:data-[selected=true]:bg-transparent lg:data-[selected=true]:outline-black"
                  data-analytics-location={LocationAttributes.SKU_HIGHLIGHT}
                >
                  {slide.desktopUrl != null && (
                    <Image
                      className="hidden h-auto w-full lg:block"
                      src={slide.desktopUrl}
                      width={slide.desktopWidth / 8}
                      height={slide.desktopHeight / 8}
                      alt={slide.alt}
                    />
                  )}
                </CarouselTo>
              ),
            )}
          </div>
        </div>
        <div className="col-span-full my-10 flex justify-center gap-x-4 lg:order-3 lg:col-span-6 lg:col-start-2 lg:my-4">
          <TooltipTag
            title={content?.eligibleTag?.title}
            content={content?.eligibleTag?.tooltip}
            showIcon
          />
          <TooltipTag
            title={content?.compatibleTag?.title}
            content={content?.compatibleTag?.tooltip}
            showIcon
          />
        </div>
      </Carousel>
    </>
  );
}
