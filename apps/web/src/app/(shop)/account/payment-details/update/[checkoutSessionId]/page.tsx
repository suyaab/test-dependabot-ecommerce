import { redirect } from "next/navigation";

import { ServiceLocator as AuthServiceLocator } from "@ecommerce/auth";
import { ServiceLocator as CommerceServiceLocator } from "@ecommerce/commerce";
import { ServiceLocator as FinanceServiceLocator } from "@ecommerce/finance";
import logger from "@ecommerce/logger";

export default async function AccountPaymentDetailsUpdatePage({
  params: { checkoutSessionId },
  searchParams,
}: {
  params: { checkoutSessionId: string };
  searchParams?: { returnTo?: string };
}) {
  const customerService = CommerceServiceLocator.getCustomerService();
  const subscriptionService = CommerceServiceLocator.getSubscriptionService();
  const checkoutService = FinanceServiceLocator.getCheckoutService();

  logger.info("Updating payment details");

  const returnTo = searchParams?.returnTo;
  try {
    const checkoutPayment =
      await checkoutService.getCheckoutPayment(checkoutSessionId);

    logger.info({ checkoutPayment }, "Retrieved Saved Payment Method");

    const authService = AuthServiceLocator.getAuthService();
    const customer = await authService.getAuthenticatedCustomer();

    if (customer == null) {
      throw new Error("Unable to update customer payment details");
    }

    logger.info(
      { address: checkoutPayment.paymentMethod.billingAddress },
      "Updating Customer Billing Address",
    );

    const updatedCustomer = await customerService.updateCustomerBillingAddress(
      customer.id,
      customer?.version,
      checkoutPayment.paymentMethod.billingAddress,
    );

    logger.info({ updatedCustomer }, "Updated Customer Billing Address");

    logger.info(
      { id: checkoutPayment.paymentMethod.id },
      "Updating Customer Subscription",
    );

    const subscription = await subscriptionService.updatePaymentMethod(
      updatedCustomer.id,
      updatedCustomer.version,
      checkoutPayment.paymentMethod.id,
    );

    logger.info({ subscription }, "Updated Customer Subscription");
  } catch (error) {
    logger.error(error, "Error updating Payment Details");

    redirect("/account/payment-details?error");
  }
  if (returnTo != null) {
    redirect(`/account/${returnTo}`);
  }
  redirect("/account/payment-details");
}
