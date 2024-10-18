"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { LocationAttributes } from "@ecommerce/analytics";
import { Cart, DiscountCodeInfo } from "@ecommerce/commerce";

import Button from "~/components/Button";
import InputError from "~/components/forms/InputError";
import { applyPromoCode } from "~/app/actions/promotional/applyPromoCode";
import { useCreateQueryString } from "~/hooks/useCreateQueryString";

const MAX_INVALID_CODE_ENTRIES = 10;

const discountCodeFormSchema = z.object({
  discountCode: z.string(),
});

type DiscountCode = z.infer<typeof discountCodeFormSchema>;

export default function DiscountCodeForm({
  cart,
  presetDiscountCode,
  moveToNextStep,
}: {
  cart: Cart;
  presetDiscountCode: string | null;
  moveToNextStep: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPromoQueryString = useCreateQueryString(searchParams);

  const formMethods = useForm<DiscountCode>({
    resolver: zodResolver(discountCodeFormSchema),
    defaultValues: {
      discountCode: presetDiscountCode ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = formMethods;

  const [statusMsg, setStatusMsg] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [invalidCount, setInvalidCount] = useState(0);

  const discountCode = watch("discountCode");

  const discountCodeStateMessages = new Map<DiscountCodeInfo["state"], string>([
    ["NotActive", "Promo code is not active."],
    ["NotValid", "Promo code is not valid."],
    [
      "MaxApplicationReached",
      "Promo code has reached its maximum application.",
    ],
    [
      "ApplicationStoppedByPreviousDiscount",
      "Promo code application was stopped by a previous promo code.",
    ],
    ["DoesNotMatchCart", "Promo code does not match the cart."],
    ["MatchesCart", "Promo code applied successfully."],
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
        setStatusMsg("Please enter a promo code.");
        return;
      }

      const state = await applyPromoCode(cart.id, cart.version, discountCode);

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
          "Unable to apply promo code. Please contact customer service.",
      );

      // The code was applied but was not valid is some way and subsequently removed
      if (state !== "MatchesCart") {
        setInvalidCount(invalidCount + 1);
        return;
      }

      setInvalidCount(0);
      setIsApplied(true);
      router.replace(
        `${pathname}?${createPromoQueryString("promo", discountCode)}`,
        { scroll: false },
      );
      moveToNextStep();
    } catch {
      setStatusMsg("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form
        className="mt-14"
        onSubmit={(event) => {
          void void handleSubmit(handleApplyClick)(event);
        }}
      >
        <input
          disabled={invalidCount === MAX_INVALID_CODE_ENTRIES}
          className="form-input mr-4"
          type="text"
          placeholder="Promo code"
          {...register("discountCode")}
        />
        <div className="m-1">
          {!isApplied && statusMsg && (
            <InputError errorMessage={statusMsg} className="mt-2" />
          )}
        </div>
        <Button
          text="Next"
          variant="dark"
          className="my-10 w-full"
          buttonType="submit"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          analyticsActionAttribute="PromoCode Continue"
          analyticsLocationAttribute={LocationAttributes.PROMOTIONAL_CHECKOUT}
        />
      </form>
    </FormProvider>
  );
}
