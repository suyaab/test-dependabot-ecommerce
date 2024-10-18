"use client";

import {
  createContext,
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";

import ArrowRight from "~/icons/ArrowRight";
import cn from "~/lib/utils";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

interface CarouselProps {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
  className?: string;
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  selectedIndex: number;
  scrollProgress: number;
  selectedScrollSnap: number;
  previousScrollSnap: number;
  scrollSnapList: number[];
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(
      (api: CarouselApi) => {
        if (!api) {
          return;
        }

        setSelectedIndex(api.selectedScrollSnap());
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
      },
      [setSelectedIndex],
    );

    const scrollPrev = useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const scrollTo = useCallback(
      (index: number) => {
        api?.scrollTo(index);
      },
      [api],
    );

    const scrollProgress = api?.scrollProgress() ?? 0;
    const selectedScrollSnap = api?.selectedScrollSnap() ?? 0;
    const previousScrollSnap = api?.previousScrollSnap() ?? 0;
    const scrollSnapList = api?.scrollSnapList() ?? [];

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          scrollTo,
          selectedIndex,
          scrollProgress,
          selectedScrollSnap,
          previousScrollSnap,
          scrollSnapList,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

interface CustomCarouselContentProps extends HTMLAttributes<HTMLDivElement> {
  wrapperClassName: string;
}

const CarouselContent = forwardRef<HTMLDivElement, CustomCarouselContentProps>(
  ({ className, wrapperClassName, ...props }, ref) => {
    const { carouselRef } = useCarousel();

    return (
      <div className={wrapperClassName} ref={carouselRef}>
        <div
          ref={ref}
          className={cn(
            // orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    // const { orientation } = useCarousel();

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn(
          "min-w-0 shrink-0 grow-0 basis-full",
          // orientation === "horizontal" ? "pl-4" : "pt-4",
          className,
        )}
        {...props}
      />
    );
  },
);
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <button
      ref={ref}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      data-analytics-action="previous"
      {...props}
    >
      <button
        className="size-10 rounded-full bg-charcoal p-3"
        data-analytics-action="previous"
      >
        <ArrowRight className="size-full rotate-180" color="white" />
      </button>
      <span className="sr-only">Previous slide</span>
    </button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <button
      ref={ref}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      data-analytics-action="next"
      {...props}
    >
      <button
        className="size-10 rounded-full bg-charcoal p-3"
        data-analytics-action="next"
      >
        <ArrowRight className="size-full" color="white" />
      </button>
      <span className="sr-only">Next slide</span>
    </button>
  );
});
CarouselNext.displayName = "CarouselNext";

interface CustomCarouselToProps extends HTMLAttributes<HTMLButtonElement> {
  index: number;
}

const CarouselTo = forwardRef<HTMLButtonElement, CustomCarouselToProps>(
  ({ className, index, children, ...props }, ref) => {
    const { scrollTo, selectedIndex } = useCarousel();

    return (
      <button
        ref={ref}
        className={cn("h-4 w-4 rounded-full", className)}
        onClick={() => scrollTo(index)}
        type="button"
        data-selected={selectedIndex === index}
        data-analytics-action={`toItem${index}`}
        {...props}
      >
        {children}
        <span className="sr-only">To slide</span>
      </button>
    );
  },
);
CarouselTo.displayName = "CarouselTo";

const ScrollProgress = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className }, ref) => {
  const { scrollSnapList } = useCarousel();

  return (
    <>
      <div ref={ref} className={cn("flex w-full", className)}>
        {/* create fake scroll area using tiny bars made of carousel snaplist */}
        {scrollSnapList.map((snap, index) => (
          <CarouselTo
            key={snap}
            index={index}
            className={cn(
              "bg-charcoal/30 transition-all duration-200",
              "data-[selected=true]:bg-charcoal",
              "outline-none focus:outline-none",
              "my-8 h-[3px] grow basis-auto",
            )}
          />
        ))}
      </div>
    </>
  );
});
ScrollProgress.displayName = "ScrollProgress";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselTo,
  ScrollProgress,
};
