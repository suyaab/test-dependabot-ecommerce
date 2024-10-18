import React from "react";

import Spinner from "~/icons/Spinner";
import cn from "~/lib/utils";

export interface ButtonProps {
  text: string;
  variant?: string;
  className?: string;
  autoFocus?: boolean;
  buttonType?: "button" | "submit";
  isLoading?: boolean;
  isDisabled?: boolean;
  analyticsLocationAttribute?: string;
  analyticsActionAttribute?: string;
  onClick?: () => void;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      text,
      variant,
      className,
      autoFocus,
      buttonType = "button",
      isLoading = false,
      isDisabled = false,
      analyticsActionAttribute,
      analyticsLocationAttribute,
      onClick,
    }: ButtonProps,
    forwardedRef: React.Ref<HTMLButtonElement>,
  ) => {
    const buttonClassNames = cn(className, {
      "button-light": variant === "light",
      "button-dark": variant === "dark",
      "button-outline": variant === "outline",
    });

    return (
      <button
        ref={forwardedRef}
        className={buttonClassNames}
        type={buttonType}
        disabled={isDisabled}
        autoFocus={autoFocus}
        onClick={onClick}
        data-analytics-action={analyticsActionAttribute}
        data-analytics-location={analyticsLocationAttribute}
      >
        <span className="relative px-6 text-center">
          {isLoading && (
            <Spinner className="spinner absolute left-0 top-0 mr-2 inline-block size-4 text-white" />
          )}
          <span>{text}</span>
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
