"use client";

import React, { ReactNode, useState } from "react";
import { PopoverArrow } from "@radix-ui/react-popover";

import { Popover, PopoverContent, PopoverTrigger } from "~/components/Popover";
import cn from "~/lib/utils";

export default function HoverPopover({
  trigger,
  content,
  align = "center",
  className,
}: {
  trigger: ReactNode;
  content: ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
}) {
  const delay = 300;
  let timeout: NodeJS.Timeout;
  let canClose = true;
  const [open, setOpen] = useState(false);

  const handleTriggerMouseEnter = () => {
    clearTimeout(timeout);
    setOpen(true);
  };

  const handleContentMouseEnter = () => {
    clearTimeout(timeout);
    canClose = false;
    setOpen(true);
  };

  const handleTriggerMouseLeave = () => {
    timeout = setTimeout(() => {
      if (canClose) {
        setOpen(false);
      }
    }, delay / 4);
  };

  const handleContentMouseLeave = () => {
    timeout = setTimeout(() => {
      canClose = true;
      setOpen(false);
    }, delay);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        onMouseEnter={handleTriggerMouseEnter}
        onMouseLeave={handleTriggerMouseLeave}
      >
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        onMouseEnter={handleContentMouseEnter}
        onMouseLeave={handleContentMouseLeave}
        className={cn(
          "max-w-xs rounded bg-white p-5 text-xs text-charcoal/60",
          className,
        )}
        align={align}
      >
        <PopoverArrow className="relative -top-[1px] h-2 w-3 fill-white drop-shadow-[rgba(0,0,0,.2)_0px_1px_1px]" />
        {content}
      </PopoverContent>
    </Popover>
  );
}
