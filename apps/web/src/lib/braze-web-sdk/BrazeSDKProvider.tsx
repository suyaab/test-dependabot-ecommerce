"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";

import { BrazeSDKServiceConfig } from "./types";

interface BrazeSDKContextProps {
  brazeSDKConfig: BrazeSDKServiceConfig;
}

const BrazeSDKContext = createContext<BrazeSDKContextProps | null>(null);

/**
 * Provides the Braze SDK service to its children components.
 */
export function BrazeSDKProvider({
  children,
  brazeSDKConfig,
}: {
  children: ReactNode;
  brazeSDKConfig: BrazeSDKServiceConfig;
}) {
  useEffect(() => {
    const init = async () => {
      try {
        const { initialize, openSession } = await import("@braze/web-sdk");

        const started = initialize(brazeSDKConfig.BRAZE_WEB_KEY, {
          baseUrl: brazeSDKConfig.BRAZE_SDK_URL,
          enableLogging: brazeSDKConfig.LINGO_ENV !== "prod",
        });

        if (!started) {
          throw new Error("Braze failed to initialize");
        }

        openSession();
      } catch (error: unknown) {
        throw new Error("Braze initialization failed", { cause: error });
      }
    };

    void init();
  }, [brazeSDKConfig]);

  return (
    <BrazeSDKContext.Provider value={{ brazeSDKConfig }}>
      {children}
    </BrazeSDKContext.Provider>
  );
}

// TODO: do we need this?
export const useBrazeSDKContext = (): BrazeSDKContextProps => {
  const context = useContext(BrazeSDKContext);
  if (!context) {
    throw new Error(
      "useBrazeSDKContext must be used within a BrazeSDKProvider",
    );
  }
  return context;
};
