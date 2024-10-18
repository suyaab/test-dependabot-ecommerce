import { ReactNode } from "react";

import { HomeProductHighlightEcommerceContent } from "@ecommerce/cms";

import Hyperlink from "~/components/Hyperlink";
import Icon, { getValidIconName } from "~/components/Icon";

interface Props {
  content: HomeProductHighlightEcommerceContent;
  children?: ReactNode;
}

export default function ProductHighlightEcommerceContentBlock({
  content,
  children,
}: Props) {
  const { data } = content;

  return (
    <div className="lg:w-1/2">
      <h2 className="mb-4 font-semibold lg:whitespace-pre-line">
        {data.title}
      </h2>
      <p className="subtitle lg:whitespace-pre-line">{data.subtitle}</p>

      <ul className="my-5 list-disc whitespace-pre-line pl-5">
        {data.bullets?.map((text) => {
          return (
            <li className="leading-7" key={text}>
              {text}
            </li>
          );
        })}
      </ul>
      {data.button != null && (
        <Hyperlink
          className="my-3 mb-5 mt-3"
          text={data.button.data.text}
          url={data.button.data.url}
          variant={data.button.data.variant}
        />
      )}

      {children}

      <ul className="flex">
        {data.sellingPoints?.map(({ text, icon }) => {
          const iconName = getValidIconName(icon);
          return (
            <li
              key={text}
              className="flex items-center border-charcoal/40 [&:not(:last-of-type)]:mr-2 [&:not(:last-of-type)]:border-r-[1px] [&:not(:last-of-type)]:pr-2"
            >
              {iconName && <Icon name={iconName} className="size-4" />}
              <span className="ml-2 flex text-xs">{text}</span>
            </li>
          );
        })}
      </ul>
      <ul className="mt-6 whitespace-pre-line text-xs text-charcoal/60">
        {data.disclaimers?.map((disclaimer) => (
          <li key={disclaimer}>{disclaimer}</li>
        ))}
      </ul>
    </div>
  );
}
