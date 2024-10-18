"use server";

import { ServiceLocator as FinanceServiceLocator } from "@ecommerce/finance";
import { getLogger } from "@ecommerce/logger";
import {
  EmailTemplate,
  ServiceLocator as NotificationsServiceLocator,
} from "@ecommerce/notifications";
import { Address, addressSchema, SchemaException } from "@ecommerce/utils";

// TODO: refactor to best practices
export async function updateCheckoutBillingAddress(
  checkoutSessionId: string,
  billingAddressData: Address,
  email: string,
) {
  const logger = getLogger({
    prefix: "web:account:updateCheckoutBillingAddress",
  });

  try {
    const addressParse = addressSchema.safeParse(billingAddressData);

    if (!addressParse.success) {
      throw new SchemaException(
        "Failed to update account billing address",
        addressParse.error,
      );
    }

    const checkoutService = FinanceServiceLocator.getCheckoutService();

    await checkoutService.updateCheckoutSessionAddress(
      checkoutSessionId,
      addressParse.data,
    );

    logger.info("Sending confirmation email");
    const emailService = NotificationsServiceLocator.getEmailService();
    await emailService.sendEmail(EmailTemplate.AccountDetailsUpdated, {
      email: email,
      name: `${billingAddressData.firstName} ${billingAddressData.lastName}`,
    });
    logger.info("Successfully confirmation email");
  } catch (error) {
    logger.error(
      error,
      `Failed to update customer billing address on checkout ${checkoutSessionId}`,
    );

    throw new Error(
      `Failed to update billing address onf checkout ${checkoutSessionId}`,
      {
        cause: error,
      },
    );
  }
}
