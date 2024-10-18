import { z } from "zod";

import { addressSchema, stateSchema } from "@ecommerce/utils";

// TODO: (gifting) when we add gifting we will make all addresses have name fields
// Thus we won't need this specific field for billing address
export const billingAddressFormDataSchema = addressSchema
  .extend({
    state: z.union([stateSchema, z.literal("")]),
  })
  .refine((form) => form.state !== "", {
    path: ["state"],
    message: "State is required",
  });

export const billingPaymentFormSchema = z.object({
  billingAddress: billingAddressFormDataSchema.optional(),
});

export type BillingPaymentFormData = z.infer<typeof billingPaymentFormSchema>;
