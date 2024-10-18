import { z } from "zod";

export interface PrivacyNoticeItem {
  title: string;
  content: string;
}

const accordionSchema = z.object({
  sectionTitle: z.string(),
  content: z.string(),
});

export type LegalAccordionContentItem = z.infer<typeof accordionSchema>;

export const legalContentContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  lastUpdatedText: z.string(),
  downloadLink: z
    .object({
      text: z.string().optional(),
      url: z.string().optional(),
    })
    .optional(),
  description: z.string().optional(),
  accordionItems: z.array(accordionSchema),
});

export type LegalContent = z.infer<typeof legalContentContentSchema>;
