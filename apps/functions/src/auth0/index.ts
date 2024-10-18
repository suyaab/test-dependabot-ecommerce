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

import { HttpResponseStatus } from "../../constants";

export const bodySchema = z.object({
  email: z.string().email(),
});

export default async function getCustomerByEmail(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const logger = getLogger({
    correlationId: context.invocationId,
    prefix: "auth0-get-customer",
  });

  try {
    const body = await request.json();

    logger.info({ body }, "Auth0 requesting customer information");

    const parsedBody = bodySchema.safeParse(body);

    if (!parsedBody.success) {
      throw new SchemaException(
        "Failed to parse auth0 email",
        parsedBody.error,
      );
    }

    const { email } = parsedBody.data;

    const customerService = ServiceLocator.getCustomerService();

    const customer = await customerService.getCustomerByEmail(email);

    if (customer === undefined) {
      return {
        status: HttpResponseStatus.NotFound,
      };
    }

    logger.info({ customerId: customer.id }, "Found Customer Details");

    return {
      status: HttpResponseStatus.OK,
      body: JSON.stringify({
        id: customer.id,
        createdAt: customer.createdAt,
        email: customer.email,
        externalId: customer.externalId,
        shippingCountryCode: customer.shippingAddress?.countryCode ?? "US",
      }),
    };
  } catch (error) {
    logger.error(error, "Failed to get customer");

    return {
      status: HttpResponseStatus.InternalServerError,
      body: JSON.stringify({
        code: "error",
        message: error,
      }),
    };
  }
}

app.http("auth0-get-customer", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: getCustomerByEmail,
});
