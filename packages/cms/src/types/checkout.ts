import { z } from "zod";

export const CheckoutSectionSchema = z.object({
  data: z.object({
    CONTACT: z.string(),
    SHIPPING: z.string(),
    BILLING: z.string(),
  }),
});

export type CheckoutSectionContent = z.infer<typeof CheckoutSectionSchema>;

export const PromotionalCheckoutSectionSchema = z.object({
  data: z.object({
    DISCOUNT_CODE: z.string(),
    CONTACT: z.string(),
    SHIPPING: z.string(),
  }),
});

export type PromotionalCheckoutSectionContent = z.infer<
  typeof PromotionalCheckoutSectionSchema
>;
