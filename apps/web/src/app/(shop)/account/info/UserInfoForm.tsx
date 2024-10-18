"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { LocationAttributes } from "@ecommerce/analytics";
import { Customer } from "@ecommerce/commerce";
import { formatPhone, US_INPUT_LIMITS } from "@ecommerce/utils";

import PhoneInput from "~/components/forms/PhoneInput";
import TextInput from "~/components/forms/TextInput";
import { useToast } from "~/components/Toast";
import TooltipIcon from "~/components/TooltipIcon";
import { updateUserInfo } from "~/app/actions/account/updateUserInfo";
import Spinner from "~/icons/Spinner";

const accountInfoFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Invalid first name")
    .max(US_INPUT_LIMITS.name, "Invalid first name"),
  lastName: z
    .string()
    .trim()
    .min(1, "Invalid last name")
    .max(US_INPUT_LIMITS.name, "Invalid last name"),
  email: z.string().email(),
  phone: z.string().optional(),
});

type AccountInfoForm = z.infer<typeof accountInfoFormSchema>;

export default function UserInfoForm({ customer }: { customer: Customer }) {
  const { toast } = useToast();

  const formMethods = useForm<AccountInfoForm>({
    resolver: zodResolver(accountInfoFormSchema),
    defaultValues: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
    },
  });

  const { isSubmitting } = formMethods.formState;

  const onSaveClicked: SubmitHandler<AccountInfoForm> = async (data, event) => {
    event?.preventDefault();

    const response = await updateUserInfo(
      data.firstName,
      data.lastName,
      data?.phone != null ? formatPhone(data.phone) : "",
    );

    if (!response.ok) {
      toast({
        title: "Unable to update account information",
        description: "Please try again later",
        status: "failure",
      });
      return;
    }

    toast({
      title: "Successfully updated account information",
      status: "success",
    });
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={(event) =>
          void formMethods.handleSubmit(onSaveClicked)(event)
        }
      >
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

        <TextInput
          name="email"
          label={
            <div className="flex items-center">
              <span className="mr-4">Email</span>

              <div className="flex items-center justify-center">
                <TooltipIcon tooltipContent="Your privacy is important to us. Please call Customer Service if you'd like to update your email." />
                <p className="ml-1 text-sm">
                  {"Why can't I edit my email address?"}
                </p>
              </div>
            </div>
          }
          type="email"
          autoComplete="email"
          disabled
        />

        <PhoneInput id="phone" name="phone" label="Phone number" />

        <div className="my-6">
          <button
            type="submit"
            className="button-dark"
            data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
            data-analytics-action="Save Account Info"
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
      </form>
    </FormProvider>
  );
}
