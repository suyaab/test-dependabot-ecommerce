import { z } from "zod";

export const logLevelSchema = z
  .union([
    z.literal("debug"),
    z.literal("error"),
    z.literal("info"),
    z.literal("warn"),
    z.literal("fatal"),
    z.literal("trace"),
    z.literal("silent"),
  ])
  .optional();
