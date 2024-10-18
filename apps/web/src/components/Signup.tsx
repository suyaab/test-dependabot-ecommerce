"use client";

import { useState } from "react";
import { z } from "zod";

import { ActionAttributes } from "@ecommerce/analytics";
import { SignupSource } from "@ecommerce/marketing";
import { US_INPUT_LIMITS } from "@ecommerce/utils";

import signup from "~/app/actions/signup/signup";
import ArrowRight from "~/icons/ArrowRight";
import cn from "~/lib/utils";

interface SignupFields {
  signupDescription?: string;
  signupPlaceHolder: string;
  signupAdditionalText: string;
  signupSource: SignupSource;
  inputClassName?: string;
  submitClassName?: string;
  handleSuccess?: () => void;
  analyticsLocationAttribute?: string;
}

export default function SignUpForm({
  signupDescription,
  signupPlaceHolder,
  signupAdditionalText,
  signupSource,
  inputClassName,
  submitClassName,
  handleSuccess,
  analyticsLocationAttribute,
}: SignupFields) {
  type Status = "loading" | "success" | "signup";
  const [status, setStatus] = useState<Status>("signup");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async () => {
    setStatus("loading");

    const emailSchema = z.string().email();
    const parsedBody = emailSchema.safeParse(email);

    if (!parsedBody.success) {
      setErrorMessage("Please enter valid email.");
      setStatus("signup");

      return;
    }

    const validatedEmail = parsedBody.data;

    try {
      await signup(validatedEmail, signupSource, "NO_PURCHASE");
      setStatus("success");
      handleSuccess?.();
    } catch {
      setStatus("signup");
      setErrorMessage("An error occurred please try again!");
    }
  };

  if (status == "loading") {
    return <div> Loading....</div>;
  }

  if (status === "success") {
    return <div>Thank you for subscribing.</div>;
  }

  return (
    <>
      <p className="mb-4 opacity-50">{signupDescription}</p>
      <form
        className="relative"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSignup();
        }}
      >
        <input
          type="email"
          className={cn(
            "form-input relative z-0 mb-2 block w-full rounded-full border-b border-linen-light bg-transparent py-2 pl-6 pr-12 text-linen placeholder-white",
            inputClassName,
          )}
          placeholder={signupPlaceHolder}
          onChange={(e) => {
            setErrorMessage("");
            setEmail(e.target.value);
          }}
          maxLength={US_INPUT_LIMITS.email}
        />
        <p className="mb-3 mt-1 text-xs text-red">{errorMessage}</p>
        <div
          className="text-xs text-white/50 [&>a:hover]:no-underline [&>a]:underline"
          dangerouslySetInnerHTML={{ __html: signupAdditionalText }}
        />
        <button
          className={cn(
            "absolute right-3 top-3 z-10 p-3 text-right transition-all duration-300 hover:right-1",
            submitClassName,
          )}
          data-analytics-action={ActionAttributes.SIGNUP_CTA}
          data-analytics-location={analyticsLocationAttribute}
        >
          <ArrowRight color="white" />
        </button>
      </form>
    </>
  );
}
