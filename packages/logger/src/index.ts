import { randomUUID } from "crypto";
import pino, { Logger as PinoLogger } from "pino";

let pinoLogger: PinoLogger;

export default getDefaultLogger();

export type Logger = PinoLogger;

function getDefaultLogger() {
  return pino({
    level: process.env?.LOG_LEVEL ?? "info", // TODO: can we use `env` here? called during build
  });
}

export function getLogger(options?: {
  correlationId?: string;
  prefix?: string;
  headers?: Headers;
}): PinoLogger {
  if (pinoLogger == null) {
    pinoLogger = getDefaultLogger();
  }

  let pinoLoggerChild = pinoLogger;

  if (options?.prefix != null) {
    pinoLoggerChild = pinoLoggerChild.child({ prefix: options?.prefix });
  }

  if (options?.correlationId != null) {
    return pinoLoggerChild.child({ correlationId: options.correlationId });
  }

  const correlationIdFromHeaders = options?.headers?.get("X-Correlation-Id");
  if (correlationIdFromHeaders != null) {
    return pinoLoggerChild.child({ correlationId: correlationIdFromHeaders });
  }

  return pinoLoggerChild.child({ correlationId: `rand-${randomUUID()}` });
}
