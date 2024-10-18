import Link from "next/link";

import cn from "~/lib/utils";

export interface HyperlinkProps {
  url: string;
  text: string;
  variant?: string; // TODO: fix CMS content to have type: "dark" | "light" | "outline" | "underline";
  className?: string;
  autoFocus?: boolean;
  isDisabled?: boolean;
  scroll?: boolean; // Link attribute for scroll after navigation
  analyticsActionAttribute?: string;
  analyticsLocationAttribute?: string;
}

export default function Hyperlink({
  text,
  url,
  variant,
  className,
  scroll,
  analyticsActionAttribute,
  analyticsLocationAttribute,
}: HyperlinkProps) {
  let linkClassName = "";

  // TODO: create `link` css class names
  switch (variant) {
    case "light":
      linkClassName = "button-light";
      break;
    case "dark":
      linkClassName = "button-dark";
      break;
    case "outline":
      linkClassName = "button-outline";
      break;
    default:
      break;
  }

  return (
    <Link
      href={url}
      className={cn(linkClassName, className)}
      scroll={scroll}
      data-analytics-action={analyticsActionAttribute}
      data-analytics-location={analyticsLocationAttribute}
    >
      {text}
    </Link>
  );
}
