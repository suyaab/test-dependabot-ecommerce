import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";
import { z } from "zod";

import { env } from "~/env";

const typeSearchParamSchema = z.union([z.literal("page"), z.literal("layout")]);

// This is required for NextJS API routes, not sure if it's fixed in v14
// eslint-disable-next-line @typescript-eslint/require-await
export async function POST(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  const secret = request.nextUrl.searchParams.get("secret");
  const type = typeSearchParamSchema.parse(
    request.nextUrl.searchParams.get("type") ?? "page",
  );
  const tag = request.nextUrl.searchParams.get("tag");

  if (secret !== env.ON_DEMAND_REVALIDATION_SECRET) {
    return Response.json(
      {
        message: "On-Demand ISR - Invalid Token",
        instance: env.WEBSITE_INSTANCE_ID,
      },
      { status: 401 },
    );
  }

  // Revalidate tag only
  if (tag != null) {
    revalidateTag(tag);

    return Response.json({
      revalidated: true,
      now: Date.now(),
      instance: env.WEBSITE_INSTANCE_ID,
      tag,
    });
  }

  // Revalidate path by type
  if (path != null) {
    revalidatePath(path, type);
    return Response.json({
      revalidated: true,
      now: Date.now(),
      instance: env.WEBSITE_INSTANCE_ID,
      type,
      path,
    });
  }

  // Return message if required params missing
  return Response.json(
    {
      message: "Invalid request, params missing",
      instance: env.WEBSITE_INSTANCE_ID,
      tag,
      type,
      path,
    },
    { status: 400 },
  );
}
