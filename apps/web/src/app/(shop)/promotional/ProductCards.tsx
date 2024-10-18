"use client";

import ProductCard from "./ProductCard";
import type { CheckoutProductCard } from "./ProductForm";

export default function ProductCards({
  products,
  onSelect,
}: {
  products: CheckoutProductCard[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="col-span-full grid grid-cols-subgrid gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.sku}
          product={product}
          handleSelect={onSelect}
        />
      ))}
    </div>
  );
}
