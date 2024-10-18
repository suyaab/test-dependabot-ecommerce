"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { LocationAttributes } from "@ecommerce/analytics";
import {
  ProductCardContent,
  ProductDecideDialogContent,
  ProductFeaturesContent,
  SampleProductFormContent,
} from "@ecommerce/cms";

import Hyperlink from "~/components/Hyperlink";
import ShippingTruck from "~/icons/ShippingTruck";
import ProductCards from "./ProductCards";
import ProductFeatures from "./ProductFeatures";

export interface CheckoutProductCard extends ProductCardContent {
  selected: boolean;
}

interface ProductFormProps {
  productForm: SampleProductFormContent;
  productFeatures: ProductFeaturesContent;
  products: ProductCardContent[];
  productDecideDialog?: ProductDecideDialogContent;
}

function initializeProductCardItems(
  products: ProductCardContent[],
  preselectedSku: string | null,
): CheckoutProductCard[] {
  return products.map((product, index) => ({
    ...product,
    selected:
      preselectedSku != null ? preselectedSku === product.sku : index === 0,
  }));
}

function initializeSelectedProductCard(products: ProductCardContent[]): string {
  return products?.[0]?.sku ?? "";
}

export default function ProductForm(props: ProductFormProps) {
  const {
    productForm: { orderButtonLabel, title, shippingInfo },
    productFeatures,
    products,
  } = props;

  const searchParams = useSearchParams();
  const presetSku = searchParams.get("sku");
  const presetDiscountCode = searchParams.get("promo");

  const [productCardItems, setProductCardItems] = useState<
    CheckoutProductCard[]
  >(initializeProductCardItems(products, presetSku));

  const [selectedProductSku, setSelectedProductName] = useState<string>(
    presetSku ?? initializeSelectedProductCard(products),
  );

  const handleSelect = (sku: string) => {
    const newCards = productCardItems.map((card) => {
      if (card.sku === sku) {
        setSelectedProductName(card.sku);
        return { ...card, selected: true };
      } else {
        return { ...card, selected: false };
      }
    });
    setProductCardItems(newCards);
  };

  const promoQueryParam =
    presetDiscountCode != null ? `?promo=${presetDiscountCode}` : "";

  return (
    <>
      <h1 className="h3 col-span-full mb-4 mt-12 hidden font-medium tracking-tight lg:mt-0 lg:block">
        {title}
      </h1>

      <ProductFeatures
        title={productFeatures.title}
        features={productFeatures.items}
      />

      <ProductCards products={productCardItems} onSelect={handleSelect} />

      <hr className="col-span-full my-10 h-0 border-t-[1px] border-solid border-charcoal/40 lg:my-6" />

      <div className="col-span-full">
        <div className="mb-6">
          <Hyperlink
            className="w-full text-base"
            url={`/promotional/${selectedProductSku}${promoQueryParam}`}
            variant="dark"
            analyticsActionAttribute="Order sample"
            analyticsLocationAttribute={LocationAttributes.PROMOTIONAL_PRODUCTS}
            text={orderButtonLabel}
          />

          <div className="my-5 flex justify-center gap-x-2 text-xs">
            <span className="flex items-center gap-x-1">
              <ShippingTruck className="size-4" />
              {shippingInfo}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
