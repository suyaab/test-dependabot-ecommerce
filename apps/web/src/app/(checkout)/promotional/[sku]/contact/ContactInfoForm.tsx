import { KeyboardEvent, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { LocationAttributes } from "@ecommerce/analytics";
import { Cart } from "@ecommerce/commerce";
import { formatPhone } from "@ecommerce/utils";

import Button from "~/components/Button";
import ErrorAlert from "~/components/ErrorAlert";
import Checkbox from "~/components/forms/Checkbox";
import PhoneInput from "~/components/forms/PhoneInput";
import TextInput from "~/components/forms/TextInput";
import { submitPromoContactInfo } from "~/app/actions/promotional/submitPromoContactInfo";
import { CustomerContactInfo, customerContactInfoSchema } from "./schema";

interface ContactInfoFormProps {
  cart: Cart;
  moveToNextStep: () => void;
}

export default function ContactInfoForm({
  cart,
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

    const resp = await submitPromoContactInfo(cart.id, cart.version, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: formatPhone(data.phone),
      marketingConsent: data.marketingConsent,
      purchaseConsent: data.purchaseConsent,
    });

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
        />

        <div className="w-full justify-stretch lg:flex lg:gap-x-6">
          <TextInput
            name="firstName"
            label="First name"
            autoComplete="given-name"
            className="lg:grow"
          />
          <TextInput
            name="lastName"
            label="Last name"
            autoComplete="family-name"
            className="lg:grow"
          />
        </div>

        <PhoneInput
          id="contactInfoForm_phoneNumber"
          name="phone"
          label="Phone number"
        />

        <div className="my-10 space-y-2">
          <Checkbox
            id="contactInfoForm_marketingConsent"
            name="marketingConsent"
            label={
              <span>
                {
                  "(Optional) Email me personalized regular news, content and exclusive offers in accordance with the "
                }
                <Link
                  href="/privacy-notice"
                  target="_blank"
                  rel="noreferrer"
                  data-analytics-location={
                    LocationAttributes.PROMOTIONAL_CHECKOUT
                  }
                  data-analytics-action="Lingo Privacy Notice"
                  className="underline hover:no-underline"
                >
                  Lingo privacy notice.
                </Link>
              </span>
            }
          />
          <Checkbox
            id="contactInfoForm_purchaseConsent"
            name="purchaseConsent"
            label={
              <span>
                I acknowledge the{" "}
                <Link
                  href="/privacy-notice"
                  target="_blank"
                  rel="noreferrer"
                  data-analytics-location={
                    LocationAttributes.PROMOTIONAL_CHECKOUT
                  }
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
                  data-analytics-location={
                    LocationAttributes.PROMOTIONAL_CHECKOUT
                  }
                  data-analytics-action="Terms of Sale"
                  className="underline hover:no-underline"
                >
                  Terms of Sale
                </Link>
                .
              </span>
            }
          />
        </div>

        <p className="text-xs text-charcoal/60">
          By clicking &apos;Next&apos; you agree to the creation of your Lingo
          profile and the processing of your health data as described in the{" "}
          <Link
            href="/privacy-notice"
            target="_blank"
            rel="noreferrer"
            data-analytics-action="Additional Information Privacy Notice"
            className="underline hover:no-underline"
          >
            Lingo Privacy Notice
          </Link>
          .
        </p>

        <div className="mb-6 mt-10 h-1 border-b border-charcoal/50" />

        <p className="text-charcoal/70">
          <strong>
            Before you sign up, let’s make sure Lingo is right for you
          </strong>
        </p>

        <div className="mb-6 mt-3 space-y-2">
          <Checkbox
            id="contactInfoForm_ageConsent"
            name="ageConsent"
            label={
              <span>
                I am <strong>18 years or older</strong>.
              </span>
            }
          />

          <Checkbox
            id="contactInfoForm_insulinConsent"
            name="insulinConsent"
            label={
              <span>
                <strong>I do not</strong> use insulin.
              </span>
            }
          />

          <Checkbox
            id="contactInfoForm_diabetesConsent"
            name="diabetesConsent"
            label={
              <span>
                I understand that{" "}
                <strong>
                  Lingo data must not be used for diagnosis of disease including
                  diabetes
                </strong>
                .
              </span>
            }
          />

          <Checkbox
            id="contactInfoForm_medicalActionConsent"
            name="medicalActionConsent"
            label={
              <span>
                I will <strong>not take medical action</strong> based on my data
                without consulting a healthcare professional.*
              </span>
            }
          />
        </div>

        <p className="mt-6 text-xs text-charcoal/70">
          *Medical action is defined as activities undertaken in consultation
          with or under the guidance of a licensed healthcare profession to
          screen, diagnose, treat, cure, mitigate, prevent or monitor a disease
          or other medical condition.
        </p>

        <p className="mt-6 text-xs text-charcoal/70">
          If you are unsure about any of the statements above, please consult a
          healthcare professional.
        </p>

        <div className="flex items-center justify-center">
          <Button
            variant="dark"
            buttonType="submit"
            text="Next"
            className="my-10 w-full lg:w-1/2"
            isDisabled={formMethods.formState.isSubmitting}
            analyticsActionAttribute="Save Contact Info"
            analyticsLocationAttribute={LocationAttributes.PROMOTIONAL_CHECKOUT}
            isLoading={isSubmitting}
          />
        </div>
      </form>
    </FormProvider>
  );
}
