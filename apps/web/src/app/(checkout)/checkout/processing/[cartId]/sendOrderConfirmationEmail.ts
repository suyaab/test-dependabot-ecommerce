import { Order } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";
import {
  EmailTemplate,
  ServiceLocator as SLNotifications,
} from "@ecommerce/notifications";
import {
  carrierSchema,
  getAddressCountryName,
  getArrivalDate,
  SchemaException,
  SMEmailException,
} from "@ecommerce/utils";

export default async function sendOrderConfirmationEmail(order: Order) {
  const logger = getLogger({
    prefix: "sendOrderConfirmationEmail",
  });
  try {
    logger.info("Sending order confirmation email");

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

    const notificationsService = SLNotifications.getEmailService();

    await notificationsService.sendEmail(
      EmailTemplate.OrderConfirmation,
      {
        email: order.customerEmail!,
        name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      },
      {
        first_name: order.shippingAddress.firstName,
        order_number: order.orderNumber,
        estimated_delivery: formattedDeliveryDate,
        delivery_name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        address_line_1: order.shippingAddress.addressLine1,
        address_line_2: order.shippingAddress.addressLine2,
        city: order.shippingAddress.city,
        state_province_region: order.shippingAddress.state,
        postal_code: order.shippingAddress.postalCode,
        country: getAddressCountryName(order.shippingAddress.countryCode),
      },
    );

    logger.info("Successfully sent order confirmation email");
  } catch (error) {
    throw new SMEmailException("Failed to send confirmation email", {
      cause: error,
    });
  }
}
