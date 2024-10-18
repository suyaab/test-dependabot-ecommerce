export function centsToDollars(centAmount: number, decimalPlaces = 2) {
  const denominator = 10 ** decimalPlaces;
  return centAmount / denominator;
}
