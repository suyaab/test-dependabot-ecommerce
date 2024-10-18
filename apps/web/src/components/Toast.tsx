"use client";

import {
  ComponentPropsWithoutRef,
  createContext,
  ElementRef,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";

import Checkmark from "~/icons/Checkmark";
import InfoIcon from "~/icons/InfoIcon";
import cn from "~/lib/utils";

const Toast = forwardRef<
  ElementRef<typeof ToastPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Root>
>(({ ...props }, innerRef) => (
  <ToastPrimitive.Root
    ref={innerRef}
    className={cn("border-r-1 rounded bg-white p-3 py-6 shadow-lg")}
    {...props}
  />
));
Toast.displayName = ToastPrimitive.Root.displayName;

const ToastTitle = forwardRef<
  ElementRef<typeof ToastPrimitive.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ ...props }, innerRef) => (
  <ToastPrimitive.Title
    ref={innerRef}
    className={cn("text-lg font-bold text-charcoal")}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

const ToastDescription = ToastPrimitive.Description;

const ToastAction = ToastPrimitive.Action;

const ToastClose = ToastPrimitive.Close;

const ToastViewport = forwardRef<
  ElementRef<typeof ToastPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ ...props }, innerRef) => (
  <ToastPrimitive.Viewport
    ref={innerRef}
    className={cn(
      "fixed left-1/2 top-0 z-40 flex w-full max-w-[100vw] -translate-x-1/2 transform list-none flex-col gap-1.5 p-2 outline-none lg:w-1/2",
    )}
    {...props}
  />
));

ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

interface ToastOptions {
  title: string;
  description?: string;
  status?: "success" | "failure" | undefined;
}

interface ToastContext {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContext | undefined>(undefined);

/**
 * ToastProvider is an abstracted component that provides uses Radix Toast Primitize and provides a hook
 * to show and add data to the Toast.
 *
 * @param children - The child components that will have access to the toast functionality.
 */
function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const [toastState, setToastState] = useState<ToastOptions>({
    title: "",
  });

  const toast = useCallback(({ title, description, status }: ToastOptions) => {
    setToastState({ title, description, status });
    setOpen(true);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastPrimitive.Provider>
        <Toast
          open={open}
          onOpenChange={setOpen}
          duration={3000}
          className={cn(
            "rounded-lg bg-white p-3",
            { "border border-green": toastState?.status === "success" },
            { "border border-red": toastState?.status === "failure" },
          )}
        >
          <div
            className={cn("flex items-center", {
              "h-12": toastState?.description == null,
            })}
          >
            {toastState?.status === "success" && (
              <Checkmark className="mx-4 size-6 lg:mx-6" color="green" />
            )}

            {toastState?.status === "failure" && (
              <InfoIcon className="mx-4 size-6 lg:mx-6" color="red" />
            )}

            <div>
              <ToastTitle>{toastState.title}</ToastTitle>

              {toastState?.description !== "" && (
                <ToastDescription>{toastState.description}</ToastDescription>
              )}
            </div>
          </div>
        </Toast>

        <ToastViewport />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

function useToast(): ToastContext {
  const context = useContext(ToastContext);

  if (context == null) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

export {
  Toast,
  useToast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastViewport,
};
