import { ZodError } from "zod";

export const stringifyError = (e: unknown) => {
  if (e instanceof ZodError) {
    return `Schema Parse Errors: ${JSON.stringify(e.errors)}`;
  } else {
    return String(e);
  }
};
