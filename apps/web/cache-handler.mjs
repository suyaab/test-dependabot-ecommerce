import { CacheHandler } from "@neshca/cache-handler";
import createLruHandler from "@neshca/cache-handler/local-lru";
import createRedisHandler from "@neshca/cache-handler/redis-strings";
import { createClient } from "redis";

import { getLogger } from "@ecommerce/logger";

const keyPrefix = `web-${process.env.LINGO_ENV}-${process.env.GIT_SHA.slice(
  0,
  10,
)}`;

const logger = getLogger({ prefix: "web:cache-handler" });

logger.info(`Using cache-handler with key: ${keyPrefix}`);

CacheHandler.onCreation(async () => {
  let client;

  const PHASE_PRODUCTION_BUILD = "phase-production-build";

  if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
    try {
      // Create a Redis client.
      client = createClient({
        url: process.env.REDIS_URL,
        password: process.env.REDIS_ACCESS_KEY,
      });

      // Redis won't work without error handling. https://github.com/redis/node-redis?tab=readme-ov-file#events
      client.on("error", (error) => {
        if (typeof process.env.NEXT_PRIVATE_DEBUG_CACHE !== "undefined") {
          logger.info(error, "Redis client error:");
        }
      });
    } catch (error) {
      logger.warn(error, "Failed to create Redis client:");
    }
  }

  if (client) {
    try {
      logger.info("Connecting Redis client...");

      await client.connect();
      logger.info("Redis client connected.");
    } catch (error) {
      logger.warn(error, "Failed to connect Redis client:");

      logger.warn("Disconnecting the Redis client...");
      client
        .disconnect()
        .then(() => {
          logger.info("Redis client disconnected.");
        })
        .catch(() => {
          logger.info(
            "Failed to quit the Redis client after failing to connect.",
          );
        });
    }
  }

  /** @type {import("@neshca/cache-handler").Handler | null} */
  let handler;

  if (client?.isReady) {
    // Create the `redis-stack` Handler if the client is available and connected.
    handler = await createRedisHandler({
      client,
      keyPrefix,
      timeoutMs: 5000,
    });
  } else {
    // Fallback to LRU handler if Redis client is not available.
    handler = createLruHandler();
    logger.warn(
      "Falling back to LRU handler because Redis client is not available.",
    );
  }

  return {
    handlers: [handler],
  };
});

export default CacheHandler;
