"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { LocationAttributes } from "@ecommerce/analytics";
import { ProductCardContent } from "@ecommerce/cms";
import type { Customer, Product } from "@ecommerce/commerce";

import Button from "~/components/Button";
import ProductCard from "~/app/(shop)/products/ProductCard"; //TODO: Make ProductCard shared when restructure all components after release
import { CheckoutProductCard } from "~/app/(shop)/products/ProductForm";
import { addToAccountCart } from "~/app/actions/account/addToAccountCart";

export default function UpdateSubscriptionProducts({
  products,
  productContent,
  customer,
}: {
  products: Product[];
  productContent: ProductCardContent[];
  customer: Customer;
}) {
  const router = useRouter();

  if (products?.length <= 0 || products?.[0] == null) {
    throw new Error("Unable to find any reactivation products ");
  }

  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    sku: string;
  }>({
    id: products[0].id,
    sku: products[0].sku,
  });

  const onContinueClicked = async () => {
    await addToAccountCart(selectedProduct.sku, customer);

    router.push(
      `/account/subscription/update/confirm?productId=${selectedProduct.id}`,
    );
  };
  const handleSelect = (id: string, sku: string) => {
    setSelectedProduct({ id, sku });
  };
  // combine commerce product and product content to show all data on a card
  // TODO: is there a better way to do this? can the CMS maybe do this?
  // should `productContent` be an intersection with Product?
  const noAutoRenewProducts = products.filter(
    (product) =>
      product.type === "subscription" && !product.attributes.autoRenew,
  );
  const displayStandaloneProducts = noAutoRenewProducts.map((product) => ({
    ...product,
    ...productContent.find((p) => p.sku === product.sku),
    selected: product.id === selectedProduct.id,
  }));

  const autoRenewProducts = products.filter(
    (product) =>
      product.type === "subscription" && product.attributes.autoRenew,
  );
  const displaySubscriptionProducts = autoRenewProducts.map((product) => ({
    ...product,
    ...productContent.find((p) => p.sku === product.sku),
    selected: product.id === selectedProduct.id,
  }));

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div>
          <h3 className="headline">One-time purchase plans</h3>

          <div className="my-8 grid w-full grid-cols-1 gap-8 md:grid-cols-2">
            {displayStandaloneProducts.map((product) => {
              return (
                <div key={product.sku} className="[&>div]:h-full">
                  <ProductCard
                    product={product as CheckoutProductCard}
                    handleSelect={() => handleSelect(product.id, product.sku)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="headline mt-4">Subscription plans</h3>

          <div className="my-8 grid w-full grid-cols-1 gap-8 md:grid-cols-2">
            {displaySubscriptionProducts.map((product) => {
              return (
                <div key={product.sku} className="[&>div]:h-full">
                  {/*TODO: Should we show user this is 'current' plan if `subscription.subscription === product.id` */}
                  <ProductCard
                    product={product as CheckoutProductCard}
                    handleSelect={() => handleSelect(product.id, product.sku)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <Button
          className="mt-6"
          variant="outline"
          onClick={() => void onContinueClicked()}
          analyticsLocationAttribute={LocationAttributes.ACCOUNT_DETAILS}
          analyticsActionAttribute="Select plan"
          text="Select plan"
        />
      </div>
    </>
  );
}
