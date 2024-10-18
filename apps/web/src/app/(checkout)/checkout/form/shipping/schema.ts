import { z } from "zod";

import { addressFormSchema } from "@ecommerce/utils";

export const shippingAddressFormSchema = z.object({
  shippingAddress: addressFormSchema,
});
export type ShippingAddressFormData = z.infer<typeof shippingAddressFormSchema>;
