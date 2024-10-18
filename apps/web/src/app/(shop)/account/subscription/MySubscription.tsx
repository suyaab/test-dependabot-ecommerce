import { Customer } from "@ecommerce/commerce";

import NextPlanDetails from "~/app/(shop)/account/subscription/NextPlanDetails";
import NoActiveSubscription from "~/app/(shop)/account/subscription/NoActiveSubscription";
import SubscriptionDetails from "~/app/(shop)/account/subscription/SubscriptionDetails";

export default function MySubscription({ customer }: { customer: Customer }) {
  if (customer?.subscription == null) {
    return <NoActiveSubscription url="/products" />;
  }

  return (
    <>
      <SubscriptionDetails subscription={customer.subscription} />
      <NextPlanDetails subscription={customer.subscription} />
    </>
  );
}
