import { z } from "zod";

import { SchemaException } from "@ecommerce/utils";

import { env } from "./env";

export const authenticationResponse = z
  .object({
    role: z.string().optional(),
    user_name: z.string().optional(),
    sessionId: z.string().optional(),
    tenantGuid: z.string().optional(),
    access_token: z.string(),
    orgGroupId: z.string().optional(),
    orgGroupGuid: z.string().optional(),
    guid: z.string().optional(),
    expires_in: z.number().optional(),
    jti: z.string().optional(),
  })
  .passthrough();

export async function authenticate(): Promise<string> {
  const response = await fetch(
    `${env.ONETRUST_URL}/api/access/v1/oauth/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: env.ONETRUST_CLIENT_ID,
        client_secret: env.ONETRUST_CLIENT_SECRET,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to authenticate OneTrust: ${response.status}`);
  }

  const authParse = authenticationResponse.safeParse(await response.json());

  if (!authParse.success) {
    throw new SchemaException(
      "Unable to parse OneTrust authentication",
      authParse.error,
    );
  }

  return authParse.data.access_token;
}
