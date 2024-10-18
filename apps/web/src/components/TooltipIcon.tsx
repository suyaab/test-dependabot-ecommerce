"use client";

import Image from "next/image";

import HoverPopover from "./HoverPopover";

export default function TooltipIcon({
  tooltipContent,
}: {
  tooltipContent: string;
}) {
  const trigger = (
    <Image
      src="/icons/info.svg" // TODO make this a prop to swap out icon types
      alt="Info icon"
      width={12}
      height={12}
      className="relative bottom-0.5 inline-block"
    />
  );

  const content = <div dangerouslySetInnerHTML={{ __html: tooltipContent }} />;

  return <HoverPopover trigger={trigger} content={content} />;
}
