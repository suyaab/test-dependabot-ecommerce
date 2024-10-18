import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { z } from "zod";

import {
  ServiceLocator as CommerceServiceLocator,
  OrderStatusType,
} from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";

import { HttpResponseStatus } from "../../../constants";
import { getShipmentStatus } from "./getShipmentStatus";
import sendOrderShipmentStatusEmail from "./sendOrderShipmentStatusEmail";

const carrierStatusSchema = z.object({
  orderId: z.string().max(128),
  shipment: z.object({
    status: z.object({
      reason: z.string(),
    }),
  }),
});

/**
 *  Process shipment update event to update commerce shipment status.
 *
 * @param request - The HTTP request object.
 * @param context - The invocation context object.
 * @returns Promise<HttpResponseInit> A promise that resolves to an HTTP response object.
 *
 */
async function fsProcessShipmentStatus(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const logger = getLogger({
    correlationId: context.invocationId,
    prefix: "fs-process-shipment-status",
  });

  try {
    logger.info("Processing shipment status from Arvato CXC");

    const body = await request.json();

    logger.info({ body }, "Request body");

    const shipmentStatusEventParse = carrierStatusSchema.safeParse(body);
    if (!shipmentStatusEventParse.success) {
      logger.error(
        shipmentStatusEventParse.error.errors,
        "Failed to process shipment status schema validation",
      );

      return {
        status: HttpResponseStatus.BadRequest,
        body: JSON.stringify({
          code: "error",
          message: shipmentStatusEventParse.error.errors,
        }),
      };
    }

    logger.info(
      { event: shipmentStatusEventParse.data },
      "Received event from carrier to update shipment status",
    );

    const { orderId, shipment } = shipmentStatusEventParse.data;

    const orderService = CommerceServiceLocator.getOrderService();
    const existingOrder = await orderService.getOrderByOrderNumber(orderId);

    if (existingOrder == null) {
      logger.error({ orderId }, "Order not found with order number");

      return {
        status: HttpResponseStatus.NotFound,
        body: `Order not found with order number: ${orderId}`,
      };
    }

    logger.info({ id: existingOrder.id }, "Found order");

    const shipmentStatus = getShipmentStatus(shipment.status.reason);

    logger.info({ shipmentStatus }, "Shipment Status");

    if (existingOrder.shipmentStatus === shipmentStatus) {
      return {
        status: HttpResponseStatus.OK,
        body: JSON.stringify({
          code: "ok",
          message: "no update required",
        }),
      };
    }

    const updatedOrder = await orderService.updateOrderStatus(
      OrderStatusType.Shipment,
      shipmentStatus,
      orderId,
      existingOrder.version,
    );

    if (updatedOrder == null) {
      throw new Error(`Failed to update shipment state for order ${orderId}`);
    }

    logger.info({ updatedOrder }, "Updated order status");

    await sendOrderShipmentStatusEmail(shipmentStatus, updatedOrder, logger);

    return {
      status: HttpResponseStatus.OK,
      body: JSON.stringify({
        code: "ok",
        message: `Updated ${orderId} shipment status to ${shipmentStatus}`,
      }),
    };
  } catch (error) {
    logger.error(error, "Failed to proces shipment status");

    return {
      status: HttpResponseStatus.InternalServerError,
      body: JSON.stringify({
        code: "error",
        message: error,
      }),
    };
  }
}

app.http("fs-process-shipment-status", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: fsProcessShipmentStatus,
});
