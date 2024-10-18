import { headers } from "next/headers";

import { Cart } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";
import { formatCurrency } from "@ecommerce/utils";

import ActionException from "~/app/actions/ActionException";
import CircleBiosensor from "~/icons/CircleBiosensor";
import ShippingTruck from "~/icons/ShippingTruck";

export default function OrderSummary({
  cart,
  deliveryDate,
  content,
}: {
  cart: Cart;
  deliveryDate: string;
  content: {
    eyebrow: string;
    productTitle: string;
    description: string;
    subtotalLabel: string;
    discountLabel: string;
    taxLabel: string;
    shippingLabel: string;
    savingsLabel: string;
    estimatedTotalLabel: string;
    productPrice: { currency: string; amount: number };
  };
}) {
  const logger = getLogger({
    prefix: "web:checkout:OrderSummaryAccountManagement",
    headers: headers(),
  });
  const {
    eyebrow,
    productTitle,
    description,
    subtotalLabel,
    discountLabel,
    taxLabel,
    shippingLabel,
    savingsLabel,
    estimatedTotalLabel,
    productPrice,
  } = content;
  try {
    const totalDiscount = cart.lineItems[0]?.totalDiscount ?? 0;

    return (
      <div className="md:py:6 mb-0 mt-8 w-full rounded-xl bg-white px-3 py-4 md:px-8">
        <div className="b-2 flex justify-between border-blue">
          <div>
            <div
              className="text-lg uppercase text-charcoal"
              dangerouslySetInnerHTML={{ __html: eyebrow }}
            />
            <div
              className="text-2xl"
              dangerouslySetInnerHTML={{ __html: productTitle }}
            />
          </div>

          <h5 className="font-bold">
            {formatCurrency(productPrice.currency, productPrice.amount)}
          </h5>
        </div>
        <div className="mt-8 flex-row justify-between border-t-2 md:flex">
          <div className="mb-0 mt-8 items-center justify-center border-b pb-6 md:border-none">
            <div className="flex">
              <ShippingTruck className="size-6" />
              <p className="ml-2">
                <strong>Estimated delivery:</strong> <span>{deliveryDate}</span>
              </p>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <CircleBiosensor className="size-6" color="black" />
              <p
                className="font-matter-regular ml-2 font-normal text-base text-gray-500"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="mt-8 flex justify-between">
              <p>{subtotalLabel}</p>
              <p>
                <strong>{formatCurrency(cart.currency, cart.subtotal)}</strong>
              </p>
            </div>
            {cart.totalDiscount != null && (
              <div className="mt-6 flex justify-between">
                <p>{discountLabel}</p>
                <p className="text-charcoal/50">
                  {formatCurrency(cart.currency, cart.totalDiscount)}
                </p>
              </div>
            )}
            <div className="mt-6 flex justify-between">
              <p>{taxLabel}</p>
              <p className="text-charcoal/50">
                {cart.totalTaxAmount != null
                  ? formatCurrency(cart.currency, cart.totalTaxAmount)
                  : "Calculated based on shipping"}
              </p>
            </div>
            {totalDiscount != 0 && (
              <div className="mt-6 flex justify-between">
                <p>{savingsLabel}</p>
                <p className="text-charcoal/50">
                  {formatCurrency(cart.currency, totalDiscount)}
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-between border-b pb-4 md:pb-6">
              <p>{shippingLabel}</p>
              <p className="text-charcoal/50">Free</p>
            </div>

            <div className="mt-6 flex justify-between pt-2 text-2xl md:pt-6">
              <p>{estimatedTotalLabel}</p>
              <h5 className="font-bold">
                {formatCurrency(cart.currency, cart.totalPrice)}
              </h5>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    if (!(error instanceof ActionException)) {
      logger.error(error, "Failed to load order summary");
    }
    throw error;
  }
}
