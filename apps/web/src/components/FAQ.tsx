import { LocationAttribute } from "@ecommerce/analytics";
import { FAQContent } from "@ecommerce/cms";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/Accordion";

export interface FAQProps {
  content: FAQContent;
  dataAnalyticsLocation: LocationAttribute;
}

export default function FAQ({ content, dataAnalyticsLocation }: FAQProps) {
  const { enabled, suptitle, title, items } = content;

  if (!(enabled ?? false)) {
    return null;
  }

  return (
    <section
      className="container my-8 mb-20"
      data-analytics-location={dataAnalyticsLocation}
    >
      <p className="subtitle mb-2 opacity-50">{suptitle}</p>
      <h2 className="mb-18 font-semibold">{title}</h2>
      <Accordion type="single" collapsible className="w-full text-left">
        {items.map((item, idx) => (
          <AccordionItem key={item.data} value={`item-${idx}`}>
            <AccordionTrigger
              data-analytics-action={`expandToggle-${item.title}`}
              data-analytics-location={dataAnalyticsLocation}
            >
              {item.title}
            </AccordionTrigger>
            <AccordionContent>
              <div
                dangerouslySetInnerHTML={{ __html: item.data }}
                className="text-charcoal/60 [&_a:hover]:no-underline [&_a]:underline [&_p]:mb-6"
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
