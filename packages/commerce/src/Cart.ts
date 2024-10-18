import { z } from "zod";

import {
  Address,
  addressCountryCodeSchema,
  addressSchema,
  currencySchema,
} from "@ecommerce/utils";

import { lineItemProductSchema } from "./Products";

export const cartLineItemSchema = z.object({
  id: z.string(),
  // Subset of Product
  product: lineItemProductSchema,
  name: z.string(), // TODO: should this live under product?
  quantity: z.number(),
  price: z.number(),
  totalNet: z.number().optional(),
  totalDiscount: z.number(),
  taxRate: z.number().optional(),
  totalGross: z.number().optional(),
});

/**
 * CartLineItem is a representation of a product in the cart.
 *
 * - product is a subset of Product type
 * - name is the name of the product
 * - quantity is how many of this product are in the line item
 * - price is the price of the product before discounts
 * - totalNet is the (total price - tax) after discounts
 * - totalDiscount is the total discount for the line item
 * - taxRate is the tax rate (decimal) for the line item
 * - totalGross is the total amount grossed in cents which includes taxes
 */
export type CartLineItem = z.infer<typeof cartLineItemSchema>;

export const cartLineItemDraftSchema = z.object({
  sku: z.string(),
  quantity: z.number(),
});

export type CartLineItemDraft = z.infer<typeof cartLineItemDraftSchema>;

export const contactInfoSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1),
  marketingConsent: z.boolean(),
});

export type ContactInfo = z.infer<typeof contactInfoSchema>;

export const discountCodeSchema = z.object({
  id: z.string(),
  version: z.number(),
  code: z.string(),
  isActive: z.boolean(),
});

export type DiscountCode = z.infer<typeof discountCodeSchema>;

export const discountCodeInfoSchema = z.object({
  discountCode: z.object({
    id: discountCodeSchema.shape.id,
    version: discountCodeSchema.shape.version.optional(),
    code: discountCodeSchema.shape.code.optional(),
  }),
  state: z.union([
    z.literal("NotActive"),
    z.literal("NotValid"),
    z.literal("MaxApplicationReached"),
    z.literal("ApplicationStoppedByPreviousDiscount"),
    z.literal("MatchesCart"),
    z.literal("DoesNotMatchCart"),
  ]),
});

/**
 * DiscountCodeInfo is a representation of a discount code that is **applied** to the cart.
 * - id: identifier of the discount code
 * - state: state of the discount code applied to the cart (NotActive, MaxApplicationReached, etc.)
 */
export type DiscountCodeInfo = z.infer<typeof discountCodeInfoSchema>;

export const cartSchema = z.object({
  id: z.string(),
  version: z.number(),
  isActive: z.boolean(),
  subtotal: z.number(), // total gross net (no tax/shipping)
  totalPrice: z.number(), // total gross net + discounts + tax + shipping
  totalTaxAmount: z.number().optional(), // total tax amount
  totalDiscount: z.number().optional(), // total discount amount
  totalGross: z.number().optional(), // total gross amount
  currency: currencySchema,
  countryCode: z.string().optional(),
  lineItems: cartLineItemSchema.array(),
  customerId: z.string().optional(),
  contactInfo: contactInfoSchema.optional(),
  shippingAddress: addressSchema.optional(),
  billingAddress: addressSchema.optional(),
  shippingMethodId: z.string().optional(),
  payments: z.string().array().optional(),
  discountCodes: discountCodeInfoSchema.array(),
});

export type Cart = z.infer<typeof cartSchema>;

// TODO: convert this to cartSchema.pick()
export const cartDraftSchema = z.object({
  currency: currencySchema,
  countryCode: addressCountryCodeSchema,
  customerEmail: z.string().email().optional(),
  lineItems: cartLineItemDraftSchema.array(),
  customerId: z.string().optional(),
  shippingAddress: addressSchema.optional(),
  billingAddress: addressSchema.optional(),
});

export type CartDraft = z.infer<typeof cartDraftSchema>;

export const shippingMethodInfoSchema = z.object({
  id: z.string().optional(),
});

export type ShippingMethodInfo = z.infer<typeof shippingMethodInfoSchema>;

export interface CartService {
  createCart(cartDraft: CartDraft): Promise<Cart>;

  getCart(cartId: string): Promise<Cart | undefined>;

  updateCartContactInfo(
    cartId: string,
    cartVersion: number,
    ContactInfo: ContactInfo,
  ): Promise<Cart>;

  updateCartShippingAddress(
    cartId: string,
    cartVersion: number,
    shippingAddress: Address,
    setShippingMethod?: boolean,
  ): Promise<Cart>;

  updateCartBillingAddress(
    cartId: string,
    cartVersion: number,
    billingAddress: Address,
  ): Promise<Cart>;

  updateCartPaymentInfo(
    cartId: string,
    cartVersion: number,
    paymentId: string,
  ): Promise<Cart>;

  updateCartCustomerId(
    cartId: string,
    cartVersion: number,
    customerId: string,
  ): Promise<Cart>;

  getDiscountCodeByName(
    discountCode: string,
  ): Promise<DiscountCode | undefined>;

  addDiscountCodeToCart(
    cartId: string,
    cartVersion: number,
    discountCode: string,
  ): Promise<[DiscountCodeInfo["state"], Cart]>;

  removeDiscountCodeFromCart(
    cartId: string,
    cartVersion: number,
    discountCodeId: string,
  ): Promise<Cart>;

  freezeCart(cartId: string, cartVersion: number): Promise<Cart>;

  removeCustomerFromCart(cartId: string, cartVersion: number): Promise<Cart>;

  removePaymentRefFromCart(
    cartId: string,
    cartVersion: number,
    paymentReferenceId: string,
  ): Promise<Cart>;
}
