"use client";

import { useState } from "react";

import { Cart, DiscountCodeInfo } from "@ecommerce/commerce";

import Button from "~/components/Button";
import { applyDiscountCode } from "~/app/actions/account/subscription/applyDiscountCode";
import { removeDiscountCode } from "~/app/actions/account/subscription/removeDiscountCode";
import MinusIcon from "~/icons/MinusIcon";
import PlusIcon from "~/icons/PlusIcon";

const MAX_INVALID_CODE_ENTRIES = 10;

export default function DiscountCodeForm({
  cart,
  productId,
  content,
}: {
  cart: Cart;
  productId: string;
  content: {
    inputPlaceholder: string;
    buttonLabel: { apply: string; remove: string };
    title: string;
  };
}) {
  const [discountCode, setDiscountCode] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [invalidCount, setInvalidCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const { inputPlaceholder, buttonLabel, title } = content;

  const discountCodeStateMessages = new Map<DiscountCodeInfo["state"], string>([
    ["NotActive", "Discount code is not active."],
    ["NotValid", "Discount code is not valid."],
    [
      "MaxApplicationReached",
      "Discount code has reached its maximum application.",
    ],
    [
      "ApplicationStoppedByPreviousDiscount",
      "Discount code application was stopped by a previous discount code.",
    ],
    ["DoesNotMatchCart", "Discount code does not match the cart."],
    ["MatchesCart", "Discount code applied successfully."],
  ]);

  const handleApplyClick = async () => {
    try {
      setStatusMsg("");

      if (invalidCount === MAX_INVALID_CODE_ENTRIES) {
        setStatusMsg(
          "You’ve made too many invalid attempts. Please try again later.",
        );
        return;
      }

      if (!discountCode) {
        setStatusMsg("Please enter a discount code.");
        return;
      }

      const state = await applyDiscountCode(
        cart.id,
        cart.version,
        discountCode,
        productId,
      );
      // The code was not found and not applied to the cart
      if (state == null) {
        setInvalidCount(invalidCount + 1);
        setStatusMsg(
          "This doesn't look right. Please make sure your code is correct.",
        );
        return;
      }

      setStatusMsg(
        discountCodeStateMessages.get(state) ??
          "Unable to apply discount code. Please contact customer service.",
      );

      // The code was applied but was not valid is some way and subsequently removed
      if (state !== "MatchesCart") {
        setInvalidCount(invalidCount + 1);
        return;
      }

      setInvalidCount(0);
      setIsApplied(true);
    } catch {
      // TODO: how should we log client side errors
      setStatusMsg("An unexpected error occurred. Please try again later.");
    }
  };

  const handleRemoveClick = async () => {
    setStatusMsg("");
    try {
      if (cart.discountCodes[0]?.discountCode.id == null) {
        setDiscountCode("");
        setIsApplied(false);
        return;
      }

      await removeDiscountCode(
        cart.id,
        cart.version,
        cart.discountCodes[0].discountCode.id,
        productId,
      );
      setDiscountCode("");
      setIsApplied(false);
    } catch {
      // TODO: how should we log client side errors
      setStatusMsg("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="border-1 mt-14 flex-col rounded-xl bg-white px-3 py-4 md:mt-16 md:w-1/2 md:flex-row md:px-6">
      <div className="flex justify-between">
        <h6 className="font-medium">{title}</h6>
        {isExpanded ? (
          <div onClick={() => setIsExpanded(false)}>
            <MinusIcon className="size-4" />
          </div>
        ) : (
          <div onClick={() => setIsExpanded(true)}>
            <PlusIcon className="size-4" />
          </div>
        )}
      </div>
      {isExpanded && (
        <>
          <div className="mt-7 flex items-center justify-center md:mt-6">
            <input
              disabled={invalidCount === MAX_INVALID_CODE_ENTRIES}
              className="form-input mr-4 rounded-md placeholder:text-sm md:placeholder:text-base"
              type="text"
              name="discountCode"
              placeholder={inputPlaceholder}
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.trim())}
            />

            <Button
              text={isApplied ? buttonLabel.remove : buttonLabel.apply}
              variant="dark"
              className="px-1 text-sm md:px-1 md:text-base"
              onClick={() => {
                if (isApplied) {
                  void handleRemoveClick();
                } else {
                  void handleApplyClick();
                }
              }}
            />
          </div>

          <div className="m-1">
            <span className={isApplied ? undefined : "text-red"}>
              {statusMsg}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
