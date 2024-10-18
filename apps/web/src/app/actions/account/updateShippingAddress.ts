"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ServiceLocator as AuthServiceLocator } from "@ecommerce/auth";
import { ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";
import {
  EmailTemplate,
  ServiceLocator as SLNotifications,
} from "@ecommerce/notifications";
import {
  AddressFormData,
  addressSchema,
  SchemaException,
} from "@ecommerce/utils";

import ActionException from "../ActionException";

type ActionResponse =
  | {
      ok: true;
    }
  | { ok: false; message: string };

export async function updateShippingAddress(
  shippingAddressData: AddressFormData,
): Promise<ActionResponse> {
  const logger = getLogger({
    prefix: "web:actions:updateShippingAddress",
    headers: headers(),
  });

  const customerService = ServiceLocator.getCustomerService();
  const authService = AuthServiceLocator.getAuthService();

  const customer = await authService
    .getAuthenticatedCustomer()
    .catch((error) => {
      logger.error(error, "Error getting authenticated customer");
      throw new ActionException("Error getting authenticated customer", {
        cause: error,
      });
    });

  if (customer == null) {
    logger.error(
      "There was an attempt to update shipping address without being logged in!",
    );
    redirect("/api/auth/login");
  }

  logger.child({ customerId: customer?.id });

  try {
    const addressParse = addressSchema.safeParse({
      firstName: customer.firstName,
      lastName: customer.lastName,
      ...shippingAddressData,
    });

    if (!addressParse.success) {
      throw new SchemaException(
        "Failed to update account shipping address",
        addressParse.error,
      );
    }

    logger.info("Updating customer shipping address");
    await customerService.updateCustomerShippingAddress(
      customer.id,
      customer.version,
      addressParse.data,
      customer.phone,
    );
    logger.info("Successfully updated customer shipping address");

    logger.info("Sending account update shipping address email");
    const emailService = SLNotifications.getEmailService();
    await emailService.sendEmail(EmailTemplate.AccountDetailsUpdated, {
      email: customer.email,
      name: `${customer.firstName} ${customer.lastName}`,
    });
    logger.info("Successfully sent account update shipping address email");

    revalidatePath("/account/shipping-address");

    return {
      ok: true,
    };
  } catch (error) {
    logger.error(
      error,
      `Failed to update customer shipping address ${customer.id}`,
    );

    return {
      ok: false,
      message: "Unable to update shipping address. Please try again later.",
    };
  }
}
