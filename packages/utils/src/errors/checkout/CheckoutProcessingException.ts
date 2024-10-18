export default class CheckoutProcessingException extends Error {
  status: 200 | 400 | 500;

  protected constructor(message: string) {
    super(message);

    this.name = "CheckoutProcessingException";
    this.status = 500;
  }
}
