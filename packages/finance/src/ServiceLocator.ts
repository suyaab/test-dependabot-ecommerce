import { CheckoutService } from "./CheckoutService";
import AvataxSDK from "./integrations/avalara/AvaTaxSDK";
import PayOnCheckoutService from "./integrations/payOn/PayOnCheckoutService";
import PayOnPaymentGateway from "./integrations/payOn/PayOnPaymentGateway";
import { PaymentGateway } from "./PaymentGateway";
import { TaxService } from "./TaxService";

class ServiceLocator {
  private checkoutService: CheckoutService | undefined;
  private paymentGateway: PaymentGateway | undefined;
  private taxService: TaxService | undefined;

  getCheckoutService(): CheckoutService {
    if (this.checkoutService == undefined) {
      this.checkoutService = new PayOnCheckoutService();
    }
    return this.checkoutService;
  }

  setCheckoutService(checkoutService: CheckoutService) {
    this.checkoutService = checkoutService;
  }

  getPaymentGateway(): PaymentGateway {
    if (this.paymentGateway == undefined) {
      this.paymentGateway = new PayOnPaymentGateway();
    }
    return this.paymentGateway;
  }

  setPaymentGateway(paymentGateway: PaymentGateway) {
    this.paymentGateway = paymentGateway;
  }

  getTaxService(): TaxService {
    if (this.taxService == undefined) {
      this.taxService = new AvataxSDK();
    }
    return this.taxService;
  }

  setTaxService(taxService: TaxService) {
    this.taxService = taxService;
  }
}

const serviceLocator = new ServiceLocator();

export default serviceLocator;
