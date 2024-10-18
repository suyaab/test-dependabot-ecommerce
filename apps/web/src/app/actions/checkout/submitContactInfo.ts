"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import {
  ServiceLocator as CommerceServiceLocator,
  contactInfoSchema,
} from "@ecommerce/commerce";
import { ServiceLocator as PaymentServiceLocator } from "@ecommerce/finance";
import { getLogger } from "@ecommerce/logger";

import { ActionResponse } from "~/app/actions/types";
import getIpAddress from "~/lib/getIpAddress";
import signup from "../signup/signup";

const contactInfoFormSchema = contactInfoSchema.extend({
  purchaseConsent: z.boolean().refine((value) => value, {
    message: "You must agree to the terms and conditions",
  }),
});

type ContactInfoForm = z.infer<typeof contactInfoFormSchema>;

export async function submitContactInfo(
  cartId: string,
  cartVersion: number,
  checkoutSessionId: string,
  contactInfoForm: ContactInfoForm,
): Promise<ActionResponse> {
  const logger = getLogger({
    prefix: "web:actions:submitContactInfo",
    headers: headers(),
  });

  try {
    logger.info(
      { cartId, cartVersion, checkoutSessionId, contactInfoForm },
      "submitContactInfo",
    );

    const parse = await contactInfoFormSchema.safeParseAsync(contactInfoForm);

    if (!parse.success) {
      logger.error(
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

    const cartService = CommerceServiceLocator.getCartService();
    await cartService.updateCartContactInfo(cartId, cartVersion, contactInfo);

    logger.info("Updated cart contact info");

    const checkoutService = PaymentServiceLocator.getCheckoutService();
    const ip = getIpAddress();

    await checkoutService.updateCheckoutSessionCustomer(
      checkoutSessionId,
      ip,
      contactInfo.firstName,
      contactInfo.lastName,
      contactInfo.email,
      contactInfo.phone,
    );

    logger.info({ ip }, "Updated checkout session customer");

    await signup(
      contactInfo.email,
      "checkout",
      "COMPLETE_PURCHASE",
      contactInfo.marketingConsent,
    );

    logger.info("Finished submitting contact info");

    return {
      ok: true,
    };
  } catch (error) {
    logger.error(error, "submitContactInfo failed");
    return {
      ok: false,
      message:
        "An unexpected error occurred while saving your contact information, please try again.",
    };
  } finally {
    revalidatePath("/checkout");
  }
}
