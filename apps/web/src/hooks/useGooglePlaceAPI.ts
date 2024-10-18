import {
  Dispatch,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Loader } from "@googlemaps/js-api-loader";

import {
  addressCountryCodeSchema,
  AddressFormData,
  stateSchema,
} from "@ecommerce/utils";

import { env } from "~/env";
import getGoogleAddressFields from "~/lib/getGoogleAddressFields";

const GOOGLE_ERRORS = {
  LOAD_ERROR: "Unable to load Google Maps API, check API key or domain",
  ATTACH_ERROR: "Unable to attach Google Places Autocomplete widget",
};

// TODO: look into Google Places Autocomplete NEW API
// https://developers.google.com/maps/documentation/javascript/place-autocomplete-overview

/**
 * Custom hook that integrates with the Google Place API to handle address autocomplete and updates the address fields.
 * https://developers.google.com/maps/documentation/javascript/place-autocomplete
 *
 * @param address state of address
 * @param setAddress dispatch function to update address
 * @param supportedCountries list of country codes that dialog should allow
 * @param addressLine1Ref address line 1 element to attach Google Places Autocomplete widget
 * @param addressLine2Ref address line 2 element to focus user after a Place selection
 */
export default function useGooglePlaceAPI(
  address: AddressFormData,
  setAddress: Dispatch<AddressFormData>,
  supportedCountries: string[] | null,
  addressLine1Ref?: RefObject<HTMLInputElement | null>,
  addressLine2Ref?: RefObject<HTMLInputElement | null>,
) {
  const [loading, setLoading] = useState<boolean>(true);
  const [valid, setValid] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // 4. Handle place changed event
  const placeChanged = useCallback(() => {
    const place = autoCompleteRef.current?.getPlace();
    if (place != null) {
      const { addressLine1, city, state, postalCode, countryCode } =
        getGoogleAddressFields(place);

      setAddress({
        ...address,
        addressLine1,
        city,
        state: stateSchema.parse(state),
        postalCode,
        countryCode: addressCountryCodeSchema.parse(countryCode),
      });

      // set cursor focus on address line 2 to encourage entry of potential apartment, unit, or floor number
      addressLine2Ref?.current?.focus();
    }
  }, [address, setAddress, addressLine2Ref]);

  // 3. Initialize Google Places Autocomplete and attach listeners
  const initializeAutocomplete = useCallback(() => {
    if (initialized === false) {
      try {
        if (addressLine1Ref?.current != null) {
          autoCompleteRef.current = new window.google.maps.places.Autocomplete(
            addressLine1Ref.current,
          );
          autoCompleteRef.current.setFields(["address_components"]);
          autoCompleteRef.current.setComponentRestrictions({
            country: supportedCountries ?? [],
          });
          autoCompleteRef.current.addListener("place_changed", placeChanged);
          setInitialized(true);
        }
      } catch {
        setError(new Error(GOOGLE_ERRORS?.ATTACH_ERROR));
      }
    }
  }, [addressLine1Ref, supportedCountries, placeChanged, initialized]);

  // 2. Validate the Google places API
  // Note: If this step fails, we don't want to continue with the rest of the initialization
  // because the Google Places API disables our input field if there are issues
  useEffect(() => {
    const validateGooglePlacesAPI = async () => {
      try {
        if (valid || loading || initialized || error != null) {
          return;
        }

        const testSvc = new window.google.maps.places.AutocompleteService();
        const testReq = { input: " " };
        const predictionResults = await testSvc.getPlacePredictions(testReq);

        if (predictionResults == null) {
          setError(new Error(GOOGLE_ERRORS?.LOAD_ERROR));
          return;
        }

        setValid(true);
        initializeAutocomplete();
      } catch {
        const error = new Error(GOOGLE_ERRORS?.LOAD_ERROR);
        setError(error);
      }
    };
    void validateGooglePlacesAPI();
  }, [loading, initialized, valid, error, initializeAutocomplete]);

  // 1. Import the Google places JS library
  useEffect(() => {
    const importGooglePlacesLibrary = async () => {
      try {
        if (window.google?.maps?.places != null) {
          setLoading(false);
          return;
        }

        if (loading === false) {
          return;
        }

        const apiKey = env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
        const loader = new Loader({
          apiKey,
          id: "googleMaps",
          libraries: ["places"],
        });

        await loader.importLibrary("places");

        if (window.google?.maps?.places == null) {
          setError(new Error(GOOGLE_ERRORS?.LOAD_ERROR));
        }

        setLoading(false);
      } catch {
        setError(new Error(GOOGLE_ERRORS?.LOAD_ERROR));
        setLoading(false);
      }
    };
    void importGooglePlacesLibrary();
  }, [loading, valid]);

  return { loading, valid, initialized, error };
}
