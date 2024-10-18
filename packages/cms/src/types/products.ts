import { z } from "zod";

import { CarouselItemSchema, ResponsiveImageSchema } from "./common";

export const PriceSchema = z.object({
  amount: z.number(),
  currency: z.string(),
});

export const CgmSchema = z.object({
  count: z.number(),
  message: z.string(),
});

export const FrequenciesEnum = z.enum(["week", "mo", "year"]);
export const FrequenciesPerEnum = z.enum(["monthly", "quarterly"]);

export const ProductFeaturesContentSchema = z.object({
  title: z.string(),
  items: z.array(z.string()),
});

export const ProductCardContentSchema = z.object({
  sku: z.string(),
  slug: z.string().nullable().optional(),
  title: z.string(),
  description: z.string(),
  pdpCardDetails: z.array(z.string()),
  eyebrow: z.string(),
  image: ResponsiveImageSchema,
  priceDetails: z.object({
    price: PriceSchema,
    discount: PriceSchema.optional(),
    tax: PriceSchema.optional(),
    frequency: FrequenciesEnum.nullish(),
  }),
  billingDetails: z.object({
    price: PriceSchema.nullish(),
    frequency: FrequenciesPerEnum.nullish(),
    message: z.string(),
  }),
  deliveryDetails: z
    .object({
      count: z.number(),
      frequency: z.string(),
      message: z.string(),
    })
    .optional()
    .nullish(),
  savingDetails: z
    .object({
      price: z.object({
        amount: z.number(),
        units: z.string(),
      }),
      frequency: FrequenciesEnum,
      message: z.string(),
      bestValue: z.boolean(),
      bestValueMessage: z.string().nullish(),
      pdpCardTag: z.string(),
    })
    .optional()
    .nullable(),
  cgms: z.object({
    total: CgmSchema,
    shipment: CgmSchema.nullish(),
  }),
});

export const ProductCardsContentSchema = z.object({
  typename: z.literal("ProductCards"),
  items: z.array(ProductCardContentSchema),
});

export const CheckoutProductsContentSchema = z.record(
  z.string(),
  ProductCardContentSchema,
);

export const InputComponentsEnum = z.enum(["Checkbox"]);

export const InputNamesEnum = z.enum([
  "checkboxOver18",
  "checkboxInsulin",
  "checkboxDiabetes",
  "checkboxConsult",
]);

export const FieldSchema = z.object({
  component: InputComponentsEnum,
  name: InputNamesEnum,
  label: z.string(),
  required: z.boolean(),
  errorMessage: z.string(),
});

export const FieldGroupSchema = z.object({
  title: z.string().nullable(),
  errorMessage: z.string(),
  fields: z.array(FieldSchema),
});

export const ProductFormContentSchema = z.object({
  typename: z.literal("ProductForm"),
  title: z.string().optional(),
  footer: z.string(),
  taxInfo: z.string(),
  shippingInfo: z.string(),
  moneyBackInfo: z.string(),
  orderButtonLabel: z.string(),
  terms: z.array(
    FieldGroupSchema.extend({
      tooltipContent: z.string().nullish(),
    }),
  ),
});

export const SampleProductFormContentSchema = z.object({
  typename: z.literal("SampleProductForm"),
  title: z.string(),
  footer: z.string().optional(),
  taxInfo: z.string().optional(),
  shippingInfo: z.string(),
  moneyBackInfo: z.string().optional(),
  orderButtonLabel: z.string(),
  terms: z
    .array(
      FieldGroupSchema.extend({
        tooltipContent: z.string().nullish(),
      }),
    )
    .nullish(),
});

export const ProductFormSchema = z.object({
  checkboxOver18: z.boolean().refine((bool) => bool, {
    message: "must check the over 18 checkbox",
  }),
  checkboxInsulin: z.boolean().refine((bool) => bool, {
    message: "must check the insulin checkbox",
  }),
  checkboxDiabetes: z.boolean().refine((bool) => bool, {
    message: "You must check the diabetes checkbox",
  }),
  checkboxConsult: z.boolean().refine((bool) => bool, {
    message: "You must check the clinical action checkbox",
  }),
});

export type ProductFormType = z.infer<typeof ProductFormSchema>;

export interface ProductFormCheckboxes {
  checkboxOver18: boolean;
  checkboxDiabetes: boolean;
  checkboxInsulin: boolean;
  checkboxConsult: boolean;
}

export const DisplayProductSchema = z.object({
  id: z.string(),
  version: z.number(),
  sku: z.string(),
  attributes: z.object({
    orderOrigin: z.string().optional(),
    returnableDays: z.number(),
    frequency: z.number(),
  }),
  createdAt: z.string(),
  lastModifiedAt: z.string(),
  price: PriceSchema.optional(),
});

export const ProductCarouselContentSchema = z.object({
  items: z.array(ResponsiveImageSchema),
  eligibleTag: z.object({
    title: z.string(),
    tooltip: z.string(),
  }),
  compatibleTag: z.object({
    title: z.string(),
    tooltip: z.string(),
  }),
});

export const SampleProductCarouselContentSchema = z.object({
  items: z.array(ResponsiveImageSchema),
  compatibleTag: z.object({
    title: z.string(),
    tooltip: z.string(),
  }),
});

export const DisplayProductsSchema = z.array(DisplayProductSchema);

export const ProductDecideDialogSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: ResponsiveImageSchema,
  items: z.array(
    z.object({
      title: z.string(),
      eyebrow: z.string(),
      details: z.string(),
      tag: z.string(),
      autoRenews: z.boolean(),
      cgmDetails: z.string(),
      iconName: z.string(),
    }),
  ),
  triggerContent: z.object({
    title: z.string(),
    iconName: z.string(),
  }),
});

export type ProductFeaturesContent = z.infer<
  typeof ProductFeaturesContentSchema
>;
export type Price = z.infer<typeof PriceSchema>;
export type ProductCardContent = z.infer<typeof ProductCardContentSchema>;
export type CheckoutProductsContent = z.infer<
  typeof CheckoutProductsContentSchema
>;
export type DisplayProduct = z.infer<typeof DisplayProductSchema>;
export type DisplayProducts = z.infer<typeof DisplayProductsSchema>;
export type ProductCarouselContent = z.infer<
  typeof ProductCarouselContentSchema
>;
export type ProductFormContent = z.infer<typeof ProductFormContentSchema>;
export type FieldGroup = z.infer<typeof FieldGroupSchema>;
export type FieldSchema = z.infer<typeof FieldSchema>;
export type ProductDecideDialogContent = z.infer<
  typeof ProductDecideDialogSchema
>;

export type SampleProductFormContent = z.infer<
  typeof SampleProductFormContentSchema
>;

export type SampleProductCarouselContent = z.infer<
  typeof SampleProductCarouselContentSchema
>;

export const PDPNextStepsCarouselContentSchema = z.object({
  title: z.string(),
  items: z.array(CarouselItemSchema),
});
export type PDPNextStepsCarouselContent = z.infer<
  typeof PDPNextStepsCarouselContentSchema
>;
