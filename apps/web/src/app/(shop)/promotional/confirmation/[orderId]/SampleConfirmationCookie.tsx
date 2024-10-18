"use client";

import { useEffect } from "react";

export default function SampleConfirmationCookie() {
  // We are deleting the checkout session id cookie here because we can't do so in a server
  // component; only in a client component that uses a server action or route handler
  useEffect(() => {
    // Due to the way server actions that manipulate cookies re-render the page,
    // and the fact that order confirmation calls Payon's "/payments" that is
    // rate-limited, we need to use an api route to delete the cookies instead
    // https://github.com/vercel/next.js/issues/50163
    void fetch("/api/checkout/delete-cookies");
  }, []);

  return null;
}
