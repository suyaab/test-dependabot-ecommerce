/**
 * Represents a generic function zodEnum.
 *
 * This function takes an array of type T and returns a tuple with the first element of type T, and the rest of the elements in the array.
 *
 * @param {T[]} arr - The array of type T.
 * @return {[T, ...T[]]} - A tuple with the first element of type T, and the rest of the elements in the array.
 * @template T - The generic type.
 *
 * @example
 * ```ts
 * const fruits = ['apple', 'banana', 'orange'];
 * zodEnum(fruits) === ['apple', 'banana', 'orange'] as const
 * ```
 */
const zodEnum = <T>(arr: T[]): [T, ...T[]] => arr as [T, ...T[]];

export default zodEnum;
