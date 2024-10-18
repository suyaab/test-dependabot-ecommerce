import { headers } from "next/headers";
import Image from "next/image";

import { ServiceLocator } from "@ecommerce/cms";
import { getLogger } from "@ecommerce/logger";

import ActionException from "~/app/actions/ActionException";

export default async function OrderSummary({ sku }: { sku: string }) {
  const logger = getLogger({
    prefix: "web:promotional:OrderSummary",
    headers: headers(),
  });

  try {
    const cms = ServiceLocator.getCMS();

    const [product] = await cms.getPromotionalProductCardsContent([sku]);

    if (product == null) {
      throw new ActionException(`Product with sku ${sku} not found`);
    }

    return (
      <div className="py-6 lg:py-36 lg:pl-6 lg:pr-24">
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
