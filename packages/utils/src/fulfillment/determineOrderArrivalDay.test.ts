import { getArrivalDate } from "./determineOrderArrivalDay";

describe("determineOrderArrivalDay", () => {
  it("should return the estimated arrival date", () => {
    const orderDate = "2022-01-01T00:00:00Z";
    const countryCode = "US";
    const carrier = "UPS";
    const result = getArrivalDate(orderDate, countryCode, carrier);
    expect(result).toEqual("January 5, 2022");
  });
  it("should throw an error if the carrier does not deliver in the selected country", () => {
    const orderDate = "2022-01-01T00:00:00Z";
    const countryCode = "GB";
    const carrier = "USPS";
    expect(() => getArrivalDate(orderDate, countryCode, carrier)).toThrow(
      "Carrier does not deliver in selected country",
    );
  });
});

describe("getArrivalDate", () => {
  it("should return the estimated arrival date", () => {
    const orderDate = "2022-01-01T00:00:00Z";
    const countryCode = "US";
    const carrier = "UPS";
    const result = getArrivalDate(orderDate, countryCode, carrier);
    expect(result).toEqual("January 5, 2022");
  });
});
