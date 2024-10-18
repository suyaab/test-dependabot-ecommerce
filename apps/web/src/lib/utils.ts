import { MutableRefObject, Ref, RefCallback } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function that helps conditionally combine classnames when also
 * using tailwind.  This function utilizes `twMerge` from `tailwind-merge`
 * and `clsx`.
 *
 * Usage:
 * ```tsx
 * <div className={cn("m-6 pt-0", className)}>{children}</div>
 * ```
 *
 * ```tsx
 * <div className={cn(
 *    "m-6",
 *    "not-an-error" === "error"
 *      ? "text-red"
 *      : "text-black",
 *    className)}>
 *    {children}
 * </div>
 * ```
 *
 * @param {ClassValue[]} inputs array of class values to apply `clsx` to
 * @returns {string} a single, merged class name
 */
export default function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * A function that merges React refs into one.
 * Supports both functions and ref objects created using createRef() and useRef().
 *
 * Usage:
 * ```tsx
 * <div ref={mergeRefs(ref1, ref2, ref3)} />
 * ```
 *
 * Reference: https://github.com/wojtekmaj/merge-refs/blob/main/src/index.ts
 *
 * @param {(React.Ref<T> | undefined)[]} inputRefs Array of refs
 * @returns {React.Ref<T> | React.RefCallback<T>} Merged refs
 */
export function mergeRefs<T>(
  ...inputRefs: (Ref<T> | undefined)[]
): Ref<T> | RefCallback<T> {
  const filteredInputRefs = inputRefs.filter(Boolean);

  if (filteredInputRefs.length <= 1) {
    const firstRef = filteredInputRefs[0];

    return firstRef ?? null;
  }

  return function mergedRefs(ref) {
    for (const inputRef of filteredInputRefs) {
      if (typeof inputRef === "function") {
        inputRef(ref);
      } else if (inputRef) {
        (inputRef as MutableRefObject<T | null>).current = ref;
      }
    }
  };
}
