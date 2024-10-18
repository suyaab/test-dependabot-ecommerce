"use client";

import React, { useEffect, useState } from "react";

import { CheckoutSectionContent } from "@ecommerce/cms";
import { Cart, Product } from "@ecommerce/commerce";
import { CheckoutSession } from "@ecommerce/finance";
import { createSteps } from "@ecommerce/utils";

import SteppedAccordion from "~/components/SteppedAccordion";
import { setCheckoutSessionIdCookie } from "~/app/actions/checkout/checkoutSession";
import BillingPaymentForm from "./form/billingPayment/BillingPaymentForm";
import ContactInfoForm from "./form/contact/ContactInfoForm";
import ShippingAddressForm from "./form/shipping/ShippingAddressForm";

const checkoutStepsList = ["CONTACT", "SHIPPING", "BILLING"] as const;
const checkoutSteps = createSteps(checkoutStepsList);

export interface CheckoutFormProps {
  cart: Cart;
  product: Product;
  checkoutSession: CheckoutSession;
  content: CheckoutSectionContent;
}

export default function CheckoutForm({
  cart,
  product,
  checkoutSession,
  content,
}: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState<number>(checkoutSteps.CONTACT);

  useEffect(() => {
    void setCheckoutSessionIdCookie(checkoutSession.id);
  }, [checkoutSession.id]);

  return (
    <div className="mb-60">
      <SteppedAccordion
        steps={checkoutSteps}
        currentStep={currentStep}
        content={content}
        setCurrentStep={setCurrentStep}
      >
        <ContactInfoForm
          cart={cart}
          product={product}
          checkoutSession={checkoutSession}
          moveToNextStep={() => setCurrentStep(checkoutSteps.SHIPPING)}
        />
        <ShippingAddressForm
          cart={cart}
          checkoutSession={checkoutSession}
          moveToNextStep={() => setCurrentStep(checkoutSteps.BILLING)}
        />
        <BillingPaymentForm cart={cart} checkoutSession={checkoutSession} />
      </SteppedAccordion>
    </div>
  );
}
