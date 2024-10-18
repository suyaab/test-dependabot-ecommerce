"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { AddressFormData } from "@ecommerce/utils";

import ChevronDown from "~/icons/ChevronDown";
import cn from "~/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./Command";
import { DrawerContent, DrawerNested, DrawerTrigger } from "./Drawer";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

interface Option {
  value: string;
  displayName: string;
}

const triggerClassName =
  "inline-flex h-12 w-full items-center justify-between rounded-[0.25rem] border border-charcoal/30 px-3 transition-colors focus:border-charcoal focus:ring-charcoal disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none hover:bg-charcoal/5 hover:text-charcoal font-normal";

/**
 * A component that renders a combobox with options.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Option[]} props.options - The list of options to display in the combobox.
 * @param {string} props.formFieldName - The name of the form field associated with the combobox.
 * @param {Dispatch<SetStateAction<AddressFormData>>} props.setSelectedOption - The function to set the selected option.
 * @param {string} props.currentOption - The currently selected option.
 * @returns {JSX.Element} The rendered combobox component.
 */
const Combobox = ({
  options,
  formFieldName,
  setSelectedOption,
  currentOption,
}: {
  options: Option[];
  formFieldName: string;
  setSelectedOption: Dispatch<SetStateAction<AddressFormData>>;
  currentOption: string;
}): JSX.Element => {
  const [openPopOver, setOpenPopOver] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      <div className="hidden lg:block">
        <Popover open={openPopOver} onOpenChange={setOpenPopOver}>
          <PopoverTrigger
            className={cn(
              triggerClassName,
              !currentOption && "text-charcoal/60",
            )}
          >
            <span>{currentOption || `Select ${formFieldName}`}</span>
            <ChevronDown className="text-charcoal/60" />
          </PopoverTrigger>
          <PopoverContent className="w-[300px] bg-white p-0" align="start">
            <DropdownList
              setOpen={setOpenPopOver}
              options={options}
              setSelectedOption={setSelectedOption}
              formFieldName={formFieldName}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="max-lg:block lg:hidden">
        <DrawerNested open={openDrawer} onOpenChange={setOpenDrawer}>
          <DrawerTrigger
            className={cn(
              triggerClassName,
              !currentOption && "text-charcoal/60",
            )}
          >
            <span>{currentOption || `Select ${formFieldName}`}</span>
            <ChevronDown className="text-charcoal/60" />
          </DrawerTrigger>
          <DrawerContent className="bg-white">
            <div className="mt-4 border-t">
              <DropdownList
                setOpen={setOpenDrawer}
                options={options}
                setSelectedOption={setSelectedOption}
                formFieldName={formFieldName}
              />
            </div>
          </DrawerContent>
        </DrawerNested>
      </div>
    </>
  );
};

/**
 * Renders a dropdown list component.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setOpen - A function to control the open state of the dropdown list.
 * @param {Option[]} props.options - An array of options to be displayed in the dropdown list.
 * @param {Function} props.setSelectedOption - A function to set the selected option.
 * @param {string} props.formFieldName - The name of the form field associated with the dropdown list.
 * @returns {JSX.Element} The rendered dropdown list component.
 */
function DropdownList({
  setOpen,
  options,
  setSelectedOption,
  formFieldName,
}: {
  setOpen: (open: boolean) => void;
  options: Option[];
  setSelectedOption: Dispatch<SetStateAction<AddressFormData>>;
  formFieldName: string;
}) {
  return (
    <Command>
      <CommandInput placeholder="Search ..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              className="hover:bg-gray-100 focus:bg-gray-100"
              key={option.value}
              value={option.value}
              onSelect={(value) => {
                setSelectedOption((prevState) => ({
                  ...prevState,
                  [formFieldName]: value,
                }));
                setOpen(false);
              }}
            >
              {option.displayName}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export default Combobox;
