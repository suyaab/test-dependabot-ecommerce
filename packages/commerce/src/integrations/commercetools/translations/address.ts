import { Address as CTAddress } from "@commercetools/platform-sdk";

import {
  Address,
  addressCountryCodeSchema,
  stateSchema,
} from "@ecommerce/utils";

export default function translateCTAddress(
  ctAddress: CTAddress,
): Partial<Address> | undefined {
  // Phone number is part of a CT address, so we dont want to translate an address with only a phone number
  if (
    (ctAddress.firstName == null || ctAddress.firstName == "") &&
    (ctAddress.lastName == null || ctAddress.lastName == "") &&
    (ctAddress.streetName == null || ctAddress.streetName == "") &&
    (ctAddress.additionalStreetInfo == null ||
      ctAddress.additionalStreetInfo == "") &&
    (ctAddress.state == null || ctAddress.state == "") &&
    (ctAddress.city == null || ctAddress.city == "") &&
    (ctAddress.postalCode == null || ctAddress.postalCode == "")
  ) {
    return;
  }

  const stateParse = stateSchema.safeParse(ctAddress.state);
  if (!stateParse.success) {
    throw new Error(`Cannot translate address: state ${ctAddress.state}`);
  }

  const countryParse = addressCountryCodeSchema.safeParse(ctAddress.country);
  if (!countryParse.success) {
    throw new Error(`Cannot translate address: country ${ctAddress.country}`);
  }

  return {
    firstName: ctAddress.firstName,
    lastName: ctAddress.lastName,
    addressLine1: ctAddress.streetName,
    addressLine2: ctAddress.additionalStreetInfo,
    state: stateParse.data,
    city: ctAddress.city,
    postalCode: ctAddress.postalCode,
    countryCode: countryParse.data,
  };
}
