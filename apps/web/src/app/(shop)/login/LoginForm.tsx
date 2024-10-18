"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { LocationAttributes } from "@ecommerce/analytics";
import { US_INPUT_LIMITS } from "@ecommerce/utils";

import Button from "~/components/Button";
import TextInput from "~/components/forms/TextInput";
import { emailSchema } from "~/app/(checkout)/checkout/form/contact/schema";

const LoginForm = () => {
  const formMethods = useForm({
    resolver: zodResolver(emailSchema, { async: true }),
    defaultValues: { email: "" },
  });

  const { isSubmitting } = formMethods.formState;

  return (
    <FormProvider {...formMethods}>
      {/* {errorMsg && <ErrorAlert message={errorMsg} />} */}
      <form>
        <TextInput
          id="email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          maxLength={US_INPUT_LIMITS.email}
          className="text-charcoal/60"
        />

        <div className="border-t-black/18 -bottom-32 left-0 right-0 border-t max-lg:absolute max-lg:px-[var(--sideGap)]">
          <Button
            variant="dark"
            buttonType="submit"
            text="Continue"
            className="my-4 w-full lg:mt-7 lg:w-1/2"
            analyticsActionAttribute="User Authentication"
            analyticsLocationAttribute={LocationAttributes.LOGIN}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
