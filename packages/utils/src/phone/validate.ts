import parsePhoneNumberFromString from "libphonenumber-js";

export function validatePhone(phone: string): boolean {
  const phoneNumber = parsePhoneNumberFromString(phone, "US");

  if (phoneNumber == null) {
    return false;
  }

  return phoneNumber.isValid();
}
