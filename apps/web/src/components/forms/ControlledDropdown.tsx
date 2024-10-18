import React, { useEffect } from "react";
import { Controller, useController, useFormContext } from "react-hook-form";

import InputError from "~/components/forms/InputError";
import cn from "~/lib/utils";
import Dropdown from "../Dropdown";

interface Props {
  name: string;
  label: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}

export default function ControlledDropdown({
  name,
  label,
  value,
  placeholder,
  options,
  onChange,
  className,
}: Props) {
  const { control, setValue } = useFormContext();

  const {
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const showError = error?.message != null;

  // whenever value is changed outside of this component, ensure the form state is also updated
  // example: google maps API updates other inputs when a Google Place is selected
  useEffect(() => {
    setValue(name, value);
  }, [value, name, setValue]);

  return (
    <div className={cn("mt-8 space-y-2", className)}>
      <label>{label}</label>

      <Controller
        name="state"
        control={control}
        render={({ field }) => (
          <Dropdown
            {...field}
            options={options}
            value={value}
            setValue={(value) => {
              onChange(value);
              field.onChange(value);
            }}
            placeholder={placeholder}
            className={cn(showError && "border-red")}
          />
        )}
      />

      {showError && <InputError errorMessage={error.message} />}
    </div>
  );
}
