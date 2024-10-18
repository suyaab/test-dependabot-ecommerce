import { ReactNode } from "react";

import Button from "~/components/Button";
import { Dialog, DialogCloseIcon, DialogContent } from "~/components/Dialog";

interface DialogWithButtonProps {
  children: ReactNode;
  isOpen: boolean;
  isTimerEnabled: boolean;
  triggerButtonLabel?: string;
  buttonClassName?: string;
  dialogContainerClassName?: string;
  dialogCloseButtonClassName?: string;
  analyticsLocationAttribute?: string;
  handleDialogOpen: (isOpen: boolean) => void;
}

export default function DialogWithButton({
  children,
  isOpen = false,
  isTimerEnabled = false,
  triggerButtonLabel = "Join waitlist",
  buttonClassName,
  dialogContainerClassName,
  dialogCloseButtonClassName,
  analyticsLocationAttribute,
  handleDialogOpen,
}: DialogWithButtonProps) {
  return (
    <>
      {!isTimerEnabled && (
        <Button
          className={buttonClassName}
          variant="dark"
          text={triggerButtonLabel}
          onClick={() => handleDialogOpen(true)}
          analyticsActionAttribute="dialogTrigger"
          analyticsLocationAttribute={analyticsLocationAttribute}
        />
      )}
      {/* TODO: Refactor this to use DialogTrigger */}
      <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
        <DialogContent className={dialogContainerClassName}>
          <DialogCloseIcon className={dialogCloseButtonClassName} />
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}
