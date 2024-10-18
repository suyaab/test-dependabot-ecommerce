"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CountryGateRedirectDialogContent } from "@ecommerce/cms";

import {
  Dialog,
  DialogCloseIcon,
  DialogContent,
  DialogTrigger,
} from "~/components/Dialog";
import { CookieKey } from "~/app/actions/constants/CookieKey";
import { getCookie, setCookie } from "~/lib/cookies";

interface CountryGateRedirectDialogProps {
  autoOpen?: boolean;
  showDebugTrigger?: boolean;
  content: CountryGateRedirectDialogContent;
  countryName: string;
}

/**
 * This modal is used to gate users based on their country.
 * It will show a dialog with a message and a choice to redirect the user to a different store.
 *
 * @param {boolean} autoOpen - Whether the dialog should open automatically
 * @param {boolean} showDebugTrigger - Whether to show a button to open the dialog (used for storybook)
 * @param {object} content - The text content for the dialog
 * @param countryName - The name of the user's geolocation country
 */
export default function CountryGateRedirectDialog({
  showDebugTrigger = false,
  autoOpen = true,
  content,
  countryName,
}: CountryGateRedirectDialogProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(autoOpen);

  const {
    headerText,
    choiceText,
    noLabel,
    yesLabel,
    redirectToUrl,
    redirectToStoreName,
  } = content;

  /**
   * When the user clicks the "No" button, we set a cookie to remember their choice.
   * It will prevent the dialog from showing again for 1 hour.
   */
  const handleNoClick = () => {
    setCookie(CookieKey.COUNTRY_GATE_CLOSED, "true", {
      maxAge: 60 * 60, // one hour (TODO: environment variable?)
      path: "/",
    });

    // Close the modal
    setIsOpen(false);
  };

  const handleYesClick = () => {
    router.push(redirectToUrl);
  };

  useEffect(() => {
    // Don't show the dialog if the user has closed it intentionally recently
    const cookie = getCookie(CookieKey.COUNTRY_GATE_CLOSED);
    if (cookie != null) {
      return;
    }

    // Set ready once hydrated
    setReady(true);
  }, [autoOpen]);

  if (!ready) {
    return null;
  }

  return (
    <Dialog
      onOpenChange={setIsOpen}
      open={isOpen}
      data-analytics-location="country-gate-dialog"
    >
      <DialogContent className="bg-linen px-6 py-8 max-lg:bottom-0 max-lg:left-0 max-lg:right-0 max-lg:top-auto max-lg:ml-[50%] max-lg:-translate-x-1/2 max-lg:-translate-y-0 lg:min-w-[700px] lg:rounded-lg lg:p-20">
        <main className="pt-12 lg:pt-0">
          <h4 className="mb-4">
            {headerText} {countryName}
          </h4>
          <p className="mb-10">
            {choiceText} {redirectToStoreName}
          </p>
          <div>
            <button
              onClick={handleYesClick}
              autoFocus={true}
              className="button-dark mb-2 mr-2 lg:mb-0"
            >
              {yesLabel}
            </button>
            <button
              onClick={handleNoClick}
              className="button-dark mb-2 mr-2 bg-charcoal/20 text-white lg:mb-0"
            >
              {noLabel}
            </button>
          </div>
        </main>
        <DialogCloseIcon onClick={() => setIsOpen(false)} />
      </DialogContent>
      {showDebugTrigger && (
        <DialogTrigger asChild>
          <button className="button-dark">CountryGateRedirectDialog</button>
        </DialogTrigger>
      )}
    </Dialog>
  );
}
