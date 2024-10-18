"use client";

import React, { useCallback, useRef, useState } from "react";

import { LocationAttributes } from "@ecommerce/analytics";

import {
  Dialog,
  DialogClose,
  DialogCloseIcon,
  DialogContent,
  DialogTrigger,
} from "~/components/Dialog";
import { updateCustomerSubscriptionStatus } from "~/app/actions/account/subscription/updateCustomerSubscriptionStatus";
import cn from "~/lib/utils";
import Button from "../Button";

interface PauseResumeButtonProps {
  subscriptionStatus: "active" | "paused";
  className?: string;
}

const ANALYTICS_LOCATION = LocationAttributes.ACCOUNT_DETAILS;
const BUTTON_TEXTS = {
  active: "Pause Subscription",
  paused: "Resume Subscription",
};

const usePauseResumeSubscription = (initialStatus: "active" | "paused") => {
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

  const handleStatusChange = useCallback(async () => {
    const newStatus = initialStatus === "active" ? "paused" : "active";

    const response = await updateCustomerSubscriptionStatus(newStatus);

    if (!response.ok) {
      setOpen(false);
      setErrorMessage(response.message);
      return;
    }
    setOpen(false);
  }, [initialStatus]);

  return { errorMessage, handleStatusChange, open, setOpen };
};

const PauseResumeButton = ({
  subscriptionStatus,
  className,
}: PauseResumeButtonProps) => {
  const { errorMessage, handleStatusChange, open, setOpen } =
    usePauseResumeSubscription(subscriptionStatus);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild data-analytics-location={ANALYTICS_LOCATION}>
          <Button
            variant="outline"
            className="bg-white"
            text={BUTTON_TEXTS[subscriptionStatus]}
            onClick={() => setOpen(true)}
          />
        </DialogTrigger>

        <DialogContent className="flex max-h-full w-full border-none bg-linen-light p-0 lg:h-auto lg:max-w-screen-lg">
          <div className="mx-8 my-12 flex flex-col overflow-auto lg:w-2/3 lg:justify-center">
            <div className="mt-6 lg:mb-8">
              <h3 className="mb-3 font-semibold">
                {subscriptionStatus === "active"
                  ? "Are you sure?"
                  : "Subscription paused"}
              </h3>

              <p>
                {subscriptionStatus === "active"
                  ? "Pause your subscription to stop receiving shipments. You can resume at any time."
                  : "Your subscription is now paused. You can resubscribe now, or whenever you’d like."}
              </p>

              <div className="mt-3 flex flex-col items-start gap-3 lg:flex-row">
                <div>
                  <button
                    onClick={() => {
                      if (
                        buttonRef.current != null &&
                        !buttonRef.current.disabled
                      ) {
                        buttonRef.current.disabled = true;
                      }
                      void handleStatusChange();
                    }}
                    className="button-dark"
                    ref={buttonRef}
                    data-analytics-location={ANALYTICS_LOCATION}
                    data-analytics-action={`${
                      subscriptionStatus === "active"
                        ? "Confirm pause"
                        : "Resume plan"
                    }`}
                  >
                    {subscriptionStatus === "active"
                      ? "Confirm pause"
                      : "Resume plan"}
                  </button>
                </div>

                <DialogClose asChild>
                  <button
                    className="button-outline"
                    data-analytics-location={ANALYTICS_LOCATION}
                    data-analytics-action={`Keep the Subscription : ${subscriptionStatus} `}
                  >
                    {subscriptionStatus === "active"
                      ? "Continue with Lingo"
                      : "Return to account"}
                  </button>
                </DialogClose>
              </div>

              <DialogCloseIcon className="[&>svg]:bg-linen" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {errorMessage && (
        <div className="my-6 flex justify-center">
          <p className="text-red" aria-live="polite" role="status">
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  );
};

PauseResumeButton.displayName = "PauseResumeButton";

export default PauseResumeButton;
