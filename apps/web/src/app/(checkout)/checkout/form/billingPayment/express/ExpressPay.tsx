"use client";

import { useEffect, useState } from "react";

import { Cart } from "@ecommerce/commerce";

import { useFeatureFlag } from "~/lib/feature-flags/client";
import ApplePayForm from "./ApplePayForm";

export default function ExpressPay({ cart }: { cart: Cart }) {
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const isApplePayEnabled = useFeatureFlag("DTC_US_ApplePay");
  const showApplePay = isApplePayAvailable && isApplePayEnabled;

  // APPLE PAY
  useEffect(() => {
    setIsApplePayAvailable(window?.ApplePaySession?.canMakePayments() ?? false);
  }, []);

  if (!showApplePay) {
    return null;
  }

  return (
    <div>
      <div className="my-4 flex flex-wrap justify-center gap-3 lg:flex-nowrap">
        <div className="flex-grow basis-full lg:flex-grow-0 lg:basis-auto">
          {showApplePay && <ApplePayForm cart={cart} />}
        </div>
      </div>

      <div className="flex items-center gap-5">
        <hr className="flex-grow bg-linen" />
        <span className="whitespace-nowrap text-xs">Or continue below</span>
        <hr className="flex-grow bg-linen" />
      </div>
    </div>
  );
}
