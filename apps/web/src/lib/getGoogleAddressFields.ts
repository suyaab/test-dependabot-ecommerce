export interface GoogleAddressFields {
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
}

/**
 * Extracts address fields from a Google Maps PlaceResult object.
 *
 * @param place - the Google Maps PlaceResult object containing address details.
 * @returns {object} the extracted address fields.
 */
export default function getGoogleAddressFields(
  place: google.maps.places.PlaceResult,
): GoogleAddressFields {
  let addressLine1 = "";
  let postalCode = "";
  let countryCode = "";
  let city = "";
  let state = "";

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  // place.address_components are google.maps.GeocoderAddressComponent objects
  // which are documented at http://goo.gle/3l5i5Mr
  // Extract the address components from the place object
  if (place.address_components) {
    for (const component of place.address_components) {
      const types = component.types;
      if (types.includes("street_number")) {
        addressLine1 = `${component.long_name} ${addressLine1}`;
      }
      if (types.includes("route")) {
        addressLine1 += component.long_name;
      }
      if (types.includes("postal_code")) {
        postalCode = `${component.long_name}${postalCode}`;
      }
      if (types.includes("postal_code_suffix")) {
        postalCode = `${postalCode}-${component.long_name}`;
      }
      if (types.includes("country")) {
        countryCode = component.short_name;
      }
      if (types.includes("locality")) {
        city = component.long_name;
      }
      if (types.includes("administrative_area_level_1")) {
        state = component.short_name;
      }
    }
  }

  // TODO: is there a better way to handle these one-off cases
  if (countryCode === "PR") {
    countryCode = "US";
    state = "PR";
  }

  return {
    addressLine1,
    city,
    state,
    postalCode,
    countryCode,
  };
}
