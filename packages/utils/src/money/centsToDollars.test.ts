import { centsToDollars } from "./centsToDollars";

describe("CentsToDollars", () => {
  it("behaves as expected with two decimal places", () => {
    // default two decimal places
    expect(centsToDollars(3000)).toBe(30.0);
    expect(centsToDollars(123456)).toBe(1234.56);

    expect(centsToDollars(3000, 2)).toBe(30.0);
    expect(centsToDollars(123456, 2)).toBe(1234.56);
  });

  it("behaves as expected with one decimal place", () => {
    expect(centsToDollars(3000, 1)).toBe(300.0);
    expect(centsToDollars(123456, 1)).toBe(12345.6);
  });

  it("behaves as expected with zero decimal places", () => {
    expect(centsToDollars(3000, 0)).toBe(3000.0);
    expect(centsToDollars(123456, 0)).toBe(123456.0);
  });

  it("does not produce errors in zero case", () => {
    expect(centsToDollars(0, 2)).toBe(0.0);
    expect(centsToDollars(0, 0)).toBe(0);
  });
});
