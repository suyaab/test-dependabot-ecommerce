/**
 * Checks if a given key is a valid key of an object.
 *
 * @template T - The type of the object.
 * @param {string | number | symbol} key - The key to check.
 * @param {T} obj - The object to check against.
 * @returns {key is keyof T} - Returns true if the key is a valid key of the object, otherwise false.
 */
export function isKeyOf<T extends object>(
  key: string | number | symbol,
  obj: T,
): key is keyof T {
  return key in obj;
}
