import Link from "next/link";

export default function AdditionalPrivacyNotice({
  isAutoRenew,
}: {
  isAutoRenew: boolean;
}) {
  if (!isAutoRenew) {
    return (
      <p className="text-xs text-charcoal/60">
        By clicking &apos;Next&apos; you are acknowledging that you are
        authorizing Lingo to charge the payment method used at checkout for a
        one-time payment. You also agree to the creation of your Lingo profile
        and the processing of your health data as described in the&nbsp;
        <Link
          href="/privacy-notice"
          target="_blank"
          rel="noreferrer"
          data-analytics-action="Additional Information Privacy Notice"
          className="underline hover:no-underline"
        >
          Lingo Privacy Notice
        </Link>
        .
      </p>
    );
  } else {
    return (
      <p className="text-xs text-charcoal/60">
        By clicking &apos;Next&apos; you are authorizing Lingo to charge the
        payment method saved in your Lingo account at the beginning of each
        auto-renew cycle. Your subscription will continue until you cancel. You
        can cancel 48 hours before your next auto-renewal date by going to your
        account settings. You also agree to the creation of your Lingo profile
        and the processing of your health data as described in the&nbsp;
        <Link
          href="/privacy-notice"
          target="_blank"
          rel="noreferrer"
          data-analytics-action="Additional Information Privacy Notice"
          className="underline hover:no-underline"
        >
          Lingo Privacy Notice
        </Link>
        .
      </p>
    );
  }
}
