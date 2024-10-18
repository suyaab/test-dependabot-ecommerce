"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { z } from "zod";

import { LocationAttributes } from "@ecommerce/analytics";
import { EmailsCollectionModalContent } from "@ecommerce/cms";
import { US_INPUT_LIMITS } from "@ecommerce/utils";

import Button from "~/components/Button";
import DialogWithButton from "~/components/DialogWithButton";
import ResponsiveImage from "~/components/ResponsiveImage";
import { CookieKey } from "~/app/actions/constants/CookieKey";
import signup from "~/app/actions/signup/signup";
import ArrowRight from "~/icons/ArrowRight";
import { getCookie, setCookie } from "~/lib/cookies";
import cn from "~/lib/utils";

export default function EmailsCollectionModal({
  modalContent,
  delayTimer,
  dialogButtonClassName,
  handleOpenButtonClick,
  children,
}: {
  modalContent: EmailsCollectionModalContent;
  delayTimer?: number;
  dialogButtonClassName?: string;
  handleOpenButtonClick?: () => void;
  children?: ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmittedSuccessfully, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    // Don't show the dialog if the user has closed it intentionally recently
    const cookie = getCookie(CookieKey.EMAIL_COLLECTION_MODAL_CLOSED);
    if (delayTimer == null || cookie != null) {
      return;
    }

    const timer = setTimeout(() => {
      setIsDialogOpen(true);
    }, delayTimer);

    return () => clearTimeout(timer);
  }, [delayTimer]);

  const { url, desktopUrl, alt, width, height, desktopWidth, desktopHeight } =
    modalContent.image;
  const {
    heading,
    leadText,
    inputPlaceholder,
    disclaimer,
    buttonLabel,
    dontShowAgainLabel,
    successfulSubmitHeading,
    successfulSubmitText,
    successfulSubmitButtonLabel,
  } = modalContent;

  async function handleSubmit(formData: FormData) {
    setFormError("");
    const email = formData.get("email");
    const emailSchema = z.string().email();
    const parsedBody = emailSchema.safeParse(email);

    if (!parsedBody.success) {
      setFormError("Please enter a valid email");
      return;
    }
    const validatedEmail = parsedBody.data;
    try {
      await signup(validatedEmail, "us_metabolism101", "NO_PURCHASE");
      setIsSubmitted(true);
    } catch {
      setFormError("An error occurred while submitting your email.");
      setIsSubmitted(true);
    }
  }

  function toggleDialogOpen() {
    setFormError("");
    setIsDialogOpen((prevDialogOpenState) => {
      if (!prevDialogOpenState) setIsSubmitted(false);

      if (handleOpenButtonClick != null && prevDialogOpenState) {
        setTimeout(() => {
          handleOpenButtonClick();
        }, 100);
      }
      return !prevDialogOpenState;
    });
  }

  function handleDontShowAgain() {
    setCookie(CookieKey.EMAIL_COLLECTION_MODAL_CLOSED, "true", {
      maxAge: 60 * 60 * 24 * 30, // one month
    });

    toggleDialogOpen();
  }

  function FormArrowSubmit() {
    const { pending } = useFormStatus();
    return (
      <button disabled={pending} className={cn({ "opacity-90": pending })}>
        <ArrowRight className="absolute right-5 top-6" />
      </button>
    );
  }

  function FormSubmit() {
    const { pending } = useFormStatus();

    return (
      <Button
        isDisabled={pending}
        isLoading={pending}
        text={buttonLabel}
        className="mt-8 px-12 lg:w-max"
        variant="dark"
        buttonType="submit"
        analyticsActionAttribute="signupMetabolismGuide"
        analyticsLocationAttribute={LocationAttributes.EMAIL_COLLECTION_MODAL}
      />
    );
  }

  return (
    <DialogWithButton
      isOpen={isDialogOpen}
      isTimerEnabled={delayTimer != null}
      dialogContainerClassName="lg:max-w-6xl border-0 p-0 lg:rounded-lg max-lg:h-full overflow-auto bg-linen-light"
      dialogCloseButtonClassName="max-lg:mt-20"
      buttonClassName={dialogButtonClassName}
      handleDialogOpen={toggleDialogOpen}
      analyticsLocationAttribute={LocationAttributes.EMAIL_COLLECTION_MODAL}
    >
      <div
        className="w-full lg:flex"
        data-analytics-location={LocationAttributes.EMAIL_COLLECTION_MODAL}
      >
        {children}
        <ResponsiveImage
          className="flex-shrink-0 lg:w-1/3 lg:rounded-l-lg"
          url={url}
          desktopUrl={desktopUrl}
          alt={alt}
          width={width}
          height={height}
          desktopWidth={desktopWidth}
          desktopHeight={desktopHeight}
        />
        <div className="my-auto max-lg:mt-20 max-lg:px-6 lg:p-20">
          {isSubmittedSuccessfully ? (
            <>
              <h3 className="mb-4">{successfulSubmitHeading}</h3>
              <p
                dangerouslySetInnerHTML={{ __html: successfulSubmitText }}
                className="opacity-60"
              />
              <div className="w-full">
                <Button
                  text={successfulSubmitButtonLabel}
                  className="mt-8 block px-12 max-lg:mx-auto lg:w-max"
                  variant="dark"
                  onClick={toggleDialogOpen}
                  analyticsActionAttribute="closeMetabolismGuide"
                  analyticsLocationAttribute={
                    LocationAttributes.EMAIL_COLLECTION_MODAL
                  }
                />
              </div>
            </>
          ) : (
            <>
              <h3 className="mb-4">{heading}</h3>
              {leadText != null && (
                <p
                  dangerouslySetInnerHTML={{ __html: leadText }}
                  className="opacity-60"
                />
              )}
              {/* React jsx form element accepts both sync and async functions as per https://react.dev/reference/react-dom/components/form */}
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <form className="mt-8 flex flex-col" action={handleSubmit}>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    placeholder={inputPlaceholder}
                    className="form-input rounded-full bg-linen-light pl-6 pr-10"
                    maxLength={US_INPUT_LIMITS.email}
                    autoFocus
                  />
                  {formError != "" && (
                    <p className="mt-1 text-xs text-red">{formError}</p>
                  )}
                  <FormArrowSubmit />
                </div>
                <small className="mt-8 text-charcoal/60">
                  {disclaimer.content}{" "}
                  {disclaimer.route != null && (
                    <Link
                      href={disclaimer.route.url}
                      data-analytics-location={
                        LocationAttributes.EMAIL_COLLECTION_MODAL
                      }
                      data-analytics-action="disclaimerMetabolismGuide"
                      className="underline hover:no-underline"
                    >
                      {disclaimer.route.text}
                    </Link>
                  )}
                </small>
                <FormSubmit />
              </form>
              {dontShowAgainLabel != null && (
                <small>
                  <Button
                    className="mx-auto mt-6 w-full text-left underline"
                    text={dontShowAgainLabel}
                    onClick={handleDontShowAgain}
                    analyticsActionAttribute="dontShowAgainMetabolismGuide"
                    analyticsLocationAttribute={
                      LocationAttributes.EMAIL_COLLECTION_MODAL
                    }
                  />
                </small>
              )}
            </>
          )}
        </div>
      </div>
    </DialogWithButton>
  );
}
