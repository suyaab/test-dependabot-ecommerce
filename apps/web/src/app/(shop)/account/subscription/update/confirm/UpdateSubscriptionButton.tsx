"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Customer } from "@ecommerce/commerce";

import Button from "~/components/Button";
import { updateCustomerSubscription } from "~/app/actions/account/reactivate/updateCustomerSubscription";

export default function UpdateSubscriptionButton({
  customer,
  cartId,
  cartVersion,
  productId,
  content,
}: {
  customer: Customer;
  cartId: string;
  cartVersion: number;
  productId: string;
  content: { buttonText: string };
}) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onUpdateSubscriptionClicked = async () => {
    setIsLoading(true);
    try {
      const response = await updateCustomerSubscription(
        cartId,
        cartVersion,
        productId,
      );

      if (!response.ok) {
        setErrorMessage(response.message);
        return;
      }
      router.push("/account/subscription");
    } catch {
      setErrorMessage(
        "Unable to reactivate subscription. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled =
    customer.shippingAddress == null ||
    customer.billingAddress == null ||
    customer.subscription?.paymentMethodId == null;

  return (
    <>
      <Button
        variant="dark"
        text={`Order ${content.buttonText}`}
        onClick={() => void onUpdateSubscriptionClicked()}
        className="w-full py-5 md:w-auto"
        isDisabled={isDisabled || isLoading}
        isLoading={isLoading}
      />

      {errorMessage != "" && (
        <div className="mt-12 flex items-center justify-center">
          <p className="text-red-500">{errorMessage}</p>
        </div>
      )}
    </>
  );
}
