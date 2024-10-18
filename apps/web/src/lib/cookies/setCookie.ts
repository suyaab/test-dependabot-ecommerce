interface CookieOptions {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

/**
 * Sets a cookie on the Client with the given name, value, and options.
 *
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value to be stored in the cookie.
 * @param {CookieOptions} [options={}] - Additional options for the cookie.
 *
 * @return {void}
 *
 * Usage:
 * ```ts
 * setCookie(CookieKey.MyCookie, "true", { path: "/" })
 * ```
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): void {
  let cookieString = `${name}=${value}`;

  if (options.maxAge != null) {
    cookieString += `; "Max-Age"=${options.maxAge}`;
  }

  if (options.path != null) {
    cookieString += `; path=${options.path}`;
  }

  if (options.domain != null) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options?.secure === true) {
    cookieString += "; secure";
  }

  if (options?.sameSite != null) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
}
