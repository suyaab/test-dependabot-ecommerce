import { LocationAttributes } from "@ecommerce/analytics";
import { ReferencesContent } from "@ecommerce/cms";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/Accordion";

export default function References({ title, items }: ReferencesContent) {
  return (
    <section
      className="container my-8 mb-20"
      data-analytics-location={LocationAttributes.REFERENCES}
    >
      <Accordion type="single" collapsible className="w-full text-left">
        <AccordionItem className="border-none" value={title}>
          <AccordionTrigger className="text-base">{title}</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-7 text-xs">
              {items.map((item) => (
                <li className="pb-1" key={item}>
                  {item}
                </li>
              ))}
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
