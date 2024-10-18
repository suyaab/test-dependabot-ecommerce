import { ReactNode } from "react";

import { HomeProductHighlightContent } from "@ecommerce/cms";

interface Props {
  content: HomeProductHighlightContent;
  children?: ReactNode;
}

export default function ProductHighlightContentBlock({
  content,
  children,
}: Props) {
  return (
    <div className="lg:w-1/2">
      <h2 className="mb-4 font-semibold lg:whitespace-pre-line">
        {content.data.title}
      </h2>
      <p className="subtitle lg:whitespace-pre-line">{content.data.subtitle}</p>

      <ul className="my-5 list-disc whitespace-pre-line pl-5">
        {content.data.bullets.map((text, index) => {
          return (
            <li className="leading-7" key={`bullet${index}`}>
              {text}
            </li>
          );
        })}
      </ul>
      {children}
    </div>
  );
}
