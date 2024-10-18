import { z } from "zod";

// product category
export const productCategorySchema = z.union([
  z.literal("pdp"),
  z.literal("phone"),
  z.literal("update"),
  z.literal("sample"),
]);

export type ProductCategory = z.infer<typeof productCategorySchema>;

// product price
export const productPriceSchema = z.object({
  amount: z.number(),
  currency: z.string(),
});
export type ProductPrice = z.infer<typeof productPriceSchema>;

export const orderOriginSchema = z.union([
  z.literal("SAMPLE"),
  z.literal("FULFILLMENT"),
  z.literal("REPLACEMENT"),
  z.literal("INITIAL"),
  z.literal("FOC"),
  z.literal("CUSTOMER"),
  z.literal("AUTORENEWAL"),
  z.literal("NOSHIP"),
]);

export type OrderOrigin = z.infer<typeof orderOriginSchema>;

// product attributes
export const standaloneProductAttributesSchema = z.object({
  orderOrigin: orderOriginSchema,
  returnableDays: z.number(),
});
export type StandaloneProductAttribute = z.infer<
  typeof standaloneProductAttributesSchema
>;

export const subscriptionProductAttributesSchema =
  standaloneProductAttributesSchema.extend({
    shipmentFrequency: z.number(),
    prepaidShipments: z.number(),
    autoRenew: z.boolean(),
  });
export type SubscriptionProductAttribute = z.infer<
  typeof subscriptionProductAttributesSchema
>;

export const productAttributesSchema = z.union([
  standaloneProductAttributesSchema,
  subscriptionProductAttributesSchema,
]);
export type ProductAttributes = z.infer<typeof productAttributesSchema>;

// product type
export const productTypeSchema = z.union([
  z.literal("subscription"),
  z.literal("standalone"),
]);
export type ProductType = z.infer<typeof productTypeSchema>;

// base product
export const baseProductSchema = z.object({
  id: z.string(),
  type: productTypeSchema,
  version: z.number(),
  sku: z.string(),
  slug: z.string(), // slug to work with searchQueryParams
  createdAt: z.coerce.date(),
  lastModifiedAt: z.coerce.date(),
  price: productPriceSchema,
});

// standalone product
export const standaloneProductSchema = baseProductSchema.extend({
  type: z.literal("standalone"),
  attributes: standaloneProductAttributesSchema,
});

// subscription product
export const subscriptionProductSchema = baseProductSchema.extend({
  type: z.literal("subscription"),
  attributes: subscriptionProductAttributesSchema,
});

// product
export const productSchema = z.union([
  standaloneProductSchema,
  subscriptionProductSchema,
]);
export type Product = z.infer<typeof productSchema>;

// product line item
export const lineItemProductSchema = baseProductSchema.pick({
  id: true,
  sku: true,
  type: true,
});
export type LineItemProduct = z.infer<typeof lineItemProductSchema>;

export interface ProductService {
  getProduct(id: string): Promise<Product>;

  getProductBySku(sku: string): Promise<Product>;

  getProducts(): Promise<Product[]>;

  getProductsByCategory(category: ProductCategory): Promise<Product[]>;
}
