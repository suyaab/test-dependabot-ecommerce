import { NextRequest } from "next/server";

import logger from "@ecommerce/logger";

import unsubscribe from "~/app/actions/unsubscribe";

/**
 * This API is used to "one-click" unsubscribe a user from marketing emails.
 * We need this in addition to the unsubscribe page itself
 */
export async function POST(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (userId == null) {
    return Response.json({ message: "User ID is required" }, { status: 400 });
  }

  await unsubscribe(userId).catch((error) => {
    logger.error(
      error,
      `Error occurred during an unsubscribe API call (user ID: ${userId}`,
    );

    return Response.json(
      { message: "Error occurred during unsubscribe" },
      { status: 500 },
    );
  });

  return Response.json({ message: "Unsubscribe successful" });
}
