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
        customerNumber: z.string().optional(),
      })
      .passthrough(),
  }),
});

export default async function updateCustomerNumber(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const logger = getLogger({
    correlationId: context.invocationId,
    prefix: "ct-customer-extension",
  });

  try {
    const body = await request.json();

    logger.info({ body }, "Customer created in CommerceTools");

    const parsedBody = bodySchema.safeParse(body);

    if (!parsedBody.success) {
      throw new SchemaException("Failed to parse", parsedBody.error);
    }

    const { action, resource } = parsedBody.data;
    const customer = resource.obj;

    // if customer is being updated or deleted
    if (action !== "Create") {
      return {
        status: HttpResponseStatus.OK,
        body: undefined,
      };
    }

    const customerService = ServiceLocator.getCustomerService();

    // Ensure we set customer number on creation when it doesn't exist
    if (customer?.customerNumber == null || customer.customerNumber === "") {
      logger.info("Customer Number was not present number");

      const customerNumber = customerService.generateCustomerNumber();

      logger.info({ customerNumber }, "Created Customer Number");

      return {
        status: HttpResponseStatus.OK,
        body: JSON.stringify({
          actions: [
            {
              action: "setCustomerNumber",
              customerNumber: customerNumber,
            },
          ],
        }),
      };
    }

    // If customer number exists, do not updated anything
    return {
      status: HttpResponseStatus.OK,
      body: undefined,
    };
  } catch (error) {
    logger.error(error, "Failed to set customer number");

    return {
      status: HttpResponseStatus.InternalServerError,
      body: JSON.stringify({
        code: "error",
        message: error,
      }),
    };
  }
}

app.http("ct-customer-extension", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: updateCustomerNumber,
});
