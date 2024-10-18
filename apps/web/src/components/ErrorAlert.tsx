import { useEffect, useRef } from "react";

import AlertTriangle from "~/icons/AlertTriangle";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorMessageProps) {
  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (message != "") {
      errorRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [message]);
  return (
    <div
      className="my-6 flex scroll-my-24 flex-col items-center justify-center rounded-lg border-2 border-red bg-red/10 p-5"
      ref={errorRef}
    >
      <AlertTriangle className="mb-2" />
      <p className="text-center text-red" aria-live="polite" role="status">
        {message}
      </p>
    </div>
  );
}
