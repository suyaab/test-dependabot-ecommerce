import Link from "next/link";

import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import CookieConsent from "~/components/CookieConsent";
import PreLaunchEmailCollectionModalWrapper from "~/components/PreLaunchEmailCollectionModalWrapper";
import LingoLogo from "~/icons/LingoLogo";
import MadeByAbbott from "~/icons/MadeByAbbott";
import { getFeatureFlag } from "~/lib/feature-flags/server";
import cn from "~/lib/utils";
import GeolocationSelector from "./GeolocationSelector";
import SignUpForm from "./Signup";
import VeevaNumber from "./VeevaNumber";

interface Props {
  className?: string;
}

async function FooterNoEcommerce({ className }: Props) {
  const cms = ServiceLocator.getCMS();

  const { exploreLinks, legalLinks, infoText, copyright, geolocationOptions } =
    await cms.getFooterContent();

  const {
    description: { data: signupDescription },
    placeholder: { data: signupPlaceholder },
    additionalText: { data: signupAdditionalText },
  } = await cms.getSignupContent("Footer");

  return (
    <footer
      className={cn("bg-charcoal py-18 text-white", className)}
      data-analytics-location={LocationAttributes.FOOTER}
    >
      <VeevaNumber source="Footer" />
      <div className="grid-container">
        <div className="col-span-full lg:col-span-6 lg:grid lg:grid-cols-subgrid lg:gap-y-6">
          <div className="col-span-full mb-10 lg:col-span-2">
            <p className="mb-4 text-white/50">{exploreLinks.title}</p>
            <ul className="space-y-3">
              {exploreLinks.items.map((item) => (
                <li key={item.title}>
                  <Link
                    className="underline-offset-4 hover:underline"
                    href={item.link}
                    prefetch={item.prefetch}
                    data-analytics-action={item.title}
                    data-analytics-location={LocationAttributes.FOOTER}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <PreLaunchEmailCollectionModalWrapper dialogButtonClassName="underline-offset-4 hover:underline p-0 text-lg font-normal" />
              </li>
            </ul>
          </div>

          <div className="col-span-6 mb-10 hidden items-end lg:mb-0 lg:flex">
            <Link
              href="/"
              className="inline-block"
              data-analytics-action="logo"
              data-analytics-location={LocationAttributes.FOOTER}
            >
              <LingoLogo color="white" />
            </Link>
          </div>
        </div>
        <div className="col-span-full lg:col-span-6 lg:grid lg:grid-cols-subgrid lg:gap-y-6">
          <div className="col-span-full mb-10 lg:col-span-5 lg:mb-0">
            <SignUpForm
              signupDescription={signupDescription}
              signupPlaceHolder={signupPlaceholder}
              signupAdditionalText={signupAdditionalText}
              signupSource="us_footer"
              inputClassName={cn(
                "h-16 relative z-0 mb-2 w-full pl-0 pr-12 text-white",
                "border-l-0 border-r-0 border-t-0 border-b border-b-white/50 rounded-none ring-0 ring-transparent ring-opacity-0 outline-0 outline-none",
                "transition-all duration-500",
                "focus:pl-2 focus:bg-white/5 focus:border-b-white/50 focus:outline-none focus:ring-transparent",
              )}
              submitClassName="absolute -right-3 top-3 z-10 p-3 text-right transition-all duration-300 hover:-right-4"
              analyticsLocationAttribute={LocationAttributes.FOOTER}
            />
          </div>
          <div className="col-span-full mb-18 lg:mb-0 lg:flex lg:flex-col lg:justify-end">
            <MadeByAbbott color="white" className="mb-4 h-8 w-48" />
            <div
              className="whitespace-pre-line text-xs text-white/50 [&_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: infoText.data }}
            />
          </div>
        </div>
        <div className="col-span-full mb-10 lg:hidden">
          <Link href="/" className="inline-block" data-analytics-action="logo">
            <LingoLogo color="white" />
          </Link>
        </div>
        <div className="col-span-full border-t border-linen-light border-opacity-20 pt-5">
          <ul className="gap-6 space-y-3 text-xs text-white/50 lg:flex lg:space-y-0">
            {legalLinks.items.map((item) => (
              <li key={item.title}>
                <Link
                  className="underline-offset-4 hover:underline"
                  href={item.link}
                  prefetch={item.prefetch}
                  target="_blank"
                  rel="noreferrer"
                  data-analytics-action={item.title}
                  data-analytics-location={LocationAttributes.FOOTER}
                >
                  {item.title}
                </Link>
              </li>
            ))}

            <li className="flex gap-1 lg:ml-auto">
              <CookieConsent />
            </li>

            <li>
              <GeolocationSelector locations={geolocationOptions} />
            </li>
          </ul>
        </div>
        <div className="col-span-full text-xs text-white/50">
          {copyright.data}
        </div>
      </div>
    </footer>
  );
}

async function FooterEcommerce({ className }: Props) {
  const cms = ServiceLocator.getCMS();

  const {
    exploreLinks,
    supportLinks,
    connectLinks,
    legalLinks,
    infoText,
    copyright,
    geolocationOptions,
  } = await cms.getEcommerceFooterContent();

  const {
    description: { data: signupDescription },
    placeholder: { data: signupPlaceholder },
    additionalText: { data: signupAdditionalText },
  } = await cms.getSignupContent("FooterEcommerce");

  return (
    <footer
      className={cn("bg-charcoal py-18 text-white", className)}
      data-analytics-location={LocationAttributes.FOOTER}
    >
      <VeevaNumber source="Footer" />
      <div className="grid-container">
        <div className="col-span-full lg:col-span-6 lg:grid lg:grid-cols-subgrid lg:gap-y-6">
          <div className="col-span-full mb-10 lg:col-span-2">
            <p className="mb-4 text-white/50">{exploreLinks.title}</p>
            <ul className="space-y-3">
              {exploreLinks.items.map((item) => (
                <li key={item.title}>
                  <Link
                    className="underline-offset-4 hover:underline"
                    href={item.link}
                    prefetch={item.prefetch}
                    data-analytics-action={item.title}
                    data-analytics-location={LocationAttributes.FOOTER}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-full mb-10 lg:col-span-2">
            <p className="mb-4 opacity-50">{supportLinks.title}</p>
            <ul className="space-y-3">
              {supportLinks.items.map((item) => (
                <li key={item.title}>
                  <Link
                    className="underline-offset-4 hover:underline"
                    href={item.link}
                    prefetch={item.prefetch}
                    data-analytics-action={item.title}
                    data-analytics-location={LocationAttributes.FOOTER}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-full mb-16 lg:col-span-2">
            <p className="mb-4 opacity-50">{connectLinks.title}</p>
            <ul className="space-y-3">
              {connectLinks.items.map((item) => (
                <li key={item.title}>
                  <Link
                    className="underline-offset-4 hover:underline"
                    href={item.link}
                    prefetch={item.prefetch}
                    data-analytics-action={item.title}
                    data-analytics-location={LocationAttributes.FOOTER}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 mb-10 hidden items-end lg:mb-0 lg:flex">
            <Link
              href="/"
              className="inline-block"
              data-analytics-action="logo"
              data-analytics-location={LocationAttributes.FOOTER}
            >
              <LingoLogo color="white" />
            </Link>
          </div>
        </div>
        <div className="col-span-full lg:col-span-6 lg:grid lg:grid-cols-subgrid lg:gap-y-6">
          <div className="col-span-full mb-10 lg:col-span-5 lg:mb-0">
            <SignUpForm
              signupDescription={signupDescription}
              signupPlaceHolder={signupPlaceholder}
              signupAdditionalText={signupAdditionalText}
              signupSource="us_footer"
              inputClassName={cn(
                "h-16 relative z-0 mb-2 w-full pl-0 pr-12 text-white",
                "border-l-0 border-r-0 border-t-0 border-b border-b-white/50 rounded-none ring-0 ring-transparent ring-opacity-0 outline-0 outline-none",
                "transition-all duration-500",
                "focus:pl-2 focus:bg-white/5 focus:border-b-white/50 focus:outline-none focus:ring-transparent",
              )}
              submitClassName="absolute -right-3 top-3 z-10 p-3 text-right transition-all duration-300 hover:-right-4"
              analyticsLocationAttribute={LocationAttributes.FOOTER}
            />
          </div>
          <div className="col-span-full mb-18 lg:mb-0 lg:flex lg:flex-col lg:justify-end">
            <MadeByAbbott color="white" className="mb-4 h-8 w-48" />
            <div
              className="whitespace-pre-line text-xs text-white/50 [&_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: infoText.data }}
            />
          </div>
        </div>
        <div className="col-span-full mb-10 lg:hidden">
          <Link href="/" className="inline-block" data-analytics-action="logo">
            <LingoLogo color="white" />
          </Link>
        </div>
        <div className="col-span-full border-t border-linen-light border-opacity-20 pt-5">
          <ul className="gap-6 space-y-3 text-xs text-white/50 lg:flex lg:space-y-0">
            {legalLinks.items.map((item) => (
              <li key={item.title}>
                <Link
                  className="underline-offset-4 hover:underline"
                  href={item.link}
                  prefetch={item.prefetch}
                  target="_blank"
                  rel="noreferrer"
                  data-analytics-action={item.title}
                  data-analytics-location={LocationAttributes.FOOTER}
                >
                  {item.title}
                </Link>
              </li>
            ))}

            <li className="flex gap-1 lg:ml-auto">
              <CookieConsent />
            </li>

            <li>
              <GeolocationSelector
                locations={geolocationOptions}
                analyticsLocationAttribute={LocationAttributes.FOOTER}
              />
            </li>
          </ul>
        </div>
        <div className="col-span-full text-xs text-white/50">
          {copyright.data}
        </div>
      </div>
    </footer>
  );
}

export default async function Footer({ className }: Props) {
  const isUsEcommerceEnabled = await getFeatureFlag("DTC_US_EcommerceRelease");

  return isUsEcommerceEnabled
    ? FooterEcommerce({ className })
    : FooterNoEcommerce({ className });
}
