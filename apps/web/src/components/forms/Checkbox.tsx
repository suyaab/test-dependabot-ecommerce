import { KeyboardEvent, ReactElement } from "react";
import {
  PathValue,
  useController,
  useFormContext,
  type Path,
} from "react-hook-form";

import CheckboxInteractive from "~/components/CheckboxInteractive";
import InputError from "~/components/forms/InputError";
import cn from "~/lib/utils";

interface Props<T> {
  label: string | ReactElement;
  id?: string;
  name: Path<T>;
  required?: boolean;
  displayInlineErorrs?: boolean;
}

const Checkbox = <T extends object>({
  label,
  id,
  name,
  required = false,
  displayInlineErorrs = true,
}: Props<T>) => {
  const { register, watch, setValue, control } = useFormContext<T>();
  const isChecked: boolean = watch(name);

  const handleKeyDown = (event: KeyboardEvent<HTMLLabelElement>) => {
    if (event.key === " " || event.key === "Enter") {
      setValue(name, !isChecked as PathValue<T, Path<T>>);
    }
  };

  const {
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  const isInvalid = error?.message != null;

  return (
    <>
      <label
        tabIndex={0}
        className={cn(
          "group relative flex cursor-pointer text-sm",
          isInvalid && "text-red",
        )}
        onKeyDown={handleKeyDown}
      >
        <input
          tabIndex={-1}
          aria-hidden
          type="checkbox"
          className="absolute z-0 ml-2 h-0 w-0 appearance-none border-none bg-transparent focus:ring-transparent"
          id={id}
          {...register(name, {
            required: required && `${name} is required`,
          })}
        />
        <CheckboxInteractive
          containerClassName="z-10 mr-3 shrink-0"
          isChecked={isChecked}
          isInvalid={isInvalid}
        />
        <span className="inline-block">{label}</span>
      </label>
      {displayInlineErorrs && isInvalid && (
        <InputError errorMessage={error?.message} className="mt-2" />
      )}
    </>
  );
};

export default Checkbox;
