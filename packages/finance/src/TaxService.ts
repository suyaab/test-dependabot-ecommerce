import { z } from "zod";

import { Address } from "@ecommerce/utils";

export const subtaxRateSchema = z.array(
  z.object({
    name: z.string(),
    amount: z.number(),
  }),
);
export const taxInfoSchema = z.object({
  currency: z.string(),
  subTaxRate: subtaxRateSchema,
  totalTaxCalculated: z.number(),
});
export type TaxInfo = z.infer<typeof taxInfoSchema>;
export type SubTaxRate = z.infer<typeof subtaxRateSchema>;

export interface TaxService {
  createTaxTransaction(
    address: Address,
    totalPrice: number,
    sku: string,
    orderNumber: string,
    customerNumber: string,
  ): Promise<TaxInfo>;

  getTaxAmount(
    address: Address,
    totalPrice: number,
    sku: string,
  ): Promise<TaxInfo>;
}
