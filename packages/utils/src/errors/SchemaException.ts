import { ZodError } from "zod";

export default class SchemaException extends Error {
  errors: string;

  constructor(message: string, error: ZodError) {
    super(`${message} - ${JSON.stringify(error.errors)}`);

    this.name = "SchemaException";
    this.errors = JSON.stringify(error.errors);
  }
}
