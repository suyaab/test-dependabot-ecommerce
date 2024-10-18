import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

import MadeByAbbott from "~/icons/MadeByAbbott";

export default async function PromoBar() {
  const cms = ServiceLocator.getCMS();
  const { data } = await cms.getTextContent("PromoBar");

  return (
    <div
      className="relative h-[var(--promoBarHeight)] bg-charcoal"
      data-analytics-location={LocationAttributes.BANNER}
    >
      <div className="container flex h-full items-center justify-end">
        <div
          className="grow text-xs text-linen-light max-lg:whitespace-pre lg:pl-[114px] lg:text-center lg:text-base"
          dangerouslySetInnerHTML={{ __html: data }}
        />
        <MadeByAbbott className="h-4 w-[114px] shrink-0" />
      </div>
    </div>
  );
}
