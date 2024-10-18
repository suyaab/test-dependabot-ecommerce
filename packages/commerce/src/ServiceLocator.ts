import { CartService } from "./Cart";
import { CustomerService } from "./Customer";
import { DiscountCodeService } from "./DiscountCode";
import {
  CTCartService,
  CTCustomerSDK,
  CTDiscountCodeService,
  CTOrderService,
  CTPaymentService,
  CTProductServiceSdk,
  CTSubscriptionSDK,
} from "./integrations/commercetools";
import { OrderService } from "./Order";
import { PaymentService } from "./Payment";
import { ProductService } from "./Products";
import { SubscriptionService } from "./Subscription";

class ServiceLocator {
  private productService: ProductService | undefined;
  private cartService: CartService | undefined;
  private customerService: CustomerService | undefined;
  private orderService: OrderService | undefined;
  private subscriptionService: SubscriptionService | undefined;
  private paymentService: PaymentService | undefined;
  private discountCodeService: DiscountCodeService | undefined;

  // CART SERVICE
  getCartService(): CartService {
    if (this.cartService == undefined) {
      this.cartService = new CTCartService();
    }
    return this.cartService;
  }

  setCartService(cartService: CartService) {
    this.cartService = cartService;
  }

  // CUSTOMER SERVICE
  getCustomerService(): CustomerService {
    if (this.customerService == undefined) {
      this.customerService = new CTCustomerSDK();
    }

    return this.customerService;
  }

  setCustomerService(customerService: CustomerService) {
    this.customerService = customerService;
  }

  // PAYMENT SERVICE
  getPaymentService(): PaymentService {
    if (this.paymentService == undefined) {
      return (this.paymentService = new CTPaymentService());
    }

    return this.paymentService;
  }

  setPaymentService(paymentService: PaymentService) {
    this.paymentService = paymentService;
  }

  // PRODUCT SERVICE
  getProductService(): ProductService {
    if (this.productService == undefined) {
      this.productService = new CTProductServiceSdk();
    }

    return this.productService;
  }

  setProductService(productService: ProductService) {
    this.productService = productService;
  }

  getOrderService(): OrderService {
    if (this.orderService == undefined) {
      this.orderService = new CTOrderService();
    }
    return this.orderService;
  }

  setOrderService(orderService: OrderService) {
    this.orderService = orderService;
  }

  getSubscriptionService(): SubscriptionService {
    if (this.subscriptionService == undefined) {
      this.subscriptionService = new CTSubscriptionSDK();
    }
    return this.subscriptionService;
  }
  setSubscriptionService(subscriptionService: SubscriptionService) {
    this.subscriptionService = subscriptionService;
  }

  getDiscountCodeService() {
    if (this.discountCodeService == undefined) {
      this.discountCodeService = new CTDiscountCodeService();
    }
    return this.discountCodeService;
  }

  setDiscountCodeService(discountCodeService: DiscountCodeService) {
    this.discountCodeService = discountCodeService;
  }
}

const serviceLocator = new ServiceLocator();

export default serviceLocator;
