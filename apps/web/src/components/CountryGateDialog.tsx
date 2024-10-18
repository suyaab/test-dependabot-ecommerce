"use client";

import { useEffect, useState } from "react";

import { CountryGateDialogContent } from "@ecommerce/cms";

import {
  Dialog,
  DialogCloseIcon,
  DialogContent,
  DialogTrigger,
} from "~/components/Dialog";

interface ICountryGateDialog {
  autoOpen?: boolean;
  showDebugTrigger?: boolean;
  content: CountryGateDialogContent;
}

export default function CountryGateDialog({
  showDebugTrigger = false,
  autoOpen = true,
  content,
}: ICountryGateDialog) {
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(autoOpen);

  const { headerText, leadText } = content;

  useEffect(() => {
    setReady(true);
  }, [autoOpen]);

  if (!ready) {
    return null;
  }

  return (
    <Dialog
      onOpenChange={setIsOpen}
      open={isOpen}
      data-analytics-location="country-signup"
    >
      <DialogContent className="bg-linen px-6 py-8 max-lg:bottom-0 max-lg:left-0 max-lg:right-0 max-lg:top-auto max-lg:ml-[50%] max-lg:-translate-x-1/2 max-lg:-translate-y-0 lg:min-w-[700px] lg:rounded-lg lg:p-20">
        <main className="pt-12 lg:pt-0">
          <h4 className="mb-4">{headerText}</h4>
          <p className="mb-6 text-charcoal/60">{leadText}</p>
        </main>
        <DialogCloseIcon onClick={() => setIsOpen(false)} />
      </DialogContent>
      {showDebugTrigger && (
        <DialogTrigger asChild>
          <button className="button-dark">CountryGateDialog</button>
        </DialogTrigger>
      )}
    </Dialog>
  );
}
