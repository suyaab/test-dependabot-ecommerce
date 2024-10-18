"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { PromotionalCheckoutSectionContent } from "@ecommerce/cms";
import { Cart } from "@ecommerce/commerce";
import { createSteps } from "@ecommerce/utils";

import SteppedAccordion from "~/components/SteppedAccordion";
import { setSampleCartCookie } from "~/app/actions/promotional/getPromoCart";
import ContactInfoForm from "./contact/ContactInfoForm";
import DiscountCodeForm from "./discountCode/DiscountCodeForm";
import ShippingAddressForm from "./shipping/ShippingAddressForm";

const promotionalStepsList = ["DISCOUNT_CODE", "CONTACT", "SHIPPING"] as const;
const promotionalSteps = createSteps(promotionalStepsList);

export default function PromotionalAccordion({
  cart,
  content,
}: {
  cart: Cart;
  content: PromotionalCheckoutSectionContent;
}) {
  const [currentStep, setCurrentStep] = useState<number>(
    promotionalSteps.DISCOUNT_CODE,
  );
  const searchParams = useSearchParams();
  const presetDiscountCode = searchParams.get("promo");

  // We are setting the checkout session id cookie here because we can't do so
  // in a server component; only in a client component that uses a server action
  useEffect(() => {
    void setSampleCartCookie(cart.id);
  }, [cart.id]);

  return (
    <div className="mb-60">
      <SteppedAccordion
        steps={promotionalSteps}
        currentStep={currentStep}
        content={content}
        setCurrentStep={setCurrentStep}
      >
        <DiscountCodeForm
          cart={cart}
          presetDiscountCode={presetDiscountCode}
          moveToNextStep={() => setCurrentStep(promotionalSteps.CONTACT)}
        />
        <ContactInfoForm
          cart={cart}
          moveToNextStep={() => setCurrentStep(promotionalSteps.SHIPPING)}
        />

        <ShippingAddressForm cart={cart} />
      </SteppedAccordion>
    </div>
  );
}
