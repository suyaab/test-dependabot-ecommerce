import Image from "next/image";

import { ProductCardContent } from "@ecommerce/cms";
import { formatCurrency } from "@ecommerce/utils";

export default function CheckoutProductCartItem({
  product,
}: {
  product: ProductCardContent;
}) {
  return (
    <div className="flex w-full justify-start">
      <Image
        className="relative mr-4 size-18 grow lg:mr-12 lg:size-40"
        width={product.image.width}
        height={product.image.height}
        src={product.image.url}
        alt={product.title}
      />
      <div className="flex h-fit w-full justify-between">
        <div className="[&>p]:text-charcoal/50">
          <h5 className="mb-1.5 font-semibold text-lg text-charcoal">
            {product.title}
          </h5>
          <p className="mb-1.5 text-xs">
            {product.cgms.total.count} Lingo biosensor
            {product.cgms.total.count > 1 && "s"}
            <br />
            {product.cgms.shipment != null &&
              ` (${product.cgms.shipment?.count} ${product.cgms.shipment?.message})`}
          </p>
        </div>
        {product.priceDetails != null && (
          <div className="my-auto ml-4">
            <strong>
              {formatCurrency(
                product.priceDetails.price.currency,
                product.priceDetails.price.amount,
              )}
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}
