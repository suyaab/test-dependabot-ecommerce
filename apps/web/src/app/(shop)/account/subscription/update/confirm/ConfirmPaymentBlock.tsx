import { Customer } from "@ecommerce/commerce";
import { ServiceLocator } from "@ecommerce/finance";

import Hyperlink from "~/components/Hyperlink";
import PaymentMethodIcon from "~/components/PaymentMethodIcon";

export default async function ConfirmPaymentBlock({
  customer,
  content,
  productId,
}: {
  customer: Customer;
  content: { title: string; buttonText: string };
  productId: string;
}) {
  const paymentGateway = ServiceLocator.getPaymentGateway();
  const { title, buttonText } = content;
  const returnTo = `subscription/update/confirm?productId=${productId}`;
  if (customer.subscription?.paymentMethodId == null) {
    return (
      <div className="border-brown mt-4 w-full rounded-lg border-2 p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-3 font-bold text-red-500">No payment details</p>

            <p className="mb-3">
              Please edit your saved payment details before updating
              subscription
            </p>
          </div>

          <a
            href={`/account/payment-details?returnTo=${encodeURIComponent(
              returnTo,
            )}`}
            className="underline"
          >
            Edit
          </a>
        </div>
      </div>
    );
  }

  const paymentMethod = await paymentGateway.getSavedPaymentMethod(
    customer.subscription.paymentMethodId,
  );

  return (
    <div className="mt-14 w-full flex-col">
      <h5 className="mb-3">{title}</h5>
      <div className="border-brown w-full rounded-xl border-2 bg-white p-8">
        <div className="md:flex md:justify-between">
          <div>
            <p>
              <PaymentMethodIcon brand={paymentMethod.brand} />

              <span className="relative bottom-1.5 inline-block text-xs">
                **** **** **** {paymentMethod.card.last4Digits}
              </span>
            </p>
            <h6>
              Expires {paymentMethod.card.expiryMonth}/
              {paymentMethod.card.expiryYear}
            </h6>
          </div>
          <div className="h-full">
            <Hyperlink
              text={buttonText}
              url={`/account/payment-details?returnTo=${encodeURIComponent(
                returnTo,
              )}`}
              variant="outline"
              className="mt-8 flex w-full items-center justify-center md:mt-0 md:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
