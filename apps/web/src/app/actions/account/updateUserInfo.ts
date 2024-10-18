"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ServiceLocator as AuthServiceLocator } from "@ecommerce/auth";
import { ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";
import {
  EmailTemplate,
  ServiceLocator as NotificationsServiceLocator,
} from "@ecommerce/notifications";

import { ActionResponse } from "~/app/actions/types";
import ActionException from "../ActionException";

export async function updateUserInfo(
  firstName: string,
  lastName: string,
  phone?: string,
): Promise<ActionResponse> {
  const logger = getLogger({
    prefix: "web:actions:updateUserInfo",
    headers: headers(),
  });

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
      "There was an attempt to update customer info without being logged in!",
    );
    redirect("/api/auth/login");
  }

  logger.child({ customerId: customer?.id });

  try {
    const customerService = ServiceLocator.getCustomerService();

    await customerService.updateCustomerInformation(
      customer.id,
      customer.version,
      firstName,
      lastName,
      phone,
    );

    logger.info("Sending account update user info email");

    const emailService = NotificationsServiceLocator.getEmailService();
    await emailService.sendEmail(EmailTemplate.AccountDetailsUpdated, {
      email: customer.email,
      name: `${customer.firstName} ${customer.lastName}`,
    });

    logger.info("Sent account update user info email");

    revalidatePath("/account/info");

    return {
      ok: true,
    };
  } catch (error) {
    logger.error(error, `Failed to update customer information ${customer.id}`);

    return {
      ok: false,
      message: "Unable to update customer info. Please try again later.",
    };
  }
}
