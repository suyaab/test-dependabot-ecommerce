import {
  AddressCountryCode,
  getAddressCountryCode,
  getAddressCountryName,
} from "./address";
import { CountryName } from "./country";

describe("Address", () => {
  describe("getAddressCountryCode", () => {
    const cases: [CountryName, AddressCountryCode][] = [
      ["United States", "US"],
      ["United Kingdom", "GB"],
    ];

    test.each(cases)("converts %s to %s", (countryName, countryCode) => {
      expect(getAddressCountryCode(countryName)).toBe(countryCode);
    });

    it("throws error for invalid address country code", () => {
      expect(() => {
        getAddressCountryName("" as unknown as AddressCountryCode);
      }).toThrow(Error);
    });
  });

  describe("getAddressCountryName", () => {
    const cases: [AddressCountryCode, CountryName][] = [
      ["US", "United States"],
      ["GB", "United Kingdom"],
      ["XI", "United Kingdom"],
    ];

    test.each(cases)("converts %s to %s", (countryCode, countryName) => {
      expect(getAddressCountryName(countryCode)).toBe(countryName);
    });

    it("throws error for invalid address country code", () => {
      expect(() => {
        getAddressCountryName("" as unknown as AddressCountryCode);
      }).toThrow(Error);
    });
  });
});
