import { ForwardedRef, forwardRef } from "react";
import * as Select from "@radix-ui/react-select";

import ChevronDown from "~/icons/ChevronDown";
import cn from "~/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  setValue: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

const Dropdown = forwardRef(function BaseDropdown(
  { options, value, setValue, placeholder, className }: DropdownProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger
        className={cn(
          "form-input inline-flex w-full items-center justify-between hover:bg-charcoal/5",
          className,
        )}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="ml-2">
          <ChevronDown color="gray" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Content
        className="z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg"
        position="popper"
      >
        <Select.Viewport className="py-1">
          {options.map((option) => (
            <Select.Item
              ref={ref}
              key={option.value}
              value={option.value}
              className="relative cursor-pointer select-none px-4 py-2 text-base hover:bg-charcoal/5"
            >
              <Select.ItemText>{option.label}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  );
});

export default Dropdown;
