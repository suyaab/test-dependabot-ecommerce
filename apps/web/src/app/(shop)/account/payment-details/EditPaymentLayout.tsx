"use client";

import React, { ReactNode, useState } from "react";

import { LocationAttributes } from "@ecommerce/analytics";
import { Customer } from "@ecommerce/commerce";
import { CheckoutSession } from "@ecommerce/finance";

import AccountEditPaymentForm from "./EditPaymentForm";

export default function AccountEditPaymentLayout({
  customer,
  checkoutSession,
  returnTo,
  children,
}: {
  customer: Customer;
  checkoutSession: CheckoutSession;
  returnTo: string | undefined;
  children: ReactNode;
}) {
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="my-4">Payment Details</h2>
        {!editMode && (
          <button
            onClick={() => {
              setEditMode(!editMode);
            }}
            className="button-dark"
            data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
            data-analytics-action="Edit payment method"
          >
            Edit payment method
          </button>
        )}
      </div>

      <hr className="my-4" />

      <div className={editMode ? "block" : "hidden"}>
        <AccountEditPaymentForm
          customer={customer}
          checkoutSession={checkoutSession}
          setEditMode={setEditMode}
          returnTo={returnTo}
        />
      </div>

      <div className={!editMode ? "block" : "hidden"}>{children}</div>
    </>
  );
}
