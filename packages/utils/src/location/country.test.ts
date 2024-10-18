import { CountryCode, CountryName, getCountryName } from "./country";

describe("Country", () => {
  const cases: [CountryCode, CountryName][] = [
    ["US", "United States"],
    ["GB", "United Kingdom"],
    ["" as unknown as CountryCode, undefined as unknown as string],
  ];

  test.each(cases)("converts %s to %s", (countryCode, countryName) => {
    expect(getCountryName(countryCode)).toBe(countryName);
  });
});
