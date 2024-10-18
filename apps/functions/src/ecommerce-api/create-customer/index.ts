import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { z } from "zod";

import { ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";

import { HttpResponseStatus } from "../../../constants";

const createCustomerSchema = z.object({
  externalId: z.string(),
  firstName: z.string().min(1, { message: "First name cannot be empty" }),
  lastName: z.string().min(1, { message: "Last name cannot be empty" }),
  email: z.string().min(1, { message: "Email cannot be empty" }),
  phone: z.string().min(4, { message: "Phone must contain at least 4 digits" }),
});

export async function createCustomer(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const logger = getLogger({
    correlationId: context.invocationId,
    prefix: "create-customer",
  });
  try {
    const body = await request.json();

    logger.info({ body }, "Received customer creation request");

    const parsedCreateCustomerRequest = createCustomerSchema.safeParse(body);

    if (!parsedCreateCustomerRequest.success) {
      logger.error(
        { errors: parsedCreateCustomerRequest.error.errors },
        "Failed to parse customer body",
      );

      return {
        status: HttpResponseStatus.BadRequest,
        body: JSON.stringify({
          code: "error",
          message: parsedCreateCustomerRequest.error.errors,
        }),
      };
    }

    logger.info(
      { customerCreationRequest: parsedCreateCustomerRequest.data },
      "Successfully parsed customer creation body",
    );

    const { externalId, firstName, lastName, email, phone } =
      parsedCreateCustomerRequest.data;

    const customerService = ServiceLocator.getCustomerService();

    const existingCustomer =
      await customerService.getCustomerByExternalId(externalId);

    if (existingCustomer != null) {
      return {
        status: HttpResponseStatus.BadRequest,
        body: JSON.stringify({
          code: "error",
          message: "Customer already exists",
        }),
      };
    }

    const customer = await customerService.createCustomer(
      externalId,
      firstName,
      lastName,
      email,
      phone,
    );

    logger.info(`Customer created successfully ${customer.id}`);

    return {
      status: HttpResponseStatus.OK,
    };
  } catch (error) {
    logger.error(error, "Error creating customer");
    if (error instanceof Error && error.name === "BadRequest") {
      return {
        status: HttpResponseStatus.BadRequest,
        body: JSON.stringify({
          code: "error",
          message: error.message,
        }),
      };
    }

    return {
      status: HttpResponseStatus.InternalServerError,
      body: JSON.stringify({
        code: "error",
        message: "There was an error creating the customer",
      }),
    };
  }
}

app.http("create-customer", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: createCustomer,
});
