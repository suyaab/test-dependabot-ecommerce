import { ZodSchema } from "zod";

export type ValidTextInput =
  | { valid: true }
  | { valid: false; message: string };

export async function formatTextInputValidation(
  schema: ZodSchema,
  value: unknown,
): Promise<ValidTextInput> {
  const parse = await schema.safeParseAsync(value);

  if (!parse.success) {
    const message = parse.error.formErrors.formErrors[0] ?? "";
    return { valid: false, message };
  }

  return { valid: true };
}
