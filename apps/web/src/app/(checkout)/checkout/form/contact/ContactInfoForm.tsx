import { KeyboardEvent, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { LocationAttributes } from "@ecommerce/analytics";
import { Cart, Product } from "@ecommerce/commerce";
import { CheckoutSession } from "@ecommerce/finance";
import { formatPhone, US_INPUT_LIMITS } from "@ecommerce/utils";

import Button from "~/components/Button";
import ErrorAlert from "~/components/ErrorAlert";
import Checkbox from "~/components/forms/Checkbox";
import PhoneInput from "~/components/forms/PhoneInput";
import TextInput from "~/components/forms/TextInput";
import { submitContactInfo } from "~/app/actions/checkout/submitContactInfo";
import AdditionalPrivacyNotice from "./AdditionalPrivacyNotice";
import { CustomerContactInfo, customerContactInfoSchema } from "./schema";

export interface ContactInfoFormProps {
  cart: Cart;
  checkoutSession: CheckoutSession;
  product: Product;
  moveToNextStep: () => void;
}

export default function ContactInfoForm({
  cart,
  checkoutSession,
  product,
  moveToNextStep,
}: ContactInfoFormProps) {
  const [errorMsg, setErrorMsg] = useState("");

  const formMethods = useForm<CustomerContactInfo>({
    resolver: zodResolver(customerContactInfoSchema, { async: true }),
    defaultValues: cart.contactInfo,
  });

  const { isSubmitting } = formMethods.formState;

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const onSubmit: SubmitHandler<CustomerContactInfo> = async (data, event) => {
    event?.preventDefault();
    setErrorMsg("");

    const resp = await submitContactInfo(
      cart.id,
      cart.version,
      checkoutSession.id,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: formatPhone(data.phone),
        marketingConsent: data.marketingConsent,
        purchaseConsent: data.purchaseConsent,
      },
    );

    if (!resp.ok) {
      setErrorMsg(resp.message);
      return;
    }

    moveToNextStep();
  };

  return (
    <FormProvider {...formMethods}>
      {errorMsg && <ErrorAlert message={errorMsg} />}
      <form
        onSubmit={(event) => void formMethods.handleSubmit(onSubmit)(event)}
        onKeyDown={handleKeyDown}
      >
        <TextInput
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          maxLength={US_INPUT_LIMITS.email}
        />

        <div className="w-full justify-stretch lg:flex lg:gap-x-6">
          <TextInput
            name="firstName"
            label="First name"
            autoComplete="given-name"
            className="lg:grow"
            maxLength={US_INPUT_LIMITS.name}
          />
          <TextInput
            name="lastName"
            label="Last name"
            autoComplete="family-name"
            className="lg:grow"
            maxLength={US_INPUT_LIMITS.name}
          />
        </div>

        <PhoneInput
          id="contactInfoForm_phoneNumber"
          name="phone"
          label="Phone number"
        />
        <div className="my-10 space-y-2">
          <div className="flex items-baseline gap-x-3">
            <Checkbox
              name="marketingConsent"
              id="contactInfoForm_marketingConsent"
              label={
                <>
                  {
                    "(Optional) Email me personalized regular news, content and exclusive offers in accordance with the "
                  }
                  <Link
                    href="/privacy-notice"
                    target="_blank"
                    rel="noreferrer"
                    data-analytics-location={LocationAttributes.CHECKOUT}
                    data-analytics-action="Lingo Privacy Notice"
                    className="underline hover:no-underline"
                  >
                    Lingo Privacy Notice.
                  </Link>
                </>
              }
            />
          </div>
          <div className="my-10">
            <Checkbox
              name="purchaseConsent"
              id="contactInfoForm_purchaseConsent"
              required
              displayInlineErorrs
              label={
                <>
                  I acknowledge the{" "}
                  <Link
                    href="/privacy-notice"
                    target="_blank"
                    rel="noreferrer"
                    data-analytics-location={LocationAttributes.CHECKOUT}
                    data-analytics-action="Lingo Privacy Notice"
                    className="underline hover:no-underline"
                  >
                    Lingo Privacy Notice
                  </Link>{" "}
                  and I accept the{" "}
                  <Link
                    href="/terms-of-sale"
                    target="_blank"
                    rel="noreferrer"
                    data-analytics-location={LocationAttributes.CHECKOUT}
                    data-analytics-action="Terms of Sale"
                    className="underline hover:no-underline"
                  >
                    Terms of Sale
                  </Link>
                  .
                </>
              }
            />
          </div>
        </div>

        <AdditionalPrivacyNotice
          isAutoRenew={
            product.type === "subscription"
              ? product.attributes.autoRenew
              : false
          }
        />

        <div className="flex items-center justify-center">
          <Button
            variant="dark"
            buttonType="submit"
            text="Next"
            className="my-10 w-full lg:w-1/2"
            analyticsActionAttribute="Save Contact Info"
            analyticsLocationAttribute={LocationAttributes.CHECKOUT}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          />
        </div>
      </form>
    </FormProvider>
  );
}
