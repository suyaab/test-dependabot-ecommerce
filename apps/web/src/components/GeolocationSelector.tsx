import Link from "next/link";

import { AddressCountryCode } from "@ecommerce/utils";

import Icon, { IconNamesEnum } from "~/components/Icon";
import HoverPopover from "./HoverPopover";

interface Location {
  countryCode: AddressCountryCode;
  label: string;
  url: string;
  iconName: string;
}

interface GeolocationSelectorProps {
  locations: Location[];
  analyticsLocationAttribute?: string;
}

export default function GeolocationSelector({
  locations = [],
  analyticsLocationAttribute,
}: GeolocationSelectorProps) {
  const currentCountryCode = "US";
  // TODO: Get country code from page url when UK and US app merge
  const currentLocation =
    locations.find((location) => location.countryCode === currentCountryCode) ??
    locations[0];

  const locationsToSelect = locations.filter(
    (location) => location.countryCode !== currentCountryCode,
  );

  if (currentLocation == null) {
    return null;
  }

  const trigger = (
    <div className="flex items-center gap-x-1.5">
      <Icon name={currentLocation.iconName as IconNamesEnum} />
      <span className="text-xs text-white">{currentLocation.label}</span>
      <Icon name="ArrowUp" color="white" className="size-2.5 rotate-180" />
    </div>
  );

  const content = (
    <>
      {locationsToSelect.map((location) => (
        <Link
          key={location.label}
          href={location.url}
          className="flex bg-charcoal/5 px-4 py-2"
          data-analytics-location={analyticsLocationAttribute}
          data-analytics-action={`geolocationSelect-${location.countryCode}`}
        >
          <Icon name={location.iconName as IconNamesEnum} className="mr-1" />
          <span className="text-charcoal">{location.label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <div className="flex">
      <HoverPopover
        trigger={trigger}
        content={content}
        align="end"
        className="px-0 py-2"
      />
    </div>
  );
}
