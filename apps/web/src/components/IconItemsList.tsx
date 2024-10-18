import { IconItemsListContent } from "@ecommerce/cms";

import Icon, { IconNamesEnum } from "./Icon";

export default function IconItemsList({
  title,
  subtitle,
  items,
}: IconItemsListContent) {
  return (
    <div className="grid-container">
      {title != null && (
        <h2
          className="col-span-full mb-6 font-semibold lg:col-span-7"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      )}
      {subtitle != null && (
        <p
          className="subtitle col-span-full mb-6 text-charcoal/60 lg:col-span-7 lg:mb-12"
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
      )}
      <div className="col-span-full grid grid-cols-subgrid">
        {items.map((item) => (
          <div
            key={item.icon}
            className="col-span-full mb-12 flex flex-col items-start gap-6 lg:col-span-3 lg:mb-8"
          >
            <Icon name={item.icon as IconNamesEnum} className="size-12" />
            <h3
              className="subtitle font-semibold"
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
            <div
              className="text-charcoal/70"
              dangerouslySetInnerHTML={{ __html: item.text }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
