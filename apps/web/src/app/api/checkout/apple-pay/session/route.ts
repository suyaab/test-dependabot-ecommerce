import { NextResponse } from "next/server";
import { z } from "zod";

import { ServiceLocator } from "@ecommerce/finance";
import { getLogger } from "@ecommerce/logger";

const schema = z.object({
  checkoutSessionId: z.string(),
});

export async function POST(request: Request): Promise<NextResponse> {
  const logger = getLogger({ prefix: "web:api:apple-pay/session" });

  try {
    logger.info("Parsing checkout session from body");
    const bodyParse = schema.safeParse(await request.json());

    if (!bodyParse.success) {
      return NextResponse.json(
        { status: "error", message: "Invalid payload" },
        { status: 400 },
      );
    }

    const checkoutService = ServiceLocator.getCheckoutService();
    const checkoutSession = await checkoutService.getCheckoutSession(
      bodyParse.data.checkoutSessionId,
    );

    if (checkoutSession == null) {
      throw new Error("Unable to find checkout session");
    }

    return NextResponse.json(
      {
        amount: checkoutSession.amount,
        currency: checkoutSession.currency,
        status: "success",
        statusCode: 200,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error(error, "Exception thrown during /apple-pay/session session");

    return NextResponse.json(
      {
        status: "error",
        statusCode: 500,
        error: {
          timestamp: new Date(),
          path: request.url,
          message: error,
        },
      },
      { status: 500 },
    );
  }
}
