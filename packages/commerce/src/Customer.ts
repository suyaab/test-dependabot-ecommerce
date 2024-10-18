import { z } from "zod";

import { Address, addressSchema, localeSchema } from "@ecommerce/utils";

import { Cart } from "./Cart";
import { subscriptionSchema } from "./Subscription";

// TODO: can this not just be name or id?
export const customerGroupSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
});

export type CustomerGroup = z.infer<typeof customerGroupSchema>;

export const customerSchema = z.object({
  id: z.string(),
  version: z.number(),
  customerNumber: z.string(),
  externalId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  createdAt: z.coerce.date(),
  locale: localeSchema.optional(), // TODO: should this be optional?
  billingAddress: addressSchema.optional(),
  shippingAddress: addressSchema.optional(),
  customerGroup: customerGroupSchema,
  subscription: subscriptionSchema.optional(),
});

/**
 * Customer
 *
 * Representation of a Lingo customer which contains user contact information,
 *
 * - id: customer identifier
 * - version: concurrency control version
 * - customerNumber: customer number
 * - externalId: aka Lingo ID by mobile app, also used by Braze and One Trust
 * - firstName: customer first name
 * - lastName: customer last name
 * - email: email address
 * - phone: phone number (not required for all use cases)
 * - createdAt: date which the customer was created
 * - locale: locale in which the user originated from
 * - billingAddress: default billing address
 * - shippingAddress: default shipping address
 * - customerGroup: customer group
 * - subscription: the customer's subscription if currently subscribed
 */
export type Customer = z.infer<typeof customerSchema>;

export interface CustomerService {
  createCustomerFromCart(externalId: string, cart: Cart): Promise<Customer>;

  createCustomer(
    externalId: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
  ): Promise<Customer>;

  generateCustomerNumber(): string;

  getCustomerByEmail(email: string): Promise<Customer | undefined>;

  getCustomerById(
    id: string,
    options?: { includeSubscription: boolean },
  ): Promise<Customer | undefined>;

  updateCustomerInformation(
    id: string,
    version: number,
    firstName: string,
    lastName: string,
    phone?: string,
  ): Promise<Customer>;

  updateCustomerBillingAddress(
    id: string,
    version: number,
    billingAddress: Address,
  ): Promise<Customer>;

  updateCustomerShippingAddress(
    id: string,
    version: number,
    shippingAddress: Address,
    phone?: string,
  ): Promise<Customer>;

  deleteCustomer(id: string, version: number): Promise<void>;

  getCustomerGroupByName(groupName: string): Promise<CustomerGroup | undefined>;

  getCustomersWithUpcomingSubscription(): Promise<[Customer[], string[]]>;

  getCustomerByExternalId(externalId: string): Promise<Customer | undefined>;
}
