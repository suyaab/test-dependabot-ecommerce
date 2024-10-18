/**
 * Retrieves the specified cookie on the Client.
 *
 * @param {string} name - The name of the cookie to retrieve.
 *
 * @return {string | undefined} - The value of the specified cookie, or undefined if the cookie does not exist.
 *
 * Usage:
 * ```ts
 * getCookie(CookieKey.MyCookie)
 * ```
 */
export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const nameEquals = name + "=";
  const cookiesArray = document.cookie.split(";");

  for (const cookie of cookiesArray) {
    const trimmedCookie = cookie.trim();

    if (trimmedCookie.startsWith(nameEquals)) {
      return trimmedCookie.substring(nameEquals.length, trimmedCookie.length);
    }
  }

  return undefined;
}
