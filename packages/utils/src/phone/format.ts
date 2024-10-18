import { AsYouType, parsePhoneNumber } from "libphonenumber-js";

/**
 * Formats a phone number into international format.
 *
 * @param {string} phone - The phone number to format.
 * @returns {string} formatted phone number in standardized international format: `+44 20 7123 4567` or `+1 612 618 2121`.
 *
 *
 * Usage:
 * ```ts
 * formatPhone("(612) 612-2121") === '+1 612 618 2121'
 * ```
 *
 * ```ts
 * formatPhone("+447415103842") === '+44 7415 103842'
 * ```
 */
export function formatPhone(phone: string): string {
  const phoneNumber = parsePhoneNumber(phone, { defaultCountry: "US" });
  return phoneNumber.formatInternational();
}

/**
 * Formats a phone number as you type.
 *
 * @param {string} phoneInput - The phone number to be formatted.
 * @return {string} - The formatted phone number.
 */
export function formatPhoneAsYouType(phoneInput: string): string {
  // this checks if only the area code is remaining and removes wrapping parentheses to avoid having to adjust keyboard location
  // https://github.com/catamphetamine/libphonenumber-js/issues/225#issuecomment-632329907
  if (phoneInput.includes("(") && !phoneInput.includes(")")) {
    return phoneInput.replace("(", "");
  }

  return new AsYouType("US").input(phoneInput);
}
