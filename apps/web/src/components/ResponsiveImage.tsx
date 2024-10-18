import Image from "next/image";

import { ResponsiveImageContent } from "@ecommerce/cms";

import cn from "~/lib/utils";

interface Props extends ResponsiveImageContent {
  className?: string;
}

// TODO: check if can be optimized within srcset and sizes to reduce DOM elements
export default function ResponsiveImage({
  url,
  desktopUrl,
  alt,
  width,
  height,
  desktopWidth,
  desktopHeight,
  className,
  quality = 75,
}: Props) {
  return (
    <>
      {url != null && (
        <Image
          src={url}
          alt={alt}
          width={width}
          height={height}
          className={cn("h-auto w-full lg:hidden", className)}
          loading="lazy"
          quality={quality}
        />
      )}
      {desktopUrl != null && (
        <Image
          src={desktopUrl}
          alt={alt}
          width={desktopWidth}
          height={desktopHeight}
          className={cn("h-auto w-full max-lg:hidden", className)}
          loading="lazy"
          quality={quality}
        />
      )}
    </>
  );
}
