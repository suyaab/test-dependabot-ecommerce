export class SMHandlerException extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);

    this.name = "SMHandlerException";
  }
}

export class SMEmailException extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);

    this.name = "SMEmailException";
  }
}
