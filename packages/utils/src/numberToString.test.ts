import { numberToString } from "./numberToString";

describe("numberToString", () => {
  const testCases = [
    { input: 0, expected: "Zero" },
    { input: 1, expected: "One" },
    { input: 2, expected: "Two" },
    { input: 3, expected: "Three" },
    { input: 4, expected: "Four" },
    { input: 5, expected: "Five" },
    { input: 6, expected: "Six" },
    { input: 7, expected: "Seven" },
    { input: 8, expected: "Eight" },
    { input: 9, expected: "Nine" },
    { input: 10, expected: "10" },
    { input: 123, expected: "123" },
  ];

  testCases.forEach(({ input, expected }) => {
    it(`should convert ${input} to ${expected}`, () => {
      expect(numberToString(input)).toBe(expected);
    });
  });
});
