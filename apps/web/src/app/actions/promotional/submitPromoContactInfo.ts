"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  ServiceLocator as CommerceServiceLocator,
  contactInfoSchema,
} from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";

import { ActionResponse } from "~/app/actions/types";
import signup from "../signup/signup";

const sampleContactInfoFormSchema = contactInfoSchema.extend({
  purchaseConsent: z.boolean().refine((value) => value, {
    message: "You must agree to the terms and conditions",
  }),
});

type SampleContactInfoForm = z.infer<typeof sampleContactInfoFormSchema>;

export async function submitPromoContactInfo(
  cartId: string,
  cartVersion: number,
  contactInfoForm: SampleContactInfoForm,
): Promise<ActionResponse> {
  const logger = getLogger({
    prefix: "web:promotional:submitSampleContactInfo",
  });

  try {
    logger.info({ contactInfoForm });

    const parse =
      await sampleContactInfoFormSchema.safeParseAsync(contactInfoForm);

    if (!parse.success) {
      logger.debug(
        parse.error.errors,
        "Contact information schema validation failed",
      );

      return {
        ok: false,
        message:
          "The contact information provided is invalid, please check the form and try again.",
      };
    }

    const contactInfo = parse.data;

    // TODO: add new signup source for sample
    await signup(
      contactInfo.email,
      "checkout",
      "COMPLETE_PURCHASE",
      contactInfo.marketingConsent,
    );

    const cartService = CommerceServiceLocator.getCartService();

    const cart = await cartService.updateCartContactInfo(
      cartId,
      cartVersion,
      contactInfo,
    );

    logger.info({ cart, cartId, cartVersion }, "submitContactInfo");

    revalidatePath(`/promotional/${cart.lineItems[0]?.product.sku}`);

    return {
      ok: true,
    };
  } catch (error) {
    logger.error(
      error,
      "Error submitting contact information for promotional page",
    );
    return {
      ok: false,
      message:
        "An error occurred while submitting your contact information. Please try again.",
    };
  }
}
