import { Metadata } from "next";
import { headers } from "next/headers";

import { ServiceLocator as CMSServiceLocator } from "@ecommerce/cms";
import { ServiceLocator as CommerceServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";
import { getArrivalDate } from "@ecommerce/utils";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import { extractProductInfo } from "~/components/analytics/extractProductInfo";
import CheckoutProductCartItem from "~/components/CheckoutProductCartItem";
import BillingSection from "~/components/order/BillingSection";
import PaymentSection from "~/components/order/PaymentSection";
import ShippingSection from "~/components/order/ShippingSection";
import WhatsNextSection from "~/components/order/WhatsNextSection";
import ActionException from "~/app/actions/ActionException";
import OrderConfirmationCookies from "./OrderConfirmationCookies";

export async function generateMetadata(): Promise<Metadata> {
  const cms = CMSServiceLocator.getCMS();
  return await cms.getMetadata("OrderConfirmation");
}

export default async function OrderConfirmation({
  params: { orderId },
}: {
  params: { orderId: string };
}) {
  const logger = getLogger({
    prefix: "web:orderConfirmation",
    headers: headers(),
  });
  try {
    const orderService = CommerceServiceLocator.getOrderService();
    const order = await orderService.getOrderById(orderId);

    const cms = CMSServiceLocator.getCMS();
    const {
      header,
      whatsNext,
      confirmation,
      payment,
      billing,
      shipping,
      footer,
      failedToFetch,
    } = await cms.getOrderConfirmationContent();

    if (order?.lineItems[0]?.product.sku == null) {
      return <p>{failedToFetch}</p>;
    }

    const orderSkus = order.lineItems.map(({ product }) => product.sku);
    const productsData = await cms.getProductCardsContent(orderSkus);

    let estimatedDeliveryDate;

    if (
      order.shippingAddress?.countryCode != null &&
      order.shippingMethod != null
    ) {
      estimatedDeliveryDate = getArrivalDate(
        order.createdAt,
        order.shippingAddress.countryCode,
        order.shippingMethod,
      );
    }

    const productInfo = extractProductInfo(order);
    return (
      <>
        <AnalyticsPageTracker
          page="order-confirmation"
          dynamicData={productInfo}
        />
        <div className="grid-container">
          <section className="col-span-full my-20 lg:col-span-10 lg:col-start-2">
            <h2 className="h3 mb-4 font-semibold">
              {header.title}, {order.shippingAddress.firstName}{" "}
              {order.shippingAddress.lastName}!
            </h2>
            <p>{header.description}</p>
          </section>
        </div>

        <OrderConfirmationCookies />

        <WhatsNextSection
          customerEmail={order.customerEmail}
          content={whatsNext}
        />

        <div className="grid-container">
          <section className="col-span-full mb-12 mt-20 lg:col-span-10 lg:col-start-2">
            <div className="rounded-lg bg-white px-3 py-4">
              <h3 className="subtitle mb-3 font-medium">
                {confirmation.title} {order.orderNumber}
              </h3>

              <p className="text-base">
                {confirmation.fulfilled} {order.shippingMethod}
              </p>
            </div>
          </section>

          <section className="col-span-full rounded-lg border-2 border-charcoal/20 lg:col-span-10 lg:col-start-2">
            {estimatedDeliveryDate != null && (
              <p className="ml-5 mt-2.5 inline-block rounded bg-blue/20 px-3 py-1.5 text-xs text-blue">
                {confirmation.delivery} {estimatedDeliveryDate}
              </p>
            )}

            <div className="flex justify-between pb-4 pl-4 pr-4 pt-6 lg:pb-12 lg:pl-12 lg:pr-20 lg:pt-8">
              {productsData.map((product, index) => (
                <CheckoutProductCartItem
                  product={product}
                  key={`${index}-${product.title}`}
                />
              ))}
            </div>
          </section>

          <section className="col-span-full lg:col-span-10 lg:col-start-2">
            <div className="my-14 grid-cols-3 gap-36 lg:grid">
              <PaymentSection order={order} content={payment} />
              <ShippingSection content={shipping} order={order} />
              <BillingSection order={order} content={billing} />
            </div>

            <h6 className="mb-4 font-medium text-lg lg:mt-24">
              {footer.title}
            </h6>
            <div
              className="mb-20 text-base [&_a:hover]:no-underline [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: footer.description }}
            />
          </section>
        </div>
      </>
    );
  } catch (error) {
    if (!(error instanceof ActionException)) {
      logger.error(error, "Failed to load order confirmation page");
    }
    throw error;
  }
}
