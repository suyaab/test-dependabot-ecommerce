import { z } from "zod";

export const lingoEnvSchema = z.union([
  z.literal("dev"),
  z.literal("qa"),
  z.literal("prod"),
  z.literal("stg"),
]);

export type LingoEnv = z.infer<typeof lingoEnvSchema>;
