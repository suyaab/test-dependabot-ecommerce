"use client";

import React, { Dispatch, SetStateAction } from "react";
import Script from "next/script";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Customer } from "@ecommerce/commerce";
import { CheckoutSession } from "@ecommerce/finance";
import {
  AddressFormData,
  addressFormSchema,
  stateSchema,
} from "@ecommerce/utils";

import AddressInput from "~/components/forms/AddressInput";
import { useToast } from "~/components/Toast";
import { updateCheckoutBillingAddress } from "~/app/actions/account/updateCheckoutBillingAddress";
import { updateCheckoutSessionCustomer } from "~/app/actions/account/updateCheckoutSessionCustomer";
import { VALID_BILLING_ADDRESS_COUNTRY_CODES } from "~/constants";

import "~/app/style/payon.css";

import { LocationAttributes } from "@ecommerce/analytics";

import Spinner from "~/icons/Spinner";

export default function EditPaymentForm({
  customer,
  checkoutSession,
  setEditMode,
  returnTo,
}: {
  customer: Customer;
  checkoutSession: CheckoutSession;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  returnTo: string | undefined;
}) {
  const { toast } = useToast();

  const formMethods = useForm<{ billingAddress: AddressFormData }>({
    resolver: zodResolver(z.object({ billingAddress: addressFormSchema }), {
      async: true,
    }),
    defaultValues: {
      billingAddress: {
        ...customer.billingAddress,
      },
    },
  });

  const { isSubmitting } = formMethods.formState;

  const onSaveClicked: SubmitHandler<{
    billingAddress: AddressFormData;
  }> = async (data, event) => {
    try {
      event?.preventDefault();

      await updateCheckoutBillingAddress(
        checkoutSession.id,
        {
          firstName: customer.firstName,
          lastName: customer.lastName,
          ...data.billingAddress,
          state: stateSchema.parse(data.billingAddress.state),
        },
        customer.email,
      );

      await updateCheckoutSessionCustomer(checkoutSession.id);

      window.wpwl?.executePayment("wpwl-container-card");
    } catch {
      toast({
        title: "Unable to update billing address",
        description: "Please try again later",
        status: "failure",
      });
    }
  };
  const returnToParam = returnTo != null ? `?returnTo=${returnTo}` : "";
  const actionURL = `/account/payment-details/update/${checkoutSession.id}${returnToParam}`;
  return (
    <>
      <h3 className="headline">Edit billing address</h3>

      {/*Billing Address Form*/}
      <FormProvider {...formMethods}>
        <form>
          <div className="my-4 max-w-screen-md">
            <AddressInput
              name="billingAddress"
              supportedCountries={VALID_BILLING_ADDRESS_COUNTRY_CODES}
              addressToSet={customer.billingAddress}
            />
          </div>
        </form>
      </FormProvider>

      <div className="mt-16">
        <h3 className="headline">Edit payment details</h3>
        <p className="mb-6 mt-2">
          A temporary authorization of $1 will be placed on the payment method
          you provide below and will be removed later.
        </p>

        <Script id="payonOptions" src="/scripts/payon/options.js" />

        {/*PayOn gets this form by the `paymentWidgets` class name and uses it to securely collect Payment information */}
        <form
          action={actionURL}
          className="paymentWidgets"
          data-brands="VISA MASTER AMEX"
          aria-label="payonForm"
        />
      </div>

      <div className="my-6 flex justify-end">
        <div className="flex gap-6">
          <button
            onClick={() => setEditMode(false)}
            className="button-outline"
            data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
            data-analytics-action="Cancel Edit payment details"
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={(event) =>
              void formMethods.handleSubmit(onSaveClicked)(event)
            }
            className="button-dark w-full disabled:bg-charcoal/50"
            data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
            data-analytics-action="Save payment details"
            disabled={isSubmitting}
          >
            <span className="relative px-6 text-center">
              {isSubmitting && (
                <Spinner className="spinner absolute left-0 top-0 mr-2 inline-block size-4 text-white" />
              )}
              <span>Save</span>
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
