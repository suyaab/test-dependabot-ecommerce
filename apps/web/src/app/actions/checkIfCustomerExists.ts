"use server";

import { headers } from "next/headers";

import { ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";

import ActionException from "./ActionException";

/**
 * Checks if a customer exists within our commercetools engine based on the provided email.
 * @param email the email of the customer to check.
 * @returns Promise<boolean> indicates whether the customer exists.
 */
export default async function checkIfCustomerExists(
  email: string,
): Promise<boolean> {
  const logger = getLogger({
    prefix: "web:actions:checkIfCustomerExists",
    headers: headers(),
  });

  try {
    const customerService = ServiceLocator.getCustomerService();
    const customer = await customerService.getCustomerByEmail(email);
    return customer?.id != null;
  } catch (error) {
    logger.error(error, "Error checking if customer exists");
    throw new ActionException("Error checking if customer exists", {
      cause: error,
    });
  }
}
