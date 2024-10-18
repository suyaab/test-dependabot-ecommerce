"use client";

import { ReactNode } from "react";
import { FFContextProvider } from "@harnessio/ff-react-client-sdk";

import { env } from "~/env";

interface FeatureFlagProviderProps {
  children: ReactNode;
}

/**
 * Provides feature flag functionality to the application.
 *
 * @param children - The child components to render within the feature flag provider. (ReactNode)
 * @returns The feature flag provider component. (JSX.Element)
 */
export function FeatureFlagProvider({ children }: FeatureFlagProviderProps) {
  return (
    <FFContextProvider
      apiKey={env.NEXT_PUBLIC_HARNESS_CLIENT_API_KEY}
      target={{ identifier: "DTC-WebUser", name: "DTC-WebUser" }}
      async
    >
      {children}
    </FFContextProvider>
  );
}
