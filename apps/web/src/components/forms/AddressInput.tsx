import { useEffect, useRef, useState } from "react";

import {
  addressCountryCodeSchema,
  AddressFormData,
  State,
  stateSchema,
} from "@ecommerce/utils";

import ControlledDropdown from "~/components/forms/ControlledDropdown";
import ControlledTextInput from "~/components/forms/ControlledTextInput";
import useGooglePlaceAPI from "~/hooks/useGooglePlaceAPI";

// TODO: how should we best handle this with 1. a CMS and 2. with multiple locales
const stateOptions: { value: State; label: string }[] = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DC", label: "District of Columbia" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "PR", label: "Puerto Rico" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export interface AddressInputProps {
  name: string;
  supportedCountries: string[] | null;
  addressToSet?: AddressFormData;
}

export default function AddressInput({
  name,
  supportedCountries,
  addressToSet,
}: AddressInputProps) {
  // TODO: maybe this can be refactored to eliminate state and ONLY use form state
  // the `useFormContext` provides methods like `setValue` which could be used for
  // the `useGooglePlacesAPI`
  //
  // if we could do the following, how do we deal with nested input `name`s
  // const { getValues, setValue } = useFormContext<AddressFormData>();

  const [address, setAddress] = useState<AddressFormData>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    state: "",
    countryCode: "US", // TODO: Default Country for other locales
  });

  useEffect(() => {
    if (addressToSet != null) {
      setAddress(addressToSet);
    }
  }, [addressToSet]);

  const addressLine1Ref = useRef<HTMLInputElement>(null);
  const addressLine2Ref = useRef<HTMLInputElement>(null);

  useGooglePlaceAPI(
    address,
    setAddress,
    supportedCountries,
    addressLine1Ref,
    addressLine2Ref,
  );

  return (
    <>
      {/* Address Line 1 */}
      <div>
        <ControlledTextInput
          ref={addressLine1Ref}
          id="addressLine1"
          name={`${name}.addressLine1`}
          label="Street Address"
          value={address.addressLine1}
          onChange={(value) => setAddress({ ...address, addressLine1: value })}
          autoComplete="off"
        />
      </div>

      {/* Address Line 2 */}
      <div>
        <ControlledTextInput
          ref={addressLine2Ref}
          id="addressLine2"
          name={`${name}.addressLine2`}
          label="Apartment, suite, etc. (optional)"
          value={address.addressLine2 ?? ""}
          onChange={(value) => setAddress({ ...address, addressLine2: value })}
          autoComplete="address-line2"
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-x-6 lg:grid-cols-2">
        {/* City */}
        <ControlledTextInput
          id="city"
          label="City"
          name={`${name}.city`}
          value={address.city}
          onChange={(value) => setAddress({ ...address, city: value })}
          autoComplete="address-level2"
          className="lg:grow lg:basis-1/2"
        />

        {/*Region*/}
        <ControlledDropdown
          name={`${name}.state`}
          label="State"
          value={address.state}
          options={stateOptions}
          placeholder="Select a state"
          onChange={(value) => {
            setAddress({ ...address, state: stateSchema.parse(value) });
          }}
        />

        {/*ZipCode*/}
        <ControlledTextInput
          id="postalCode"
          label="ZIP Code"
          name={`${name}.postalCode`}
          value={address.postalCode}
          onChange={(value) => setAddress({ ...address, postalCode: value })}
          autoComplete="postal-code"
          className="lg:grow lg:basis-1/2"
        />

        {/*Country*/}
        <ControlledTextInput
          id="country"
          label="Country"
          name={`${name}.countryCode`}
          value={address.countryCode ?? ""}
          onChange={(value) =>
            setAddress({
              ...address,
              countryCode: addressCountryCodeSchema.parse(value),
            })
          }
          autoComplete="country"
          disabled
          className="lg:grow"
        />
      </div>
    </>
  );
}
