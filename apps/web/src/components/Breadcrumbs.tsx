import React, { ReactNode } from "react";

import Hyperlink, { HyperlinkProps } from "~/components/Hyperlink";
import cn from "~/lib/utils";

interface BreadcrumbProps {
  children: ReactNode;
}

export const Breadcrumb = ({ children }: BreadcrumbProps) => (
  <nav className="flex items-center text-sm">{children}</nav>
);

export const BreadcrumbLink = ({
  url,
  text,
  className,
  ...props
}: HyperlinkProps) => (
  <Hyperlink
    url={url}
    text={text}
    className={cn(className, "underline hover:no-underline")}
    {...props}
  />
);

export const BreadcrumbSeparator = () => (
  <div
    role="separator"
    aria-orientation="vertical"
    className="mx-2 text-charcoal"
  >
    /
  </div>
);

interface BreadcrumbsProps {
  links: { text: string; url: string }[];
  analyticsLocationAttribute?: string;
}

export const Breadcrumbs = ({
  links,
  analyticsLocationAttribute,
}: BreadcrumbsProps) => {
  return (
    <Breadcrumb>
      {links.map((link, index) => (
        <>
          <BreadcrumbLink
            url={link.url}
            text={link.text}
            analyticsLocationAttribute={analyticsLocationAttribute}
            analyticsActionAttribute={`$Breadcrumb ${link.text}`}
          />
          {index < links.length - 1 && <BreadcrumbSeparator />}
        </>
      ))}
    </Breadcrumb>
  );
};
