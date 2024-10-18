import { z } from "zod";

export const AccountManagementOrderSummaryContentSchema = z.object({
  typename: z.literal("AccountManagementOrderSummary"),
  discountCodeForm: z.object({
    inputPlaceholder: z.string(),
    buttonLabel: z.object({
      apply: z.string(),
      remove: z.string(),
    }),
    title: z.string(),
  }),
  totalSectionLabels: z.object({
    subtotalLabel: z.string(),
    discountLabel: z.string(),
    taxLabel: z.string(),
    shippingLabel: z.string(),
    savingsLabel: z.string(),
    estimatedTotalLabel: z.string(),
  }),
  subscriptionTotalLabel: z.string(),
  subscriptionTooltip: z.string(),
  backButtonText: z.string(),
  pageTitle: z.string(),
  paymentAuthorizationInfo: z.object({
    notice: z.string(),
    details: z.string(),
  }),
  shippingSection: z.object({
    title: z.string(),
    buttonText: z.string(),
  }),
  paymentSection: z.object({
    title: z.string(),
    buttonText: z.string(),
  }),
  subscriptionAcknowledgement: z.object({
    text: z.string(),
    lingoPrivacyNoticeText: z.string(),
    lingoPrivacyNoticeUrl: z.string(),
  }),
  orderButtonText: z.string(),
});

export type AccountManagementOrderSummaryContent = z.infer<
  typeof AccountManagementOrderSummaryContentSchema
>;
