import { z } from "zod";

import { Payment } from "@ecommerce/finance";

export const paymentChannelSchema = z.union([
  z.literal("ecommerce"),
  z.literal("moto"),
]);

export type PaymentChannel = z.infer<typeof paymentChannelSchema>;

export type PaymentMethod =
  | "CREDIT_CARD"
  | "PAYPAL"
  | "APPLE_PAY"
  | "GOOGLE_PAY"
  | "PCI_PAL";

export type TransactionType =
  | "Authorization"
  | "CancelAuthorization"
  | "Charge"
  | "Refund"
  | "Chargeback";

export type TransactionState = "Initial" | "Pending" | "Success" | "Failure";

export interface Transaction {
  type: TransactionType;
  state: TransactionState;
  amount: {
    centAmount: number;
    currencyCode: string;
  };
  interactionId: string;
  timestamp: Date;
}

export interface PaymentStatus {
  interfaceCode: string;
  interfaceText: string;
}

/**
 * Description
 * ---
 * Represents a Finance Payment object that is stored in the Commerce engine.
 * Not the source of truth for payments, but rather a mechanism to correlate
 * Financial Payment objects to Commerce Order objects.
 *
 *
 * Properties
 * ---
 * - id - payment reference id
 * - version - payment reference concurrency version
 * - interfaceId - financial payment identifier (ie: payon id)
 * - channel - financial payments channel (ie: ecommerce, moto)
 * - paymentInterface - financial payment interface (ie: "payon")
 * - paymentMethod - financial payment method brand name
 * - paymentStatus - status and description of payment
 * - amount - total cent amount of payment (i.e. amount of 100 = $1.00)
 * - currency - currency code associated with payment
 */
export type PaymentReference = z.infer<typeof paymentReferenceSchema>;

export const paymentReferenceSchema = z.object({
  id: z.string(),
  version: z.number(),
  interfaceId: z.string(),
  channel: z.union([z.literal("ecommerce"), z.literal("moto")]),
  paymentInterface: z.string(),
  paymentMethod: z.union([
    z.literal("CREDIT_CARD"),
    z.literal("PAYPAL"),
    z.literal("APPLE_PAY"),
    z.literal("GOOGLE_PAY"),
    z.literal("PCI_PAL"),
  ]),
  paymentStatus: z.object({
    interfaceCode: z.string(),
    interfaceText: z.string(),
  }),
  amount: z.number(),
  currency: z.string(),
});

export interface PaymentService {
  createPaymentReference(
    payment: Payment,
    customerId: string,
    transactions?: Transaction[],
  ): Promise<{ id: string; version: number }>;

  getPaymentReference(
    orderNumber: string,
  ): Promise<PaymentReference | undefined>;

  attachTransactionToPaymentReference(
    paymentId: string,
    version: number,
    transaction: Transaction,
  ): Promise<void>;

  deletePaymentReference(
    paymentRefId: string,
    paymentRefVersion: number,
  ): Promise<void>;
}
