"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ActionAttributes, LocationAttributes } from "@ecommerce/analytics";
import {
  Button as ButtonType,
  EmailsCollectionModalContent,
} from "@ecommerce/cms";

import { Sheet, SheetContent, SheetTrigger } from "~/components//Sheet";
import EmailsCollectionModal from "~/components/EmailsCollectionModal";
import Hyperlink from "~/components/Hyperlink";
import useScrollDirection from "~/hooks/useScrollDirection";
import LingoLogo from "~/icons/LingoLogo";
import MenuIcon from "~/icons/MenuIcon";
import cn from "~/lib/utils";

interface MenuItem {
  title: string;
  link: string;
}

interface NavigationProps {
  items: MenuItem[];
  emailCollectionModalContent: EmailsCollectionModalContent;
  button?: ButtonType;
  className?: string;
  children?: ReactNode[];
  isUsEcommerceEnabled: boolean;
}

export default function Navigation({
  className,
  emailCollectionModalContent,
  items,
  button,
  children,
  isUsEcommerceEnabled,
}: NavigationProps) {
  const scrollDirection = useScrollDirection();
  const [style, setStyle] = useState("variant");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const menuChangeTrigger = document.querySelector("[data-menu-change]");

    const headerHeight = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--navigationHeightDesktop");

    const rootMargin = `-${headerHeight}  0px 2000px`;

    const options = {
      rootMargin,
    };

    const onIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const style = entry.isIntersecting ? "transparent" : "light";
        setStyle(style);
      });
    };

    const observer = new IntersectionObserver(onIntersect, options);

    if (menuChangeTrigger) {
      observer.observe(menuChangeTrigger);
    } else {
      setStyle("light");
    }
  }, [pathname]);

  return (
    <nav
      className={cn(
        "sticky top-0 flex w-full items-end transition-all duration-500",
        "h-[var(--navigationHeight)] lg:h-[var(--navigationHeightDesktop)]",
        scrollDirection === "down"
          ? "-top-[var(--navigationHeight)] lg:-top-[var(--navigationHeightDesktop)]"
          : "top-0",
        className,
      )}
      data-analytics-location={LocationAttributes.NAVIGATION}
    >
      {/* FIXME: Check modal veeva child after launch */}
      {children}
      <div className="container max-lg:px-2">
        <div
          className={cn(
            "flex items-center justify-between rounded-full bg-linen-light/60 p-3 px-6 transition-all duration-500 lg:-ml-9 lg:-mr-5 lg:p-4 lg:pl-9",
            style === "light" && "backdrop-blur-sm",
            style === "transparent" && "backdrop-blur-[2px]",
          )}
        >
          <Link
            href="/"
            data-analytics-action={ActionAttributes.LOGO_CTA}
            data-analytics-location={LocationAttributes.NAVIGATION}
          >
            <LingoLogo className="mt-1 text-white" />
          </Link>
          <ul className="hidden gap-8 lg:flex">
            {items.map((item) => (
              <li key={item.title}>
                <Link
                  key={item.title}
                  href={item.link}
                  data-analytics-action={item.title}
                  data-analytics-location={LocationAttributes.NAVIGATION}
                  className="border-b-2 border-transparent py-1 font-semibold transition-all duration-300 hover:border-charcoal"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1">
            {button != null && isUsEcommerceEnabled && (
              <Hyperlink
                text={button.data.text}
                url={button.data.url}
                variant={button.data.variant}
                className="py-3"
                analyticsActionAttribute={button.data.text}
                analyticsLocationAttribute={LocationAttributes.NAVIGATION}
              />
            )}

            {button != null && !isUsEcommerceEnabled && (
              <EmailsCollectionModal
                modalContent={emailCollectionModalContent}
                dialogButtonClassName="py-3"
              />
            )}

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger>
                <MenuIcon className="-mr-3 h-10 w-10 cursor-pointer p-2 text-white lg:hidden" />
              </SheetTrigger>
              <SheetContent className="container w-full bg-white pb-28 pt-1.5 sm:max-w-full">
                <div className="mb-6 flex h-[var(--navigationHeight)] items-center">
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    data-analytics-action={ActionAttributes.LOGO_CTA}
                    data-analytics-location={LocationAttributes.NAVIGATION}
                  >
                    <LingoLogo className="text-charcoal" />
                  </Link>
                </div>
                <ul>
                  {items.map((item) => (
                    <li key={item.title}>
                      <Link
                        key={item.title}
                        href={item.link}
                        data-analytics-action={item.title}
                        data-analytics-location={LocationAttributes.NAVIGATION}
                        className="subtitle block py-4 font-semibold"
                        onClick={() => setOpen(false)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                {button != null && isUsEcommerceEnabled && (
                  <Hyperlink
                    text={button.data.text}
                    url={button.data.url}
                    variant={button.data.variant}
                    data-analytics-action={button.data.text}
                    data-analytics-location={LocationAttributes.NAVIGATION}
                    className="absolute bottom-8 left-[var(--sideGap)] right-[var(--sideGap)] text-center lg:left-[var(--sideGapDesktop)] lg:right-[var(--sideGapDesktop)]"
                  />
                )}

                {button != null && !isUsEcommerceEnabled && (
                  <EmailsCollectionModal
                    modalContent={emailCollectionModalContent}
                    dialogButtonClassName="absolute bottom-8 left-[var(--sideGap)] right-[var(--sideGap)] text-center lg:left-[var(--sideGapDesktop)] lg:right-[var(--sideGapDesktop)]"
                    handleOpenButtonClick={() => setOpen(false)}
                  />
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
