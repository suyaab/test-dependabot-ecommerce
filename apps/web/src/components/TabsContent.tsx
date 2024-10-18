"use client";

import { ReactNode, useState } from "react";

import cn from "~/lib/utils";

export default function TabsContent({
  tabNames,
  analyticsLocationAttribute,
  children,
}: {
  tabNames: string[];
  analyticsLocationAttribute?: string;
  children?: ReactNode[];
}) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <>
      {/* Tabs */}
      <div className="mb-7 h-14 overflow-y-clip">
        <div className="h-20 overflow-x-auto max-lg:mx-[var(--sideGap)]">
          <div className="mx-auto lg:w-[1440px] lg:px-[var(--sideGapDesktop)]">
            <ul className="inline-flex h-14 min-w-full justify-between gap-5 border-b-[3px] lg:gap-16">
              {tabNames.map((tab, index) => (
                <li
                  key={tab}
                  onClick={() => setActiveTabIndex(index)}
                  className={cn(
                    "relative flex cursor-pointer items-center justify-center whitespace-nowrap p-4 max-lg:text-sm",
                    "opacity-50 transition-opacity duration-300 hover:opacity-75",
                    "after:absolute after:-bottom-[3px] after:left-0 after:w-full after:border-b-[3px] after:transition-all after:duration-300 after:content-['']",
                    {
                      "opacity-100 after:border-charcoal hover:opacity-100":
                        index === activeTabIndex,
                    },
                  )}
                  data-analytics-action={`${tab}`}
                  data-analytics-location={analyticsLocationAttribute}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="container-full relative">
        {children?.map((tabContentNode, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 -z-10 w-full opacity-0 transition-all duration-200",
              {
                "opacity-300 relative z-0": index === activeTabIndex,
              },
            )}
          >
            {tabContentNode}
          </div>
        ))}
      </div>
    </>
  );
}
