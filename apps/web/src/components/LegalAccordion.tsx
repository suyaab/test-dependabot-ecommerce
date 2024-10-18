"use client";

import { useState } from "react";

import { LegalAccordionContentItem } from "@ecommerce/cms";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/Accordion";
import MinusIcon from "~/icons/MinusIcon";
import PlusIcon from "~/icons/PlusIcon";

export default function LegalAccordion({
  contentItems,
  contentClassName,
}: {
  contentItems: LegalAccordionContentItem[];
  contentClassName?: string;
}) {
  const [values, setValues] = useState<string[]>([]);
  const toggleItem = (itemValue: string) => {
    if (values.includes(itemValue)) {
      setValues(values.filter((value) => value !== itemValue));
    } else {
      setValues([...values, itemValue]);
    }
  };

  const collapseAll = () => {
    setValues([]);
  };

  const expandAll = () => {
    if (contentItems != null) {
      setValues(contentItems.map((item) => item.sectionTitle));
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <button
          className="button-light mb-3"
          onClick={() => (values.length === 0 ? expandAll() : collapseAll())}
        >
          {values.length === 0 ? (
            <span className="inline-flex items-center gap-2 text-nowrap">
              <PlusIcon className="size-3" /> Expand
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-nowrap">
              <MinusIcon className="size-3" /> Collapse
            </span>
          )}{" "}
          All
        </button>
      </div>
      <div className="container-lg">
        <Accordion
          type="multiple"
          value={values}
          className="mt-8 w-full text-left"
        >
          {contentItems.map((contentItem) => (
            <AccordionItem
              value={contentItem.sectionTitle}
              key={contentItem.sectionTitle}
            >
              <AccordionTrigger
                onClick={() => toggleItem(contentItem.sectionTitle)}
              >
                {contentItem.sectionTitle}
              </AccordionTrigger>
              <AccordionContent>
                <div
                  className={contentClassName}
                  dangerouslySetInnerHTML={{
                    __html: contentItem.content,
                  }}
                ></div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}
