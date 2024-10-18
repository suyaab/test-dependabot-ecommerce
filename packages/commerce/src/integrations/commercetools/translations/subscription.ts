import { Customer as CTCustomer } from "@commercetools/platform-sdk";
import { z } from "zod";

import { TranslationException } from "@ecommerce/utils";

import { Subscription, subscriptionStatusSchema } from "../../../Subscription";

const ctReferenceIdToString = z
  .object({
    typeId: z.string(),
    id: z.string(),
  })
  .transform((ref) => ref.id);

export const ctCustomerCustomFieldsSchema = z.object({
  status: subscriptionStatusSchema,
  subscription: ctReferenceIdToString,
  prepaidShipmentsRemaining: z.coerce.number(),
  parentOrderNumber: z.string(),
  paymentMethodId: z.string().optional(),
  nextOrderDate: z.coerce.date(),
  nextPlan: ctReferenceIdToString.optional(),
  nextPlanCartId: z.string().optional(),
  cancellationDate: z.coerce.date().optional(),
  notified: z.coerce.boolean().optional(),
  stoppedRetrying: z.coerce.boolean().optional(),
});

export function translateSubscription(customer: CTCustomer): Subscription {
  const customerAttributesParse = ctCustomerCustomFieldsSchema.safeParse(
    customer.custom?.fields,
  );

  if (!customerAttributesParse.success) {
    throw new TranslationException(
      `Failed to translate commercetools subscription custom type for ${customer.id}`,
      customerAttributesParse.error,
    );
  }

  return {
    customerId: customer.id,
    customerVersion: customer.version,
    ...customerAttributesParse.data,
  };
}
