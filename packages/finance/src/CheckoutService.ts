import { z } from "zod";

import { Address, Currency, currencySchema } from "@ecommerce/utils";

import { Payment } from "./PaymentGateway";

export interface CheckoutService {
  createCheckoutSession(
    orderNumber: string,
    totalPrice: number,
    currency: Currency,
    cartId?: string,
  ): Promise<CheckoutSession>;

  getCheckoutSession(checkoutSessionId: string): Promise<CheckoutSession>;

  updateCheckoutSessionCustomer(
    checkoutSessionId: string,
    ip: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
  ): Promise<void>;

  updateCheckoutSessionAddress(
    checkoutSessionId: string,
    billingAddress: Address,
  ): Promise<void>;

  getCheckoutPayment(checkoutSessionId: string): Promise<Payment>;

  updateAuthorizedPrice(
    currency: string,
    totalPrice: number,
    checkoutSessionId: string,
  ): Promise<boolean>;
}

export const checkoutSessionStatus = z.union([
  z.literal("success"),
  z.literal("pending"),
  z.literal("failed"),
]);
export type CheckoutSessionStatus = z.infer<typeof checkoutSessionStatus>;

export const checkoutSessionSchema = z.object({
  id: z.string(),
  timestamp: z.string().datetime(),
  amount: z.string(), // TODO: coerce and refine to a centAmount number
  currency: currencySchema,
  status: checkoutSessionStatus,
});
export type CheckoutSession = z.infer<typeof checkoutSessionSchema>;
