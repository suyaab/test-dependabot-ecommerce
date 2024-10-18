"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { CountryGateSignupDialogContent } from "@ecommerce/cms";

import {
  Dialog,
  DialogCloseIcon,
  DialogContent,
  DialogTrigger,
} from "~/components/Dialog";
import { CookieKey } from "~/app/actions/constants/CookieKey";
import signup from "~/app/actions/signup/signup";
import { setCookie } from "~/lib/cookies";

export const EmailSignupFormSchema = (emailInputInvalidMessage: string) =>
  z.object({
    inputEmail: z.string().email({ message: emailInputInvalidMessage }),
  });

export type EmailSignupForm = z.infer<ReturnType<typeof EmailSignupFormSchema>>;

interface ICountryGateSignupDialog {
  autoOpen?: boolean;
  showDebugTrigger?: boolean;
  content: CountryGateSignupDialogContent;
}

export default function CountryGateSignupDialog({
  showDebugTrigger = false,
  autoOpen = true,
  content,
}: ICountryGateSignupDialog) {
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(autoOpen);

  const { headerText, leadText, emailCapture } = content;
  const {
    emailInputPlaceholder,
    emailInputInvalidMessage,
    disclaimer,
    submitButtonLabel,
    successHeaderText,
    successLeadText,
    successSubmitButtonLabel,
  } = emailCapture;

  const [success, setSuccess] = useState(false);

  const methods = useForm<EmailSignupForm>({
    resolver: zodResolver(EmailSignupFormSchema(emailInputInvalidMessage)),
  });

  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<EmailSignupForm> = async (data) => {
    try {
      const { inputEmail } = data;
      await signup(inputEmail, "region_signup_dialog", "OTHER_COUNTRY");
      setCookie(CookieKey.COUNTRY_GATE_SIGNED_UP, "true", {
        maxAge: 60 * 60 * 24 * 30, // one month (TODO: environment variable?)
        path: "/",
      });
      setSuccess(true);
    } catch {
      setError("root", { message: "An unexpected error occurred" });
    }
  };

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
          {success ? (
            <>
              <h4 className="mb-4">{successHeaderText}</h4>
              <p className="mb-8 text-charcoal/60">{successLeadText}</p>
              <button
                className="button-dark px-10"
                onClick={() => setIsOpen(false)}
              >
                {successSubmitButtonLabel}
              </button>
            </>
          ) : (
            <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
              <h4 className="mb-4">{headerText}</h4>
              <p className="mb-6 text-charcoal/60">{leadText}</p>
              <input
                type="email"
                placeholder={emailInputPlaceholder}
                {...register("inputEmail")}
                className="form-input rounded-full border-charcoal pl-6"
              />
              {errors.inputEmail && (
                <p className="ml-6 mt-1 text-sm text-red">
                  {errors.inputEmail.message}
                </p>
              )}
              <button
                className="button-dark mt-6 px-10 text-base"
                disabled={isSubmitting}
              >
                {submitButtonLabel}
              </button>
              {errors.root && (
                <p className="ml-6 mt-1 text-sm text-red-500">
                  {errors.root.message}
                </p>
              )}
              <p
                className="mt-6 text-xs text-gray-600"
                dangerouslySetInnerHTML={{ __html: disclaimer }}
              />
            </form>
          )}
        </main>
        <DialogCloseIcon onClick={() => setIsOpen(false)} />
      </DialogContent>
      {showDebugTrigger && (
        <DialogTrigger asChild>
          <button className="button-dark">CountryGateSignupDialog</button>
        </DialogTrigger>
      )}
    </Dialog>
  );
}
