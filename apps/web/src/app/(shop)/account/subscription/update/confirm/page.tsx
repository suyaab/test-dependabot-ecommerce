import { Metadata } from "next";
import Link from "next/link";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { ServiceLocator as AuthServiceLocator } from "@ecommerce/auth";
import { ServiceLocator as CMSServiceLocator } from "@ecommerce/cms";
import { ServiceLocator as CommerceServiceLocator } from "@ecommerce/commerce";
import { getArrivalDate } from "@ecommerce/utils";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import EmptyCart from "~/app/(checkout)/checkout/emptyCart";
import OrderSummary from "~/app/(shop)/account/subscription/update/confirm/OrderSummary";
import { getAccountCart } from "~/app/actions/account/getAccountCart";
import ChevronDown from "~/icons/ChevronDown";
import { authRegionCheck } from "../../../helpers";
import ConfirmAddressBlock from "./ConfirmAddressBlock";
import ConfirmPaymentBlock from "./ConfirmPaymentBlock";
import DiscountCodeForm from "./DiscountCodeForm";
import UpdateSubscriptionButton from "./UpdateSubscriptionButton";

export async function generateMetadata(): Promise<Metadata> {
  const cms = CMSServiceLocator.getCMS();
  const metadata = await cms.getMetadata("Account");
  return metadata;
}

async function AccountMembershipUpdateConfirmPage({
  searchParams,
}: {
  searchParams?: { productId?: string };
}) {
  await authRegionCheck();

  const authService = AuthServiceLocator.getAuthService();
  const customer = await authService.getAuthenticatedCustomer();

  if (customer == null) {
    throw new Error("Unable to find customer for reactivation confirmation");
  }

  const productId = searchParams?.productId;

  if (productId == null) {
    throw new Error("No product provided for reactivation confirmation page");
  }

  const productService = CommerceServiceLocator.getProductService();
  const cartService = CommerceServiceLocator.getCartService();
  const product = await productService.getProduct(productId);

  const cms = CMSServiceLocator.getCMS();
  const {
    backButtonText,
    pageTitle,
    paymentAuthorizationInfo,
    shippingSection,
    paymentSection,
    subscriptionAcknowledgement,
    discountCodeForm,
    totalSectionLabels,
  } = await cms.getAccountManagementOrderSummaryContent();

  const productContent = await cms.getProductCardContent(product.sku);

  const nextOrderDate = customer.subscription?.nextOrderDate
    ? new Date(customer.subscription.nextOrderDate).toISOString()
    : new Date().toISOString();

  const deliveryDate = getArrivalDate(nextOrderDate, "US", "UPS");

  let cart;
  cart = await getAccountCart();
  if (cart == null) {
    return <EmptyCart href="/account/subscription/update" />;
  }

  if (
    customer.shippingAddress != null &&
    JSON.stringify(customer.shippingAddress) !==
      JSON.stringify(cart.shippingAddress)
  ) {
    cart = await cartService.updateCartShippingAddress(
      cart.id,
      cart.version,
      customer.shippingAddress,
      false,
    );
  }
  return (
    <div className="container">
      <AnalyticsPageTracker page="account-subscription-update-confirmation" />

      <div className="my-8 mb-20">
        <Link href="/account" className="flex">
          <ChevronDown color="black" className="size-8 rotate-90" />
          <p className="ml-6 text-lg">{backButtonText}</p>
        </Link>

        <h3 className="my-8 hidden md:block">{pageTitle}</h3>
        <div className="mb-2 mt-14 w-full flex-col rounded-xl bg-linen p-6">
          <p className="text-lg font-bold">
            {paymentAuthorizationInfo?.notice ?? ""}
          </p>
          <p className="font-st text-base text-charcoal/70">
            {paymentAuthorizationInfo?.details ?? ""}
          </p>
        </div>
        <DiscountCodeForm
          cart={cart}
          productId={productId}
          content={{ ...discountCodeForm }}
        />
        <div className="flex w-full flex-col items-center">
          <OrderSummary
            cart={cart}
            deliveryDate={deliveryDate}
            content={{
              eyebrow: productContent.eyebrow,
              productTitle: productContent.title,
              description: productContent.description,
              ...totalSectionLabels,
              productPrice: product.price,
            }}
          />
          <ConfirmAddressBlock
            customer={customer}
            content={{ ...shippingSection }}
            productId={productId}
          />
          <ConfirmPaymentBlock
            customer={customer}
            content={{ ...paymentSection }}
            productId={productId}
          />
          <p
            className="mx-0 mb-18 mt-10 text-xs md:mx-12"
            dangerouslySetInnerHTML={{
              __html: (subscriptionAcknowledgement?.text ?? "").replace(
                subscriptionAcknowledgement.lingoPrivacyNoticeText,
                `<a href="${subscriptionAcknowledgement.lingoPrivacyNoticeUrl}" target="_blank" rel="noopener"  class="underline">${subscriptionAcknowledgement.lingoPrivacyNoticeText}</a>`,
              ),
            }}
          />
          <UpdateSubscriptionButton
            customer={customer}
            cartId={cart.id}
            cartVersion={cart.version}
            productId={productId}
            content={{ buttonText: productContent.title }}
          />
        </div>
      </div>
    </div>
  );
}

export default withPageAuthRequired(AccountMembershipUpdateConfirmPage, {
  returnTo: "/account/subscription/update/confirm",
});
