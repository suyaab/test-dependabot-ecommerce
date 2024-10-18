import CheckoutProcessingException from "./CheckoutProcessingException";

export default class ConvertOrderException extends CheckoutProcessingException {
  constructor(message: string) {
    super(message);

    this.name = "ConvertOrderException";

    this.status = 500;
  }
}
