import "server-only";

import { Client } from "@harnessio/ff-nodejs-server-sdk";

import { getLogger } from "@ecommerce/logger";

import { env } from "~/env";
import { FeatureFlag, FLAG_DEFAULT_VALUES } from "~/lib/feature-flags/flags";

let client: Client;
let initialized = false;
const logger = getLogger({ prefix: "harness-server" }).child(
  {},
  {
    level: env.LOG_LEVEL ?? "warn",
  },
);

async function getClient() {
  if (client == null) {
    client = new Client(env.HARNESS_SERVER_API_KEY, {
      logger,
    });
  }

  if (!initialized) {
    await client.waitForInitialization();
    initialized = true;
  }

  return client;
}

export async function getFeatureFlag(flag: FeatureFlag): Promise<boolean> {
  try {
    const client = await getClient();

    const target = {
      identifier: "DTC-ServerUser",
      name: "DTC-ServerUser",
    };

    return await client.boolVariation(flag, target, FLAG_DEFAULT_VALUES[flag]);
  } catch (error) {
    logger.error(error, "Get Feature Flag Failed [Server]");
    // if we encounter any issues with harness, return default value
    return FLAG_DEFAULT_VALUES[flag];
  }
}
