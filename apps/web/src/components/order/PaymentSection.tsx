import { headers } from "next/headers";

import {
  ServiceLocator as CommerceServiceLocator,
  Order,
} from "@ecommerce/commerce";
import { ServiceLocator as FinanceSL, Payment } from "@ecommerce/finance";
import { getLogger } from "@ecommerce/logger";
import { formatCurrency } from "@ecommerce/utils";

import PaymentMethodIcon from "~/components/PaymentMethodIcon";

export default async function PaymentSection({
  order,
  content,
}: {
  order: Order;
  content: {
    title: string;
    subtotal: string;
    shipping: string;
    tax: string;
    total: string;
    expire: string;
  };
}) {
  const logger = getLogger({
    prefix: "web:orderConfirmation:PaymentSection",
    headers: headers(),
  });

  try {
    const paymentService = CommerceServiceLocator.getPaymentService();

    if (order?.orderNumber == null) {
      throw new Error("Unable to find order number");
    }

    // TODO: Maybe there is an opportunity for the PaymentGateway to be able to lookup Payment via OrderNumber
    const paymentDetails = await paymentService.getPaymentReference(
      order.orderNumber,
    );

    let payment: Payment | undefined;

    if (paymentDetails?.interfaceId != null) {
      const paymentGateway = FinanceSL.getPaymentGateway();
      payment = await paymentGateway.getPayment(paymentDetails.interfaceId);
    }

    return (
      <div className="mb-16 space-y-4 lg:mb-0 [&>p]:flex [&>p]:justify-between">
        <h3 className="subtitle mb-6 font-medium">{content.title}</h3>
        <p>
          <span>{content.subtotal} </span>
          <span>{formatCurrency(order.currencyCode, order.totalNet)}</span>
        </p>
        <p>
          <span>{content.shipping} </span>
          <span>{formatCurrency(order.currencyCode, 0)}</span>
          {/* TODO: Replace hardcoded shipping price */}
        </p>
        <p>
          <span>{content.tax} </span>
          <span>{formatCurrency(order.currencyCode, order.totalTax)}</span>
        </p>
        <div className="border-b border-charcoal" />
        <p className="subtitle">
          <span>{content.total} </span>
          <span>{formatCurrency(order.currencyCode, order.totalGross)}</span>
        </p>

        {/*Only show payment details if present*/}
        {payment != null && (
          <div className="pt-2">
            <p>
              <PaymentMethodIcon brand={payment.paymentMethod.brand} />

              <span className="relative bottom-1.5 inline-block text-xs">
                **** **** **** {payment.paymentMethod.card.last4Digits}
              </span>
            </p>
            <p className="text-xs">
              {content.expire}{" "}
              {`${payment.paymentMethod.card.expiryMonth}/${payment.paymentMethod.card.expiryYear}`}
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    logger.error(error, "Failed to load payment section");
    // TODO: confirm its ok to omit this part if something goes wrong
    return null;
  }
}
