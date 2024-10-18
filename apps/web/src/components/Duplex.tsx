import { ReactNode } from "react";

import type {
  DuplexCallout,
  DuplexTitle,
  ResponsiveImageContent,
} from "@ecommerce/cms";
import { DuplexContentLayout } from "@ecommerce/cms";

import cn from "~/lib/utils";
import ResponsiveImage from "./ResponsiveImage";

interface DuplexProps {
  className?: string;
  children: ReactNode;
}

export function Duplex({ className, children }: DuplexProps) {
  return (
    <div
      className={cn(
        "grid-container [&:not(:only-of-type)]:my-14 [&:not(:only-of-type)]:lg:my-28",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface DuplexHalfProps {
  className?: string;
  children: ReactNode;
}

export function DuplexHalf({ className, children }: DuplexHalfProps) {
  return <div className={className}>{children}</div>;
}

interface DuplexHalfTextProps {
  className?: string;
  eyebrow?: string | null;
  title: DuplexTitle;
  text: string;
  callout?: DuplexCallout;
}

export function DuplexHalfText({
  className,
  eyebrow,
  title,
  text,
  callout,
}: DuplexHalfTextProps) {
  return (
    <DuplexHalf
      className={cn(
        "[&>h2]:mb-6 [&>h2]:text-charcoal [&>h3]:mb-4 [&>h3]:text-charcoal [&>h4]:mb-2 [&_main>p]:mb-5",
        className,
      )}
    >
      {eyebrow != null && <h4 className="subtitle">{eyebrow}</h4>}
      <DuplexHeaderTag title={title} />
      <main dangerouslySetInnerHTML={{ __html: text }} />
      <DuplexCalloutSection callout={callout} />
    </DuplexHalf>
  );
}

interface DuplexHalfImageProps {
  className?: string;
  responsiveImage: ResponsiveImageContent;
}

export function DuplexHalfImage({
  className,
  responsiveImage,
}: DuplexHalfImageProps) {
  return (
    <DuplexHalf
      className={cn("max-lg:no-x-gap [&>img]:lg:rounded-lg", className)}
    >
      <ResponsiveImage {...responsiveImage} />
    </DuplexHalf>
  );
}
interface DuplexTextAndImageProps {
  title: DuplexTitle;
  image: ResponsiveImageContent;
  eyebrow?: string | null;
  text: string;
  callout?: DuplexCallout;
  className?: string;
  layout?: DuplexContentLayout;
  bleedOut?: boolean;
}

export function DuplexTextAndImage({
  title,
  eyebrow,
  text,
  callout,
  image,
  className,
  layout,
  bleedOut = true,
}: DuplexTextAndImageProps) {
  const duplexHalfImageClassNames = cn("col-span-full lg:col-span-6", {
    "lg:order-2 lg:col-start-7": layout === "imageRightDesktop",
    "lg:order-1": layout === "imageLeftDesktop" || !layout,
    "no-r-gap": bleedOut && layout === "imageRightDesktop",
    "no-l-gap": bleedOut && (layout === "imageLeftDesktop" || !layout),
  });

  const duplexHalfTextClassNames = cn(
    "col-span-full lg:col-span-5 mt-10 lg:mt-0 text-charcoal/70 flex flex-col justify-center",
    {
      "lg:order-1": layout === "imageRightDesktop",
      "lg:order-2 lg:col-start-8": layout === "imageLeftDesktop" || !layout,
    },
  );

  return (
    <Duplex className={className}>
      <DuplexHalfImage
        className={duplexHalfImageClassNames}
        responsiveImage={image}
      />
      <DuplexHalfText
        className={duplexHalfTextClassNames}
        title={title}
        eyebrow={eyebrow}
        text={text}
        callout={callout}
      ></DuplexHalfText>
    </Duplex>
  );
}

export const DuplexHeaderTag = ({ title }: { title: DuplexTitle }) => {
  const Tag = title.tag;
  return <Tag className="font-semibold">{title.text}</Tag>;
};

export const DuplexCalloutSection = ({
  callout,
}: {
  callout?: DuplexCallout;
}) => {
  if (!callout) return null;
  return (
    <div className="mt-10 rounded-lg bg-linen p-6 text-sm leading-6 lg:p-10">
      <header className="mb-2 font-medium text-charcoal">
        {callout.header}
      </header>
      <p dangerouslySetInnerHTML={{ __html: callout.text }} />
    </div>
  );
};
