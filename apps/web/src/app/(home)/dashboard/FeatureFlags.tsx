"use client";

import { useAllFeatureFlags } from "~/lib/feature-flags/client";

export default function FeatureFlags() {
  const allFlags = useAllFeatureFlags();

  return (
    <div className="grid grid-cols-4 gap-4">
      {Object.entries(allFlags)
        .filter(([flagName]) => flagName.includes("DTC_"))
        .map(([flagName, value]) => {
          return (
            <div key={flagName} className="flex items-center">
              {value && (
                <span className="me-3 flex h-3 w-3 rounded-full bg-green-500"></span>
              )}

              {!value && (
                <span className="me-3 flex h-3 w-3 rounded-full bg-red-500"></span>
              )}

              <h5 className="text-lg">{flagName.replace("DTC_", "")}</h5>
            </div>
          );
        })}
    </div>
  );
}
