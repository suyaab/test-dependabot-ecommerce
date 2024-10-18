import { z } from "zod";

import { Customer } from "@ecommerce/commerce";

export interface AuthService {
  getUser(): Promise<AuthUser | undefined>;
  getAuthenticatedCustomer(): Promise<Customer | undefined>;
  checkUserExist(email: string): Promise<boolean>;
}

export const authUserSchema = z.object({
  externalId: z.string(),
  regionCode: z.string(),
  shippingCountryCode: z.string(),
  email: z.string().email(),
});

/**
 * An AuthUser is the user object that is based on the Auth provider user.
 *
 * - externalId: The ID used in Braze, One Trust and saved in CommerceTools
 * - regionCode: The region code of the user based on shipping country
 * i.e. XI shipping code is UK region code. **Note:** not all users have this yet!
 * - shippingCountryCode: The shipping country code of the user **Note:** some UK
 * users will not have this and if it doesn't exist will default to "GB"
 * -
 */
export type AuthUser = z.infer<typeof authUserSchema>;
