"use client";

import { useState } from "react";

import { LocationAttributes } from "@ecommerce/analytics";
import { Subscription } from "@ecommerce/commerce";

import Datepicker from "~/components/Datepicker";
import {
  Dialog,
  DialogCloseIcon,
  DialogContent,
  DialogTrigger,
} from "~/components/Dialog";
import { useToast } from "~/components/Toast";
import { updateCustomerSubscriptionDate } from "~/app/actions/account/subscription/updateCustomerSubscriptionDate";

export default function ChangeSubscriptionDate({
  subscription,
}: {
  subscription: Subscription;
}) {
  const { toast } = useToast();

  if (subscription == null) {
    throw new Error("Invalid subscription for change date");
  }

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(subscription.nextOrderDate);

  const today = new Date();
  const NinetyDaysOut = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

  if (subscription.nextOrderDate < today) {
    // TODO: what do we let the user do if this happens
    // as this should never happen without error
    return null;
  }

  const saveSubscriptionDate = async () => {
    const resp = await updateCustomerSubscriptionDate(selectedDate);
    setOpen(false);

    if (!resp.ok) {
      toast({ title: "Unable to change subscription date", status: "failure" });
      return;
    }
    toast({ title: "Subscription date changed", status: "success" });
  };

  return (
    <div className="mr-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          asChild
          data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
        >
          <p className="cursor-pointer underline">Change date</p>
        </DialogTrigger>

        <DialogContent className="flex max-h-full w-full flex-col border-none bg-linen-light p-0 lg:h-auto lg:max-w-screen-lg">
          <div className="mx-8 my-12 flex flex-grow flex-col overflow-auto lg:justify-center">
            <h5 className="my-4">Change your subscription date</h5>

            <div className="flex items-center justify-center py-6 lg:p-8">
              <Datepicker
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                minDate={today}
                maxDate={NinetyDaysOut}
              />
            </div>

            <div className="flex justify-center">
              <button
                className="button-dark w-48"
                onClick={() => void saveSubscriptionDate()}
              >
                Save
              </button>
            </div>
          </div>
          <DialogCloseIcon className="[&>svg]:bg-linen" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
