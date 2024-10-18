import CheckoutProcessingException from "./CheckoutProcessingException";

export default class PaymentFailedException extends CheckoutProcessingException {
  cartId?: string | undefined;
  checkoutSessionId?: string | undefined;

  constructor(message: string, checkoutSessionId: string, cartId: string) {
    super(message);

    this.name = "PaymentFailedException";

    this.status = 400;
    this.checkoutSessionId = checkoutSessionId;
    this.cartId = cartId;
  }
}
