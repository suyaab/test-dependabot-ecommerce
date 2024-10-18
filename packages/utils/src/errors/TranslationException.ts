import { ZodError, ZodIssue } from "zod";

export default class TranslationException extends Error {
  error: ZodIssue[];

  constructor(message: string, error: ZodError) {
    super(message);

    this.name = "TranslationException";
    this.error = error.errors;
  }
}
