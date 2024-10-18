import React, { HTMLInputTypeAttribute, ReactElement } from "react";
import { useController, useFormContext } from "react-hook-form";

import InputError from "~/components/forms/InputError";
import cn from "~/lib/utils";

interface TextInputProps {
  id?: string;
  label: string | ReactElement;
  name: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
}

export default function TextInput({
  id,
  label,
  name,
  type = "text",
  disabled = false,
  autoComplete = "off",
  className,
  maxLength,
}: TextInputProps) {
  const { register, control } = useFormContext();

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

      <input
        {...register(name)}
        id={id}
        type={type}
        autoComplete={autoComplete}
        disabled={disabled}
        className={cn("form-input", showError && "border-red")}
        maxLength={maxLength}
      />

      {showError && <InputError errorMessage={error.message} />}
    </div>
  );
}
