"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { LocationAttributes } from "@ecommerce/analytics";
import { Cart, DiscountCodeInfo } from "@ecommerce/commerce";

import Button from "~/components/Button";
import { applyDiscountCode } from "~/app/actions/checkout/discountCode/applyDiscountCode";
import { removeDiscountCode } from "~/app/actions/checkout/discountCode/removeDiscountCode";

const MAX_INVALID_CODE_ENTRIES = 10;

export const discountCodeFormSchema = z.object({
  discountCode: z.string().trim(),
});

export type DiscountCode = z.infer<typeof discountCodeFormSchema>;

export default function DiscountCodeForm({
  formContent,
  cart,
  checkoutSessionId,
}: {
  formContent: {
    inputPlaceholder: string;
    buttonLabel: string;
  };
  cart: Cart;
  checkoutSessionId: string;
}) {
  const formMethods = useForm<DiscountCode>({
    resolver: zodResolver(discountCodeFormSchema),
    defaultValues: {
      discountCode: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = formMethods;

  const [statusMsg, setStatusMsg] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [invalidCount, setInvalidCount] = useState(0);

  const discountCode = watch("discountCode");

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
        checkoutSessionId,
        discountCode,
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
        setValue("discountCode", "");
        setIsApplied(false);
        return;
      }

      await removeDiscountCode(
        cart.id,
        cart.version,
        checkoutSessionId,
        cart.discountCodes[0].discountCode.id,
      );
      setValue("discountCode", "");
      setIsApplied(false);
    } catch {
      // TODO: how should we log client side errors
      setStatusMsg("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form
        className="mt-14 flex"
        onSubmit={(event) => {
          if (isApplied) {
            void handleSubmit(handleRemoveClick)(event);
          } else {
            void handleSubmit(handleApplyClick)(event);
          }
        }}
      >
        <input
          disabled={invalidCount === MAX_INVALID_CODE_ENTRIES}
          className="form-input mr-4"
          type="text"
          placeholder={formContent.inputPlaceholder}
          {...register("discountCode")}
        />
        <Button
          text={isApplied ? "Remove" : "Apply"}
          variant="dark"
          buttonType="submit"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          analyticsActionAttribute={`PromoCode ${
            isApplied ? "Remove" : "Apply"
          }`}
          analyticsLocationAttribute={LocationAttributes.CHECKOUT}
        />
      </form>

      <div className="m-1">
        <span className={isApplied ? undefined : "text-red"}>{statusMsg}</span>
      </div>
    </FormProvider>
  );
}
