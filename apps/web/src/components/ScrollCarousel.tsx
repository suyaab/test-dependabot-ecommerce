import { ReactNode } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  ScrollProgress,
} from "~/components/EmblaCarousel";
import cn from "~/lib/utils";

export default function ScrollCarousel({
  children,
  className,
  itemClassName,
}: {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div className="overflow-hidden">
      <Carousel className={cn("container-full", className)}>
        <CarouselContent
          wrapperClassName="container"
          className="-ml-8 -mr-4 flex px-4 lg:-ml-4 lg:mr-0 lg:px-0"
        >
          {children.map((childNode, index) => (
            <CarouselItem
              key={index}
              className={cn(
                "basis-3/4 pl-4 last:mr-4 lg:basis-1/4 last:lg:mr-0",
                itemClassName,
              )}
            >
              {childNode}
            </CarouselItem>
          ))}
        </CarouselContent>

        <ScrollProgress className="container" />
      </Carousel>
    </div>
  );
}
