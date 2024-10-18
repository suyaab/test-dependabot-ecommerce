import crypto from "crypto";
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { z } from "zod";

import {
  OrderStatusType,
  ServiceLocator,
  Transaction,
} from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";

import { ArvatoEventName, HttpResponseStatus } from "../../../constants";
import getOrderStatus from "../../../helpers/getOrderStatus";
import getPaymentStatus from "../../../helpers/getPaymentStatus";

const OrderUpdateRequestSchema = z.object({
  header: z.object({
    eventName: z.string(),
    locale: z.string(),
  }),
  payload: z.object({
    orderStatus: z.object({
      orderExternalId: z.string(),
      status: z.string(),
      statusDate: z.string(),
    }),
  }),
});

export async function fsProcessOrderStatus(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const logger = getLogger({
    correlationId: context.invocationId,
    prefix: "fs-process-order-status",
  });

  try {
    logger.info("Processing order status from Arvato");

    const body = await request.json();

    logger.info({ body }, "Request body");

    const parsedOrderUpdateRequest = OrderUpdateRequestSchema.safeParse(body);

    if (!parsedOrderUpdateRequest.success) {
      logger.error(
        { errors: parsedOrderUpdateRequest.error.errors },
        "Failed to parse process order status body",
      );

      return {
        status: HttpResponseStatus.BadRequest,
        body: JSON.stringify({
          code: "error",
          message: parsedOrderUpdateRequest.error.errors,
        }),
      };
    }

    logger.info(
      { orderUpdateRequest: parsedOrderUpdateRequest.data },
      "Http function processed request for Request",
    );

    const { eventName } = parsedOrderUpdateRequest.data.header;

    const {
      orderStatus: { orderExternalId, status, statusDate },
    } = parsedOrderUpdateRequest.data.payload;

    const orderNumber = orderExternalId;

    const orderService = ServiceLocator.getOrderService();
    const existingOrder = await orderService.getOrderByOrderNumber(orderNumber);

    if (existingOrder == null) {
      return {
        status: HttpResponseStatus.NotFound,
        body: JSON.stringify({
          code: "error",
          message: "Order not found with order number",
          orderNumber: orderNumber,
        }),
      };
    }

    const paymentService = ServiceLocator.getPaymentService();

    logger.info(`Updating Order ${orderNumber} [${eventName}] status`);

    let updatedOrder;

    switch (eventName) {
      case ArvatoEventName.UPDATE_ORDER_STATUS: {
        // update commerce order status

        updatedOrder = await orderService.updateOrderStatus(
          OrderStatusType.Order,
          getOrderStatus(status),
          orderExternalId,
          existingOrder.version,
        );

        logger.info(`Updated Order ${orderNumber} order status`);

        break;
      }

      case ArvatoEventName.UPDATE_PAYMENT_STATUS: {
        // update commerce payment status

        updatedOrder = await orderService.updateOrderStatus(
          OrderStatusType.Payment,
          getPaymentStatus(status),
          orderExternalId,
          existingOrder.version,
        );

        logger.info(`Updated Order ${orderNumber} payment status`);

        // if status is paid, attach transaction to the payment
        if (
          status === "Paid" &&
          updatedOrder != null &&
          updatedOrder?.totalPrice > 0
        ) {
          const paymentReference =
            await paymentService.getPaymentReference(orderNumber);

          if (paymentReference == null) {
            throw new Error("Payment reference not found");
          }

          // Attach transaction to the payment
          const transaction: Transaction = {
            type: "Charge",
            state: "Success",
            amount: {
              currencyCode: updatedOrder.currencyCode,
              centAmount: updatedOrder.totalPrice,
            },
            interactionId: crypto.randomUUID(),
            timestamp: new Date(Number(statusDate)),
          };

          logger.info({ transaction }, "Attaching Transaction");

          await paymentService.attachTransactionToPaymentReference(
            paymentReference.id,
            paymentReference.version,
            transaction,
          );
        }

        break;
      }

      default: {
        throw new Error(`Invalid Arvato Update Event: ${eventName}`);
      }
    }

    if (updatedOrder == null) {
      throw new Error(
        `Failed to update ${eventName} state for order ${orderExternalId}`,
      );
    }

    logger.info({ updatedOrder }, "Updated order status");

    return {
      status: HttpResponseStatus.OK,
      body: JSON.stringify({
        code: "ok",
        message: `Order number: ${orderNumber} updated successfully`,
      }),
    };
  } catch (error) {
    logger.error(error, "Error processing order status");
    return {
      status: HttpResponseStatus.InternalServerError,
      body: JSON.stringify({
        code: "error",
        message: error,
      }),
    };
  }
}

app.http("fs-process-order-status", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: fsProcessOrderStatus,
});
