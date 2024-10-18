function formatUKPostCode(postcode: string): string {
  const trimmedPostCode = postcode.trim();
  if (!trimmedPostCode.includes(" ")) {
    return `${trimmedPostCode.slice(0, -3)} ${trimmedPostCode.slice(-3)}`;
  }
  return trimmedPostCode;
}

export default function formatPostcode(
  countryCode: string,
  postCode: string,
): string {
  switch (countryCode) {
    case "GB":
    case "IX":
      return formatUKPostCode(postCode);

    default:
      return postCode;
  }
}
