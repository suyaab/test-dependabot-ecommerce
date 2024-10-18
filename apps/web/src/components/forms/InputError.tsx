import React from "react";

import CircleExclamation from "~/icons/CircleExclamation";
import cn from "~/lib/utils";

export default function InputError({
  errorMessage,
  className,
}: {
  errorMessage?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-x-1", className)}>
      <CircleExclamation className="size-3" />
      <span
        className="text-xs text-red"
        dangerouslySetInnerHTML={{ __html: errorMessage ?? "" }}
      ></span>
    </div>
  );
}
