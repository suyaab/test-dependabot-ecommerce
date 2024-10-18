import "@types/newrelic";

interface Collector {
  isConnected: () => boolean;
}

interface Agent {
  on: (event: string, callback: (arg: unknown) => void) => void;
  collector: Collector;
}

declare module "newrelic" {
  export const agent: Agent;

  export function noticeError(
    error: (Error & { statusCode?: number | undefined }) | null | undefined,
  ): void;

  export function getBrowserTimingHeader(options?: {
    nonce?: string;
    hasToRemoveScriptWrapper?: boolean;
    allowTransactionlessInjection?: boolean;
  }): string;
}
