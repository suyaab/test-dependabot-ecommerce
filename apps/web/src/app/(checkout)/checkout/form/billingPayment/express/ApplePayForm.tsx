"use client";

import { Cart } from "@ecommerce/commerce";

import { ButtonBlock } from "~/components/ButtonBlock";
import ApplePayIcon from "~/icons/ApplePayIcon";

export default function ApplePayForm({ cart }: { cart: Cart }) {
  const executeApplePay = () => {
    window?.wpwl?.executePayment("wpwl-container-virtualAccount-APPLEPAY");
  };

  return (
    <>
      <ButtonBlock onClick={() => executeApplePay()} aria-label="Apple Pay">
        <ApplePayIcon />
      </ButtonBlock>

      <form
        action={`/checkout/processing/${cart.id}`}
        className="paymentWidgets"
        data-brands="APPLEPAY"
      ></form>
    </>
  );
}
