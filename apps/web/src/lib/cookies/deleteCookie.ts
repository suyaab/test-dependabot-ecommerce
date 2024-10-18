/**
 * Deletes a cookie on the Client.
 *
 * @param {string} name - The name of the cookie to delete.
 *
 * @return {void}
 *
 * Usage:
 * ```ts
 * deleteCookie(CookieKey.MyCookie)
 * ```
 */
export default function deleteCookie(name: string): void {
  document.cookie = `${name}=; Max-Age=-99999999;`;
}
