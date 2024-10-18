import { Order, ShipmentStatusCode } from "@ecommerce/commerce";
import { Logger } from "@ecommerce/logger";
import {
  EmailTemplate,
  ServiceLocator as SLNotifications,
} from "@ecommerce/notifications";
import {
  getAddressCountryName,
  getWebUrlByEnv,
  SMEmailException,
} from "@ecommerce/utils";

import { env } from "../../env";

export default async function sendOrderShipmentStatusEmail(
  shipmentStatusCode: ShipmentStatusCode,
  order: Order,
  logger: Logger,
) {
  try {
    logger.info("Sending order shipment status email");

    // TODO: why is customerEmail optional?
    if (order?.customerEmail == null) {
      throw new Error("Customer email is not present to send shipment email");
    }

    const notificationsService = SLNotifications.getEmailService();

    const baseTemplateData = {
      first_name: order.shippingAddress.firstName,
      delivery_name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      address_line_1: order.shippingAddress.addressLine1,
      address_line_2: order.shippingAddress.addressLine2,
      city: order.shippingAddress.city,
      state_province_region: order.shippingAddress.state ?? "",
      postal_code: order.shippingAddress.postalCode,
      country: getAddressCountryName(order.shippingAddress.countryCode),
      tracking_url: `${getWebUrlByEnv(env.LINGO_ENV)}/orders/tracking/${
        order.id
      }`,
    };

    const recipient = {
      email: order.customerEmail,
      name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    };

    switch (shipmentStatusCode) {
      case "Ready":
        await notificationsService.sendEmail(
          EmailTemplate.OrderOutForDelivery,
          recipient,
          {
            ...baseTemplateData,
            order_number: order.orderNumber,
          },
        );

        break;

      case "Pending":
        await notificationsService.sendEmail(
          EmailTemplate.CarrierReturn,
          recipient,
          {
            first_name: order.shippingAddress.firstName,
            order_number: order.orderNumber,
          },
        );
        break;

      case "Shipped":
        await notificationsService.sendEmail(
          EmailTemplate.ShippingConfirmation,
          recipient,
          baseTemplateData,
        );

        break;

      case "Delivered":
        await notificationsService.sendEmail(
          EmailTemplate.DeliveryConfirmation,
          recipient,
          {
            first_name: order.shippingAddress.firstName,
            order_number: order.orderNumber,
            tracking_url: `${getWebUrlByEnv(env.LINGO_ENV)}/orders/tracking/${
              order.id
            }`,
          },
        );
        break;
    }

    logger.info(`Successfully sent ${shipmentStatusCode} shipment email`);
  } catch (error) {
    throw new SMEmailException("Failed to send shipment status email", {
      cause: error,
    });
  }
}
