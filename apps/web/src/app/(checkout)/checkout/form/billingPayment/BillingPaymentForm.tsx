"use client";

import { KeyboardEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Cart } from "@ecommerce/commerce";
import { CheckoutSession, PaymentMethodBrand } from "@ecommerce/finance";
import { Address, addressSchema, stateSchema } from "@ecommerce/utils";

import ErrorAlert from "~/components/ErrorAlert";
import AddressInput from "~/components/forms/AddressInput";
import TextInput from "~/components/forms/TextInput";
import { submitBillingAddress } from "~/app/actions/checkout/addresses/submitBillingAddress";
import { VALID_BILLING_ADDRESS_COUNTRY_CODES } from "~/constants";
import ExpressPay from "./express/ExpressPay";
import { BillingPaymentFormData, billingPaymentFormSchema } from "./schema";

import "~/app/style/payon.css";

import { useRouter } from "next/navigation";

import { LocationAttributes } from "@ecommerce/analytics";

import Button from "~/components/Button";
import PaymentMethodIcon from "~/components/PaymentMethodIcon";
import { completeCoreCheckout } from "~/app/actions/checkout/completeCoreCheckout";
import cn from "~/lib/utils";

interface BillingPaymentFormProps {
  cart: Cart;
  checkoutSession: CheckoutSession;
}

export default function BillingPaymentForm({
  cart,
  checkoutSession,
}: BillingPaymentFormProps) {
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const getBillingAddress = (
    data: BillingPaymentFormData,
    cart: Cart,
  ): Address => {
    if (billingSameAsShipping || data.billingAddress == null) {
      // use shipping address for billing address
      return addressSchema.parse({
        firstName: cart.contactInfo?.firstName ?? "",
        lastName: cart.contactInfo?.lastName ?? "",
        ...cart.shippingAddress,
      });
    }

    // retrieve first and last name from form input
    return {
      ...data.billingAddress,
      state: stateSchema.parse(data.billingAddress.state), // verify state isn't empty string
    };
  };

  const completeCheckout = async () => {
    const response = await completeCoreCheckout(cart.id);

    if (!response.ok) {
      setErrorMessage(response.message);
      return;
    }
    router.push(`/order-confirmation/${response.orderId}`);
  };

  const onBuyNowClicked: SubmitHandler<BillingPaymentFormData> = async (
    data,
    event,
  ) => {
    event?.preventDefault();

    try {
      setErrorMessage("");

      const billingAddress = getBillingAddress(data, cart);

      await submitBillingAddress(
        cart.id,
        cart.version,
        checkoutSession.id,
        billingAddress,
      );
      if (cart.totalGross === 0) {
        await completeCheckout();
        return;
      }

      // execute PayOn iFrame and automatically redirect to `/checkout/processing`
      window.wpwl?.executePayment("wpwl-container-card");
    } catch {
      setErrorMessage("An unexpected error occurred, please try again later.");
      return;
    }
  };

  const formMethods = useForm<BillingPaymentFormData>({
    resolver: zodResolver(billingPaymentFormSchema),
  });

  const { isSubmitting } = formMethods.formState;

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <div className="mb-18">
      <div className="flex flex-col">
        <div className="space-y-8">
          <ExpressPay cart={cart} />
          {errorMessage && <ErrorAlert message={errorMessage} />}
          <div className={cn({ hidden: cart.totalGross === 0 })}>
            <FormProvider {...formMethods}>
              <form onKeyDown={handleKeyDown}>
                {/*Billing Address is same as Shipping*/}
                <div className="mt-3 flex items-center gap-x-3">
                  <input
                    id="billingSameShipping"
                    type="checkbox"
                    className="checkbox mr-1"
                    checked={billingSameAsShipping}
                    onChange={() => {
                      setBillingSameAsShipping(!billingSameAsShipping);
                      formMethods.resetField("billingAddress");
                    }}
                  />

                  <label htmlFor="billingSameShipping">
                    <span
                      className={
                        (cn({ hidden: cart.totalGross === 0 }), "text-base")
                      }
                    >
                      Billing address is the same as shipping address
                    </span>
                  </label>
                </div>

                {/*Billing Address */}
                {!billingSameAsShipping && (
                  <>
                    <h3 className="headline mt-3">Billing address</h3>

                    <div className="w-full justify-stretch lg:flex lg:gap-x-6">
                      {/*First Name*/}
                      <TextInput
                        name="billingAddress.firstName"
                        label="First name"
                        autoComplete="given-name"
                        className="lg:grow"
                      />
                      <TextInput
                        name="billingAddress.lastName"
                        label="Last name"
                        autoComplete="family-name"
                        className="lg:grow"
                      />
                    </div>

                    {/*Billing Address Form*/}
                    <AddressInput
                      name="billingAddress"
                      supportedCountries={VALID_BILLING_ADDRESS_COUNTRY_CODES}
                      addressToSet={cart.billingAddress}
                    />
                  </>
                )}
              </form>
            </FormProvider>
          </div>
          {/* Payment Form */}
          <div className={cn({ hidden: cart.totalGross !== 0 })}>
            <p className="mt-4 text-lg">
              Your order is free, no payment is required.
            </p>
          </div>
          <div
            className={cn({ hidden: cart.totalGross === 0 })}
            data-testid="payonContainer"
          >
            <h3 className="headline flex justify-between">
              <span>Card details</span>
              <span className="flex items-center">
                {["VISA", "MASTERCARD", "AMEX"].map((brand) => (
                  <PaymentMethodIcon
                    key={brand}
                    brand={brand as PaymentMethodBrand}
                  />
                ))}
              </span>
            </h3>

            <div>
              <form
                action={`/checkout/processing/${cart.id}`}
                className="paymentWidgets"
                data-brands="VISA MASTER AMEX"
                aria-label="payonForm"
              />
            </div>
          </div>

          <Button
            onClick={() => void formMethods.handleSubmit(onBuyNowClicked)()}
            variant="dark"
            buttonType="submit"
            text="Order and Pay"
            className="my-10 w-full lg:w-1/2"
            analyticsActionAttribute="Order and Pay"
            analyticsLocationAttribute={LocationAttributes.CHECKOUT}
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
