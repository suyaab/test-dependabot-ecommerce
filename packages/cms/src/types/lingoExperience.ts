import { z } from "zod";

import {
  ButtonSchema,
  CarouselItemSchema,
  ResponsiveImageSchema,
  TextSchema,
} from "./common";

export const LEResearchInfoBlockContentSchema = z.object({
  text: TextSchema,
  button: ButtonSchema,
});

export type LEResearchInfoBlockContent = z.infer<
  typeof LEResearchInfoBlockContentSchema
>;

export const LECoachingAppTabsContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  tabs: z.array(
    z.object({
      title: z.string(),
      text: z.string(),
      invertTextColor: z.boolean().optional(),
      image: ResponsiveImageSchema,
      phoneImage: ResponsiveImageSchema,
    }),
  ),
});

export type LECoachingAppTabsContent = z.infer<
  typeof LECoachingAppTabsContentSchema
>;

export const LECarouselContentSchema = z.object({
  title: z.string(),
  items: z.array(CarouselItemSchema),
});

export type LECarouselContent = z.infer<typeof LECarouselContentSchema>;
