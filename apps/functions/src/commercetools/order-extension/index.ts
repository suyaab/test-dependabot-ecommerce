import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { z } from "zod";

import { ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";
import { SchemaException } from "@ecommerce/utils";

import { HttpResponseStatus } from "../../../constants";
import { env } from "../../env";

export const bodySchema = z.object({
  action: z.union([
    z.literal("Create"),
    z.literal("Update"),
    z.literal("Delete"),
  ]),
  resource: z.object({
    obj: z
      .object({
        id: z.string(),
        orderNumber: z.string().optional(),
        customerEmail: z.string().optional(),
      })
      .passthrough(),
  }),
});

export default async function updateOrderNumber(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const logger = getLogger({
    correlationId: context.invocationId,
    prefix: "ct-order-extension",
  });

  try {
    const body = await request.json();

    logger.info({ body }, "Order created in CommerceTools");

    const parsedBody = bodySchema.safeParse(body);

    if (!parsedBody.success) {
      throw new SchemaException("Failed to parse", parsedBody.error);
    }

    const { action, resource } = parsedBody.data;
    const order = resource.obj;

    // if order is being updated or deleted
    if (action !== "Create") {
      return {
        status: HttpResponseStatus.OK,
        body: undefined,
      };
    }

    if (
      env.LINGO_ENV !== "prod" &&
      order.customerEmail === "testlingobreakordercreation@test.lingo"
    ) {
      logger.info(
        { env: env.LINGO_ENV, email: order.customerEmail, orderId: order.id },
        "Received test order, returning error to order extension",
      );

      return {
        status: HttpResponseStatus.InternalServerError,
        body: JSON.stringify({
          code: "error",
          message:
            "This is a test order with an email meant to break order extension",
        }),
      };
    }

    const orderService = ServiceLocator.getOrderService();

    // Ensure we set order number on creation when it doesn't exist
    if (order.orderNumber == null || order.orderNumber === "") {
      logger.info("Order Number was not present number");

      const orderNumber = orderService.generateOrderNumber();

      logger.info({ orderNumber }, "Created Order Number");

      return {
        status: HttpResponseStatus.OK,
        body: JSON.stringify({
          actions: [
            {
              action: "setOrderNumber",
              orderNumber,
            },
          ],
        }),
      };
    }

    // If order number exists, do not updated anything
    return {
      status: HttpResponseStatus.OK,
      body: undefined,
    };
  } catch (error) {
    logger.error(error, "Failed to set order number");

    return {
      status: HttpResponseStatus.InternalServerError,
      body: JSON.stringify({
        code: "error",
        message: error,
      }),
    };
  }
}

app.http("ct-order-extension", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: updateOrderNumber,
});
