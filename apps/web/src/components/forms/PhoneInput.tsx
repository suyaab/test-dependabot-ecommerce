import React from "react";
import { Controller, useController, useFormContext } from "react-hook-form";

import { formatPhoneAsYouType } from "@ecommerce/utils";

import InputError from "~/components/forms/InputError";
import cn from "~/lib/utils";

interface Props {
  id: string;
  name: string;
  label: string;
  className?: string;
}

export default function PhoneInput({ id, name, label, className }: Props) {
  // const getCountryCodeLeadingIcon = (phoneCountryCode?: string) => {
  //   switch (phoneCountryCode) {
  //     case "US":
  //       return <span>{"🇺🇸"}</span>;
  //
  //     case "GB":
  //       return <span>{"🇬🇧"}</span>;
  //
  //     default:
  //       return undefined;
  //   }
  // };

  const { control } = useFormContext();

  const {
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const showError = error?.message != null;

  return (
    <div className={cn("mt-8 space-y-2", className)}>
      <label htmlFor={id}>{label}</label>
      <Controller
        render={({ field }) => (
          <input
            {...field}
            id={id}
            type="tel"
            autoComplete="phone"
            onChange={({ target }) => {
              field.onChange(formatPhoneAsYouType(target.value));
            }}
            className={cn("form-input", showError && "border-red")}
            maxLength={22}
          />
        )}
        control={control}
        name={name}
        defaultValue=""
      />

      {showError && <InputError errorMessage={error.message} />}
    </div>
  );
}
