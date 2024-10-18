import { z } from "zod";

import { US_INPUT_LIMITS, validatePhone } from "@ecommerce/utils";

import checkIfCustomerExists from "~/app/actions/checkIfCustomerExists";

export const firstNameSchema = z
  .string()
  .trim()
  .min(1, "First name is required")
  .max(US_INPUT_LIMITS.name, "First name is too long");

export const lastNameSchema = z
  .string()
  .trim()
  .min(1, "Last name is required")
  .max(US_INPUT_LIMITS.name, "Last name is too long");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(US_INPUT_LIMITS.email, "Invalid email")
  .email("Invalid email address")
  .refine(async (email) => {
    const exists = await checkIfCustomerExists(email);
    return !exists;
  }, "Email already in use, please log in. <a href='https://www.hellolingo.com/account' target='_blank' class='text-blue underline hover:no-underline'>Log in</a>");

export const phoneNumberSchema = z
  .string()
  .trim()
  .refine((phone) => validatePhone(phone), "Invalid phone number");

export const marketingConsentSchema = z.boolean();

export const purchaseConsentSchema = z
  .boolean()
  .refine((value) => value, "You need to agree to terms and conditions");

export const customerContactInfoSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  phone: phoneNumberSchema,
  marketingConsent: marketingConsentSchema,
  purchaseConsent: purchaseConsentSchema,
});

export type CustomerContactInfo = z.infer<typeof customerContactInfoSchema>;
