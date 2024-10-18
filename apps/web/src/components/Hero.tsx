import { ReactNode } from "react";

import { MultipleContentItems, ResponsiveImageContent } from "@ecommerce/cms";

import HeroImage from "~/components/HeroImage";
import Hyperlink from "~/components/Hyperlink";
import { getFeatureFlag } from "~/lib/feature-flags/server";
import cn from "~/lib/utils";

interface HeroProps {
  image: ResponsiveImageContent;
  children?: ReactNode;
  alignContentX?: string;
  alignContentY?: string;
  theme?: string;
  contentItems?: MultipleContentItems;
  className?: string;
  analyticsLocationAttribute?: string;
}

export default async function Hero({
  image,
  children,
  alignContentX = "left",
  alignContentY = "middle",
  theme,
  contentItems,
  className,
  analyticsLocationAttribute,
}: HeroProps) {
  const isUsEcommerceEnabled = await getFeatureFlag("DTC_US_EcommerceRelease");

  let justifyContent = "justify-start";
  let alignContent = "items-center";

  switch (alignContentX) {
    case "left":
      justifyContent = "justify-start";
      break;
    case "center":
      justifyContent = "justify-center";
      break;
    case "right":
      justifyContent = "justify-end";
      break;
    default:
      break;
  }

  switch (alignContentY) {
    case "top":
      alignContent = "items-start";
      break;
    case "middle":
      alignContent = "items-center";
      break;
    case "bottom":
      alignContent = "items-end";
      break;
    default:
      break;
  }

  return (
    <HeroImage image={image} className={className}>
      <div className="container relative top-0 z-10 h-full max-lg:pt-16">
        <div
          className={cn(
            "h-full lg:flex lg:pb-24 lg:pt-32",
            justifyContent,
            alignContent,
            {
              "lg:text-linen-light": theme === "dark",
              "lg:text-charcoal": theme === "light",
            },
          )}
        >
          <div className="flex flex-col items-start">
            {contentItems?.map(({ typename, data }, idx) => {
              if (typename === "Text") {
                return (
                  <div
                    className="lg:whitespace-pre [&_h1]:mb-6 [&_h1]:font-semibold [&_p]:mb-6"
                    key={`${typename}-${idx}`}
                    dangerouslySetInnerHTML={{
                      __html: data,
                    }}
                  />
                );
              }

              if (isUsEcommerceEnabled && typename === "Button") {
                return (
                  <Hyperlink
                    key={`${typename}-${idx}`}
                    url={data.url}
                    text={data.text}
                    variant={data.variant}
                    analyticsActionAttribute={data.text}
                    analyticsLocationAttribute={analyticsLocationAttribute}
                  />
                );
              }

              return null;
            })}
            {children}
          </div>
        </div>
      </div>
    </HeroImage>
  );
}
