"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { getLogger } from "@ecommerce/logger";
import {
  addressCountryCodeSchema,
  AddressFormData,
  addressFormSchema,
  SchemaException,
  stateSchema,
} from "@ecommerce/utils";

import { env } from "~/env";
import { ActionErrorResponse, ActionSuccessResponse } from "../types";

type ValidateAddressActionResponse =
  | (ActionSuccessResponse & GoogleAddressValidationResponse)
  | ActionErrorResponse;

export async function validateAddress(
  address: AddressFormData,
): Promise<ValidateAddressActionResponse> {
  const logger = getLogger({
    prefix: "web:actions:validateShippingAddress",
    headers: headers(),
  });

  try {
    logger.info(
      {
        shippingAddressData: address,
      },
      "Validate shipping address",
    );

    const parse = addressFormSchema.safeParse(address);

    if (!parse.success) {
      logger.error(
        { errors: parse.error.errors },
        "Shipping address schema validation failed",
      );

      return {
        ok: false,
        message:
          "The shipping address provided is invalid, please check the form and try again.",
      };
    }

    const addressValidation = await googleValidateAddress(address);

    if (addressValidation.status === "fix") {
      logger.info("Address Validation: needs to fix");

      return {
        ok: true,
        status: addressValidation.status,
      };
    }

    if (addressValidation.status === "confirm") {
      logger.info("Address Validation: needs to confirm");

      return {
        ok: true,
        status: addressValidation.status,
        recommendedAddress: addressValidation.recommendedAddress,
      };
    }

    logger.info("Address Validation: no action required");

    return {
      ok: true,
      status: addressValidation.status,
    };
  } catch (error) {
    logger.error(error, "Failed to validate shipping address");

    return {
      ok: false,
      message:
        "An unexpected error occurred while validating your address, please try again later.",
    };
  }
}

/**
 *  GOOGLE ADDRESS VALIDATION RESPONSE
 */

interface InvalidAddress {
  status: "fix";
}
interface ImproveAddress {
  status: "confirm";
  recommendedAddress: AddressFormData;
}
interface ValidAddress {
  status: "accept";
}

type GoogleAddressValidationResponse =
  | InvalidAddress
  | ImproveAddress
  | ValidAddress;

/**
 * GOOGLE API RESPONSE SCHEMAS
 */
const googleAddressBodySchema = z.object({
  addressLines: z.array(z.string()),
  locality: z.string(),
  administrativeArea: stateSchema.optional(),
  postalCode: z.string(),
  regionCode: addressCountryCodeSchema,
});

const googleAddressValidationSuccessSchema = z.object({
  result: z.object({
    verdict: z.object({
      validationGranularity: z.string(),
      geocodeGranularity: z.string(),
      addressComplete: z.boolean().optional(),
      hasUnconfirmedComponents: z.boolean().optional(),
      hasInferredComponents: z.boolean().optional(),
      hasReplacedComponents: z.boolean().optional(),
    }),
    address: z.object({
      postalAddress: googleAddressBodySchema,
    }),
  }),
});

const googleAddressValidationErrorSchema = z.object({
  error: z.object({
    code: z.number(),
    message: z.string(),
  }),
});

type GoogleAddressValidationSuccess = z.infer<
  typeof googleAddressValidationSuccessSchema
>;

const googleAddressValidationResponseSchema = z.union([
  googleAddressValidationSuccessSchema,
  googleAddressValidationErrorSchema,
]);

function translateGoogleAddress(
  googleAddress: GoogleAddressValidationSuccess,
): AddressFormData {
  const {
    address: {
      postalAddress: {
        addressLines,
        administrativeArea,
        locality,
        postalCode,
        regionCode,
      },
    },
  } = googleAddress.result;

  const state = regionCode === "PR" ? "PR" : administrativeArea;
  const countryCode = regionCode === "PR" ? "US" : regionCode;

  return addressFormSchema.parse({
    addressLine1: addressLines[0],
    addressLine2: addressLines[1],
    state: state,
    city: locality,
    postalCode: postalCode,
    countryCode: countryCode,
  });
}

/**
 * Validates the given address using the Google Address Validation API.
 *
 * @param address - The address to be validated.
 * @returns A promise that resolves to one of the following:
 * - { status: "fix" }: Issues were found from the inputted address and the user needs to fix them.
 * - { status: "confirm", recommendedAddress: AddressFormData }: The address was found credible but not fully verified, and the user needs to confirm the input. The recommendedAddress field contains the suggested address.
 * - { status: "accept" }: The address came back fully credible and accurate.
 * @throws If there is an error while validating the address.
 */
async function googleValidateAddress(
  address: AddressFormData,
): Promise<GoogleAddressValidationResponse> {
  try {
    const addressValidationResponse = await fetch(
      `https://addressvalidation.googleapis.com/v1:validateAddress?key=${env.GOOGLE_VALIDATION_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: {
            addressLines: [address?.addressLine1],
            locality: address?.city,
            postalCode: address?.postalCode,
            regionCode: address?.state === "PR" ? "PR" : address?.countryCode,
            administrativeArea:
              address?.state !== "PR" ? address?.state : undefined,
          },
        }),
      },
    );
    const respJson: unknown = await addressValidationResponse.json();

    const googleValidationResponse =
      googleAddressValidationResponseSchema.safeParse(respJson);

    if (!googleValidationResponse.success) {
      throw new SchemaException(
        "Google Address validation schema failed",
        googleValidationResponse.error,
      );
    }

    if ("error" in googleValidationResponse.data) {
      throw new Error(
        `Google Address validation failed: ${googleValidationResponse.data.error.message}`,
      );
    }

    const verdict = googleValidationResponse.data.result.verdict;

    if (
      verdict.validationGranularity === "OTHER" ||
      verdict.addressComplete === false
    ) {
      return {
        status: "fix",
      };
    }

    if (
      verdict.hasUnconfirmedComponents === true ||
      verdict.hasReplacedComponents === true
    ) {
      const recommendedAddress = translateGoogleAddress(
        googleValidationResponse.data,
      );
      return { status: "confirm", recommendedAddress };
    }

    return { status: "accept" };
  } catch (error) {
    throw new Error("Error validating google address", { cause: error });
  }
}
