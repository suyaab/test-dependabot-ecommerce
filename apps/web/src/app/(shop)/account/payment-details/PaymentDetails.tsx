"use client";

import { Customer } from "@ecommerce/commerce";
import { PaymentMethod } from "@ecommerce/finance";

import PaymentMethodIcon from "~/components/PaymentMethodIcon";

export default function AccountPaymentDetails({
  customer,
  paymentMethod,
}: {
  customer: Customer;
  paymentMethod?: PaymentMethod;
}) {
  if (paymentMethod == null) {
    return (
      <div>
        <p className="text-red">
          No payment method found. Please add one by clicking &quot;Edit payment
          method&quot; above.
        </p>
      </div>
    );
  }

  if (customer?.billingAddress == null) {
    return (
      <div>
        {/* Billing Address row */}
        <div className="my-4 flex justify-between">
          <p>Billing address</p>
          <div className="flex flex-col items-end">
            <p className="text-red">No address found</p>
          </div>
        </div>

        {/* Card Number row */}
        <div className="my-4 flex justify-between">
          <p>Card number</p>

          <div className="flex items-end gap-2">
            <PaymentMethodIcon brand={paymentMethod.brand} />
            <p>**** **** **** {paymentMethod.card.last4Digits}</p>
          </div>
        </div>

        {/* Card Expiration Date row */}
        <div className="my-4 flex justify-between">
          <p>Expiration Date (MM/YY)</p>
          <p>
            {paymentMethod.card.expiryMonth}
            {"/"}
            {paymentMethod.card.expiryYear}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Billing Address row */}
      <div className="my-4 flex justify-between">
        <p>Billing address</p>
        <div className="flex flex-col items-end">
          <p>
            {customer.firstName} {customer.lastName}
          </p>
          <p>{customer?.billingAddress.addressLine1}</p>

          {customer.billingAddress.addressLine2 != null && (
            <p>{customer.billingAddress.addressLine2}</p>
          )}

          <p>
            {customer?.billingAddress.city}
            {customer?.billingAddress.city != null ? ", " : ""}
            {customer?.billingAddress.state}
          </p>
          <p>{customer?.billingAddress.postalCode}</p>
          <p>{customer?.billingAddress.countryCode}</p>
        </div>
      </div>

      {/* Name on card row */}
      <div className="my-4 flex justify-between">
        <p>Name on card</p>
        <p>
          {customer?.billingAddress?.firstName ?? ""}{" "}
          {customer?.billingAddress?.lastName ?? ""}
        </p>
      </div>

      {/* Card Number row */}
      <div className="my-4 flex justify-between">
        <p>Card number</p>

        <div className="flex items-end gap-2">
          <PaymentMethodIcon brand={paymentMethod.brand} />
          <p>**** **** **** {paymentMethod.card.last4Digits}</p>
        </div>
      </div>

      {/* Card Expiration Date row */}
      <div className="my-4 flex justify-between">
        <p>Expiration Date (MM/YY)</p>
        <p>
          {paymentMethod.card.expiryMonth}
          {"/"}
          {paymentMethod.card.expiryYear}
        </p>
      </div>
    </div>
  );
}
