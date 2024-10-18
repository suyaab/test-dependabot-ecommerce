import { z } from "zod";

import { addressSchema, Currency, currencySchema } from "@ecommerce/utils";

export interface ChannelDetails {
  channel: "ecommerce" | "moto";
  ccLocId: "I1" | "CU";
  entityId: string;
}

export interface PaymentGateway {
  getChannelDetails(channel: PaymentChannel): ChannelDetails;

  getPayment(paymentToken: string): Promise<Payment>;

  getSavedPaymentMethod(paymentMethodId: string): Promise<PaymentMethod>;

  authorizeRecurringPayment(
    paymentMethodId: string,
    price: number,
    currency: Currency,
    orderNumber: string,
  ): Promise<Payment>;
}

export const paymentChannelSchema = z.union([
  z.literal("ecommerce"),
  z.literal("moto"),
]);

export type PaymentChannel = z.infer<typeof paymentChannelSchema>;

export const paymentMethodTypeSchema = z.union([
  z.literal("CREDIT_CARD"),
  z.literal("PAYPAL"),
  z.literal("GOOGLE_PAY"),
  z.literal("APPLE_PAY"),
]);

export type PaymentMethodType = z.infer<typeof paymentMethodTypeSchema>;

// TODO: investigate if we can remove express pay from brands
export const paymentMethodBrandSchema = z.union([
  z.literal("VISA"),
  z.literal("MASTERCARD"),
  z.literal("AMEX"),
  z.literal("DISCOVER"),
  z.literal("PAYPAL"),
  z.literal("GOOGLE_PAY"),
  z.literal("APPLE_PAY"),
]);

export type PaymentMethodBrand = z.infer<typeof paymentMethodBrandSchema>;

export const paymentMethodSchema = z.object({
  id: z.string(),
  type: paymentMethodTypeSchema,
  brand: paymentMethodBrandSchema,
  billingAddress: addressSchema,
  card: z.object({
    expiryMonth: z.string(),
    expiryYear: z.string(),
    last4Digits: z.string(),
  }),
});

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const paymentSchema = z.object({
  id: z.string(),
  currency: currencySchema,
  amount: z.number(),
  orderNumber: z.string(),
  channel: paymentChannelSchema,

  paymentInterface: z.string(),
  paymentStatus: z.object({
    interfaceCode: z.string(),
    interfaceText: z.string(),
  }),
  paymentMethod: paymentMethodSchema,
});

export type Payment = z.infer<typeof paymentSchema>;

export enum PSP_OPTIONS {
  PAYON = "payon",
}
