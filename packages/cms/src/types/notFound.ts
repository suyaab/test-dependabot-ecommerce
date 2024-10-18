import { z } from "zod";

import { MultipleContentItemsSchema } from "./common";

export const NotFoundContentSchema = z.object({
  suptitle: z.string(),
  title: z.string(),
  items: MultipleContentItemsSchema,
});

export type NotFoundContent = z.infer<typeof NotFoundContentSchema>;
