import type newrelic from "newrelic";

export {};

interface Newrelic extends newrelic {
  noticeError: (
    error: (Error & { statusCode?: number | undefined }) | null | undefined,
  ) => void;
  addPageAction: (actionName: string, customAttributes?: object) => void;
  setCustomAttribute: (key: string, value: string | number) => void;
  // add more methods here if you need them
  // https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/using-browser-apis/
}

type ExpressPayBrand = "APPLEPAY" | "GOOGLEPAY" | "PAYPAL_CONTINUE";

type PayOnContainer =
  | "wpwl-container-card"
  | `wpwl-container-card-${number}`
  | `wpwl-container-virtualAccount-${ExpressPayBrand}`;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "arvato-returns-widget": {
        key: string;
        id: string;
        "data-testid": string;
        lang: string;
        country: string;
        zipcode: string;
        orderid: string;
        email: string | undefined;
      };

      "arvato-track-and-trace-widget": {
        id: string;
        "data-testid": string;
        lang: string;
        country: string;
        zipcode: string;
        orderid: string;
      };
    }
  }

  interface Window {
    // NEW RELIC
    newrelic?: Newrelic;

    // APPLE PAY
    ApplePaySession?: {
      canMakePayments: () => boolean;
    };

    // TRUST ARC CONSENT
    truste?: {
      eu: {
        init(): void;
      };
    };

    // DECIBEL
    d: {
      da: {
        oldErr: OnErrorEventHandler;
        err;
      };
      DecibelInsight;
      [key: string];
    };

    // PAYON PAYMENT GATEWAY
    wpwl?: {
      apiVersion: string;
      cacheVersion: string;
      checkout: {
        amount: string;
        currency: string;
        id: string;
        resourcePath: string;
        endpoint: string;
        config: {
          aciInstantPayCountry: string;
          standaloneThreeDSecure: boolean;
          detectIp: boolean;
          paypalRestConfig: {
            clientId: string;
            merchantId: string;
          };
        };
      };
      endpoint: string;
      executePayment(payonContainer: PayOnContainer): void;
      isTestSystem: boolean;
      minified: boolean;
      ndc: string;
      timestamp: string;
      unload(): void;
      url: string;
    };
  }
}
