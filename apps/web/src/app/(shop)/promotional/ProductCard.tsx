"use client";

import { LocationAttributes } from "@ecommerce/analytics";

import Card from "~/components/Card";
import Checkmark from "~/icons/Checkmark";
import { type CheckoutProductCard } from "./ProductForm";

export default function ProductCard({
  product,
  handleSelect,
}: {
  product: CheckoutProductCard;
  handleSelect: (id: string) => void;
}) {
  const { sku, selected, title, pdpCardDetails, eyebrow } = product;

  return (
    <Card
      id={sku}
      name={title}
      selected={selected}
      handleSelect={handleSelect}
      dataAnalyticsLocation={LocationAttributes.PROMOTIONAL_PRODUCTS}
      dataAnalyticsAction={title}
    >
      <p className="mb-1 grow basis-full font-medium text-xs uppercase text-charcoal/70 lg:text-sm">
        {eyebrow}
      </p>

      <h3 className="subtitle grow basis-1/2">{title}</h3>

      <div className="my-2 grow basis-full space-y-1 border-t border-t-black/15 pt-2.5 text-sm text-charcoal/70">
        {pdpCardDetails?.map((detail) => (
          <div key={detail} className="flex items-start gap-x-1">
            <Checkmark className="mt-0.5 opacity-70" />
            <div dangerouslySetInnerHTML={{ __html: detail }} />
          </div>
        ))}
      </div>
    </Card>
  );
}
