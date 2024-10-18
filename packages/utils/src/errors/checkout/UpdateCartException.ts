import CheckoutProcessingException from "./CheckoutProcessingException";

export default class UpdateCartException extends CheckoutProcessingException {
  constructor(message: string) {
    super(message);

    this.name = "UpdateCartException";

    this.status = 500;
  }
}
