import { ReactNode } from "react";
import { getImageProps } from "next/image";

import { LocationAttributes } from "@ecommerce/analytics";
import { ResponsiveImageContent } from "@ecommerce/cms";

import cn from "~/lib/utils";

interface HeroImageProps {
  image: ResponsiveImageContent;
  children?: ReactNode;
  className?: string;
}

/* eslint-disable @next/next/no-img-element */
export default function HeroImage({
  children,
  image: { url, desktopUrl, alt, width, desktopWidth, height, desktopHeight },
  className,
}: HeroImageProps) {
  const common = {
    alt,
    sizes: "100vw",
  };

  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...common,
    width: desktopWidth,
    height: desktopHeight,
    quality: 75,
    src: desktopUrl,
  });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    width,
    height,
    quality: 70,
    src: url,
  });

  return (
    <>
      {/* Aspect Ratio Style Setting to avoid CLS */}
      <style>{`
        @media (min-width: 1024px) {
          .aspect-ratio-desktop { aspect-ratio: ${desktopWidth}/${desktopHeight}; }
        }
      `}</style>

      <section
        data-analytics-location={LocationAttributes.HERO}
        data-testid="hero"
        className={cn(
          "aspect-ratio-desktop relative z-0 w-full overflow-hidden lg:max-h-[calc(100vh-var(--promoBarHeight))]",
          className,
        )}
      >
        <picture>
          <source media="(min-width: 1024px)" srcSet={desktop} />
          <source media="(max-width: 1023px)" srcSet={mobile} />
          <img
            className="relative -z-10 block h-full w-full object-cover object-center lg:absolute"
            alt={alt}
            {...rest}
            fetchPriority="high" // eslint-disable-line
            loading="eager"
          />
        </picture>

        {children}
      </section>
    </>
  );
}
