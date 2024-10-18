import React, {
  ForwardedRef,
  forwardRef,
  HTMLInputTypeAttribute,
  useEffect,
} from "react";
import { Controller, useController, useFormContext } from "react-hook-form";

import InputError from "~/components/forms/InputError";
import cn, { mergeRefs } from "~/lib/utils";

interface Props {
  id: string;
  label: string;
  name: string;
  type?: HTMLInputTypeAttribute;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: AutoFill;
  disabled?: boolean;
  className?: string;
}

const ControlledTextInput = forwardRef(function ControlledTextInput(
  {
    id,
    name,
    label,
    value,
    onChange,
    autoComplete,
    disabled,
    className,
    type = "text",
  }: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { register, setValue, control } = useFormContext();

  // NOTE: it's possible that usages of this shared component need to reference this
  // input with a ref ... we need to ensure that the ref that React Hook Form uses and the prop.ref
  // are merged and reference the same object.  if we don't do this, one of the refs won't work
  const { ref: formRef } = register(name);
  const mergedRef = mergeRefs(ref, formRef);

  // whenever value is changed outside of this component, ensure the form state is also updated
  // example: google maps API updates other inputs when a Google Place is selected
  useEffect(() => {
    setValue(name, value);
  }, [value, name, setValue]);

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
            ref={mergedRef}
            type={type}
            autoComplete={autoComplete}
            disabled={disabled}
            value={field.value as string}
            onChange={({ target }) => {
              onChange(target.value);
              field.onChange(target.value);
            }}
            className={cn("form-input", showError && "border-red")}
          />
        )}
        control={control}
        name={name}
        defaultValue=""
      />

      {showError && <InputError errorMessage={error.message} />}
    </div>
  );
});

export default ControlledTextInput;
