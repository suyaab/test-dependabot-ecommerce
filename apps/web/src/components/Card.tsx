import { ReactNode } from "react";

import cn from "~/lib/utils";

export interface CardProps {
  id: string;
  name: string;
  children: ReactNode;
  className?: string;
  handleSelect: (id: string) => void;
  selected?: boolean;
  dataAnalyticsAction?: string;
  dataAnalyticsLocation?: string;
}

const Card = ({
  id,
  name,
  children,
  handleSelect,
  selected = false,
  dataAnalyticsLocation,
  dataAnalyticsAction,
  className,
}: CardProps) => {
  const conditionalAttributes = {
    ...(dataAnalyticsLocation != null && {
      "data-analytics-action": dataAnalyticsLocation,
    }),
    ...(dataAnalyticsAction != null && {
      "data-analytics-location": dataAnalyticsAction,
    }),
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        {
          "bg-white outline-1 outline-charcoal/40": !selected,
          "bg-blue/5 outline-2 outline-blue": selected,
        },
        "col-span-full flex cursor-pointer flex-wrap rounded-lg px-4 py-6 outline transition lg:px-6",
        className,
      )}
      key={id}
      data-testid={`${name}-${id}`}
      onClick={() => handleSelect(id)}
      onKeyDown={() => handleSelect(id)}
      {...conditionalAttributes}
    >
      {children}
    </div>
  );
};

export default Card;
