import { MultipleContentItems } from "@ecommerce/cms";

import Hyperlink from "~/components/Hyperlink";

interface Props {
  items: MultipleContentItems;
  analyticsLocationAttribute?: string;
}

export default function ContentBlock({
  items,
  analyticsLocationAttribute,
}: Props) {
  return (
    <>
      {items.map(({ typename, data }, index) => {
        if (typename === "Text") {
          return (
            <p key={`Text${index}`} className="whitespace-pre-line">
              {data}
            </p>
          );
        }

        // TODO: should this discriminated union be `Link`?
        if (typename === "Button") {
          return (
            <Hyperlink
              key={`Link${index}`}
              className="my-4"
              text={data.text}
              url={data.url}
              variant={data.variant}
              analyticsActionAttribute={data.text}
              analyticsLocationAttribute={analyticsLocationAttribute}
            />
          );
        }

        return null;
      })}
    </>
  );
}
