import { useCallback } from "react";
import { ReadonlyURLSearchParams } from "next/navigation";

/**
 * Custom hook to create a query string by adding or updating a parameter in the existing search parameters.
 * @param {ReadonlyURLSearchParams} searchParams - The existing search parameters.
 * @returns {Function} A function that takes a parameter name and value, and returns the updated query string.
 */
export const useCreateQueryString = (searchParams: ReadonlyURLSearchParams) => {
  return useCallback(
    (name: string, value: string | null | undefined) => {
      if (value == null) {
        return "";
      }
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );
};
