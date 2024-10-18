import CheckoutProcessingException from "./CheckoutProcessingException";

export default class CreateCustomerException extends CheckoutProcessingException {
  cartId: string;
  userId?: string | undefined;

  constructor(message: string, cartId: string, userId: string | undefined) {
    super(message);

    this.name = "CreateCustomerException";

    this.status = 500;
    this.cartId = cartId;
    this.userId = userId;
  }
}
