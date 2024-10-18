"use client";

import {
  useFeatureFlags as useAllHarnessFeatureFlags,
  useFeatureFlag as useHarnessFeatureFlag,
} from "@harnessio/ff-react-client-sdk";

import { FeatureFlag, FLAG_DEFAULT_VALUES } from "~/lib/feature-flags/flags";

export function useFeatureFlag(flag: FeatureFlag): boolean {
  try {
    return useHarnessFeatureFlag(flag) as boolean;
  } catch {
    // if we encounter any issues with harness, return default value
    return FLAG_DEFAULT_VALUES[flag];
  }
}

export function useAllFeatureFlags(): Record<FeatureFlag, boolean> {
  try {
    return useAllHarnessFeatureFlags();
  } catch {
    // if we encounter any issues with harness, return default value
    return FLAG_DEFAULT_VALUES;
  }
}
