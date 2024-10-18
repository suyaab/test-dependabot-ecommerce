import { Customer, Order } from "@ecommerce/commerce";
import { Logger } from "@ecommerce/logger";
import { EmailTemplate, ServiceLocator } from "@ecommerce/notifications";
import {
  carrierSchema,
  getAddressCountryName,
  getArrivalDate,
  SchemaException,
  SMEmailException,
} from "@ecommerce/utils";

export async function sendSubscriptionConfirmationEmail(
  logger: Logger,
  customer: Customer,
  order: Order,
) {
  try {
    logger.info("Sending subscription order confirmation email");

    const carrierParse = carrierSchema.safeParse(order.shippingMethod);

    if (!carrierParse.success) {
      throw new SchemaException(
        `Invalid Carrier from Order Shipping Info: ${order.shippingMethod}`,
        carrierParse.error,
      );
    }

    const formattedDeliveryDate = getArrivalDate(
      order.createdAt,
      order.shippingAddress.countryCode,
      carrierParse.data,
    );

    if (customer?.shippingAddress == null) {
      throw new Error(
        "Unable to send confirmation email with no shipping address",
      );
    }

    const notificationsService = ServiceLocator.getEmailService();

    await notificationsService.sendEmail(
      EmailTemplate.SubscriptionConfirmation,
      {
        email: customer.email,
        name: `${customer.firstName} ${customer.lastName}`,
      },
      {
        first_name: customer.firstName,
        order_number: order.orderNumber,
        estimated_delivery: formattedDeliveryDate,
        delivery_name: `${customer.firstName} ${customer.lastName}`,
        address_line_1: customer.shippingAddress.addressLine1,
        address_line_2: customer.shippingAddress.addressLine2,
        city: customer.shippingAddress.city,
        state_province_region: customer.shippingAddress.state,
        postal_code: customer.shippingAddress.postalCode,
        country: getAddressCountryName(customer.shippingAddress.countryCode),
      },
    );

    logger.info("Successfully sent subscription order confirmation email");
  } catch (error) {
    throw new SMEmailException(
      "Failed to send subscription confirmation email",
      { cause: error },
    );
  }
}
