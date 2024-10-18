"use client";

import { useState } from "react";

import { LocationAttributes } from "@ecommerce/analytics";

import Button from "~/components/Button";
import {
  Dialog,
  DialogClose,
  DialogCloseIcon,
  DialogContent,
  DialogTrigger,
} from "~/components/Dialog";
import { cancelCustomerSubscription } from "~/app/actions/account/subscription/cancelCustomerSubscription";

export default function CancelSubscriptionButton() {
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

  const onCancelledClick = async () => {
    const response = await cancelCustomerSubscription();

    if (!response.ok) {
      setOpen(false);
      setErrorMessage(response.message);
      return;
    }

    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center">
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger
          asChild
          data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
        >
          <Button
            className="font-semibold underline"
            text="Cancel subscription"
          />
        </DialogTrigger>

        <DialogContent className="flex max-h-full w-full border-none bg-linen-light p-0 lg:h-auto lg:max-w-screen-lg">
          <div className="mx-8 my-12 flex flex-col overflow-auto lg:w-2/3 lg:justify-center">
            <div className="mt-6 lg:mb-8">
              <h3 className="mb-3 font-semibold">Think on it?</h3>

              <p>
                Cancel, if you&apos;re sure. Or keep Lingo for a bit and see how
                you feel.
              </p>

              <div className="mt-3 flex flex-col items-start gap-3 lg:flex-row">
                <div>
                  <button
                    onClick={() => void onCancelledClick()}
                    className="button-dark"
                    data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
                    data-analytics-action="Cancel Subscription"
                  >
                    Continue
                  </button>
                </div>

                <DialogClose asChild>
                  <button
                    className="button-outline"
                    data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
                    data-analytics-action="Keep Subscription"
                  >
                    Keep Lingo
                  </button>
                </DialogClose>
              </div>

              <DialogCloseIcon className="[&>svg]:bg-linen" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {errorMessage != "" && (
        <div className="my-6 flex justify-center">
          <p className="text-red" aria-live="polite" role="status">
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  );
}
