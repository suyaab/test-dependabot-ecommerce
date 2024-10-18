import { isEven } from "./isEven";

describe("isEven", () => {
  const evenCases = [
    { number: 0, expected: true },
    { number: 2, expected: true },
    { number: 4, expected: true },
    { number: 6, expected: true },
    { number: 8, expected: true },
    { number: 10, expected: true },
  ];

  evenCases.forEach(({ number, expected }) => {
    it(`${number} is ${expected}`, () => {
      expect(isEven(number)).toBe(expected);
    });
  });

  const oddCases = [
    { number: 1, expected: false },
    { number: 3, expected: false },
    { number: 5, expected: false },
    { number: 7, expected: false },
    { number: 9, expected: false },
    { number: 11, expected: false },
  ];

  oddCases.forEach(({ number, expected }) => {
    it(`${number} is ${expected}`, () => {
      expect(isEven(number)).toBe(expected);
    });
  });
});
