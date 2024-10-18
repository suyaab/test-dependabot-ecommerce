"use client";

import { useState } from "react";
import Image from "next/image";

import { MultipleContentItems, ResponsiveImageContent } from "@ecommerce/cms";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/Accordion";
import { Duplex, DuplexHalf } from "~/components/Duplex";
import cn from "~/lib/utils";
import ContentBlock from "./ContentBlock";

interface DuplexAccordionItem {
  accordionTitle: {
    title: string;
    icon: ResponsiveImageContent;
  };
  accordionContent: string;
  accordionImage: ResponsiveImageContent;
}

interface DuplexAccordionProps {
  commonHTML?: string;
  items: DuplexAccordionItem[];
  additionalItems?: MultipleContentItems;
  analyticsLocationAttribute?: string;
}

export default function DuplexAccordion({
  commonHTML,
  items,
  additionalItems = [],
  analyticsLocationAttribute,
}: DuplexAccordionProps) {
  const [value, setValue] = useState("item-0");

  return (
    <Duplex>
      <DuplexHalf className="max-lg:no-x-gap col-span-full flex flex-col items-stretch justify-center lg:col-span-5 lg:items-start">
        {commonHTML != null && (
          <div
            className="lg:[&>p]:subtitle mb-12 space-y-6 max-lg:px-[var(--sideGap)] [&>p]:opacity-60 [&_h2]:font-semibold"
            dangerouslySetInnerHTML={{
              __html: commonHTML,
            }}
          />
        )}
        <Accordion
          type="single"
          defaultValue={value}
          onValueChange={(value: string) => setValue(value)}
        >
          {items.map((item, idx) => (
            <AccordionItem
              key={item.accordionTitle.title}
              value={`item-${idx}`}
              className="mb-6 border-none"
            >
              <AccordionTrigger
                className="mb-3 gap-5 py-0 text-start font-semibold text-2xl max-lg:px-[var(--sideGap)]"
                data-analytics-action={`expandToggle-${item.accordionTitle.title}`}
                data-analytics-location={analyticsLocationAttribute}
              >
                <div className="flex items-center justify-between gap-5">
                  {item.accordionTitle?.icon?.url && (
                    <Image
                      src={item.accordionTitle.icon.url}
                      alt={item.accordionTitle.icon.alt}
                      width={item.accordionTitle.icon.width}
                      height={item.accordionTitle.icon.height}
                      className="size-6"
                    />
                  )}{" "}
                  {item.accordionTitle.title}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 [&>div]:pl-18 [&>div]:max-lg:pr-8 [&>div]:lg:pl-11">
                <div
                  className="text-charcoal/70"
                  dangerouslySetInnerHTML={{ __html: item.accordionContent }}
                />
                {item.accordionImage.url !== null && (
                  <Image
                    src={item.accordionImage.url}
                    width={item.accordionImage.desktopWidth}
                    height={item.accordionImage.desktopHeight}
                    alt={item.accordionImage.alt}
                    className="mb-8 mt-16 w-full lg:hidden"
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="max-lg:container">
          <ContentBlock
            items={additionalItems}
            analyticsLocationAttribute={analyticsLocationAttribute}
          />
        </div>
      </DuplexHalf>
      <DuplexHalf className="lg:no-r-gap relative max-lg:hidden lg:col-span-6 lg:col-start-7">
        {items?.[0] != null && (
          <div
            style={{
              aspectRatio:
                items[0].accordionImage.desktopWidth /
                items[0].accordionImage.desktopHeight,
            }}
          >
            {items.map((item, idx) => {
              if (item.accordionImage.desktopUrl !== null)
                return (
                  <Image
                    key={item.accordionImage.url}
                    src={item.accordionImage.desktopUrl}
                    width={item.accordionImage.desktopWidth}
                    height={item.accordionImage.desktopHeight}
                    alt={item.accordionImage.alt}
                    className={cn(
                      "absolute opacity-0 transition-opacity duration-200 max-lg:hidden",
                      {
                        "opacity-1": value === `item-${idx}`,
                      },
                    )}
                  />
                );
            })}
          </div>
        )}
      </DuplexHalf>
    </Duplex>
  );
}
