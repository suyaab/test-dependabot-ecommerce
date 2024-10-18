import { z } from "zod";

import {
  ButtonSchema,
  FeatBlogEntrySchema,
  MultipleContentItemsSchema,
  ResponsiveImageSchema,
  TextSchema,
} from "./common";

export const HomeNutritionBlockContentSchema = z.object({
  title: z.string(),
  items: MultipleContentItemsSchema,
});

export type HomeNutritionBlockContent = z.infer<
  typeof HomeNutritionBlockContentSchema
>;

export const HomeFeatureContentItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  mainImage: ResponsiveImageSchema,
  centerImage: ResponsiveImageSchema,
});
export const HomeFeaturesContentSchema = z.object({
  items: z.array(HomeFeatureContentItemSchema),
});

export type HomeFeatureContentItem = z.infer<
  typeof HomeFeatureContentItemSchema
>;
export type HomeFeaturesContent = z.infer<typeof HomeFeaturesContentSchema>;

export const HomeGlucoseInfoBlockContenSchema = z.object({
  title: z.string(),
  text: TextSchema,
  button: ButtonSchema,
});
export type HomeGlucoseInfoBlockContent = z.infer<
  typeof HomeGlucoseInfoBlockContenSchema
>;

export const HomeProductHighLightContentSchema = z.object({
  data: z.object({
    title: z.string(),
    subtitle: z.string(),
    bullets: z.array(z.string()),
    button: ButtonSchema,
    smalltext: z.string(),
    disclaimer: z.object({
      content: z.string(),
      route: z.object({
        text: z.string(),
        url: z.string(),
      }),
    }),
  }),
});
export type HomeProductHighlightContent = z.infer<
  typeof HomeProductHighLightContentSchema
>;

export const HomeProductHighLightEcommerceContentSchema = z.object({
  data: z.object({
    title: z.string(),
    subtitle: z.string(),
    bullets: z.array(z.string()),
    button: ButtonSchema,
    sellingPoints: z.array(
      z.object({
        text: z.string(),
        icon: z.string(),
      }),
    ),
    disclaimers: z.array(z.string()),
  }),
});
export type HomeProductHighlightEcommerceContent = z.infer<
  typeof HomeProductHighLightEcommerceContentSchema
>;

export const HomeBlogContentSchema = z.object({
  subTitle: z.string(),
  title: z.string(),
  button: z.object({
    label: z.string(),
    variant: z.string(),
  }),
  featBlogEntries: z.array(FeatBlogEntrySchema),
});

export type HomeBlogContent = z.infer<typeof HomeBlogContentSchema>;

export const ExpertDetailsSchema = z.object({
  name: z.string(),
  title: z.string(),
  image: ResponsiveImageSchema,
});

export const MetabolismMythsSlideStartSchema = z.object({
  name: z.string(),
  type: z.literal("start"),
  title: z.string(),
  text: TextSchema,
  cta: ButtonSchema,
  experts: z.array(ExpertDetailsSchema),
});

export type MetabolismMythsSlideStart = z.infer<
  typeof MetabolismMythsSlideStartSchema
>;

export const MetabolismMythsSlideQSchema = z.object({
  name: z.string(),
  type: z.literal("question"),
  icon: z.string(),
  title: z.string(),
  cta: ButtonSchema,
  cta2: ButtonSchema,
});

export type MetabolismMythsSlideQ = z.infer<typeof MetabolismMythsSlideQSchema>;

export const MetabolismMythsSlideASchema = z.object({
  name: z.string(),
  type: z.literal("answer"),
  icon: z.string(),
  title: z.string(),
  title2: z.string(),
  text: TextSchema,
  cta: ButtonSchema,
  references: TextSchema,
  experts: z.array(ExpertDetailsSchema),
});

export type MetabolismMythsSlideA = z.infer<typeof MetabolismMythsSlideASchema>;

export const MetabolismMythsSlideSignupSchema = z.object({
  name: z.string(),
  type: z.literal("signup"),
  title: z.string(),
  subtext: TextSchema,
});

export type MetabolismMythsSlideSignup = z.infer<
  typeof MetabolismMythsSlideSignupSchema
>;

export const MetabolismMythsSlideEndSchema = z.object({
  name: z.string(),
  type: z.literal("end"),
  title: z.string(),
  cta: ButtonSchema,
});

export type MetabolismMythsSlideEnd = z.infer<
  typeof MetabolismMythsSlideEndSchema
>;

export const MetabolismMythsSlidesSchema = z.array(
  z.union([
    MetabolismMythsSlideStartSchema,
    MetabolismMythsSlideQSchema,
    MetabolismMythsSlideASchema,
    MetabolismMythsSlideSignupSchema,
    MetabolismMythsSlideEndSchema,
  ]),
);

export type MetabolismMythsSlides = z.infer<typeof MetabolismMythsSlidesSchema>;

export const MetabolismMythsSchema = z.object({
  main: z.object({
    image: ResponsiveImageSchema,
    title: z.string(),
    suptitle: z.string(),
    subtitle: z.string(),
    cta: ButtonSchema,
  }),
  slides: MetabolismMythsSlidesSchema,
});

export type HomeMetabolismMyths = z.infer<typeof MetabolismMythsSchema>;
