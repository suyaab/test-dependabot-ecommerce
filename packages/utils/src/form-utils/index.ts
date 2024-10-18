// TODO: make it scalable for other countries
export const US_INPUT_LIMITS = {
  email: 70,
  emailMin: 6,
  name: 17,
  discountCode: 35,
  phone: 12,
  address: 30,
  addressDetails: 30,
  city: 35,
  zipCode: 10,
  state: 2,
  country: 30,
  default: 30,
} as const;

// Step helpers for SteppedAccordion

// Utility type to get the value of a step from the steps object
export type StepType<T extends readonly string[]> = T[number];

/**
 * Utility function to create a steps object for SteppedAccordion as an alternative to using native enums.
 *
 * @example
 * const steps = ["ONE", "TWO", "THREE"] as const;
 * createSteps(steps);
 * returns: { ONE: 0, TWO: 1, THREE: 2 }
 *
 * @param stepsList - An array of step names.
 * @returns An object where the keys are the step names and the values are their respective indices.
 */
export function createSteps<T extends readonly string[]>(
  stepsList: T,
): Record<StepType<T>, number> {
  return stepsList.reduce<Record<StepType<T>, number>>(
    (acc, step, index) => {
      acc[step as StepType<T>] = index;
      return acc;
    },
    {} as Record<StepType<T>, number>,
  );
}
