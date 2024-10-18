"use client";

import type {
  ProductCardContent,
  ProductCarouselContent,
  ProductFeaturesContent,
  SampleProductFormContent,
} from "@ecommerce/cms";

import ProductCarousel from "./ProductCarousel";
import ProductForm from "./ProductForm";

export default function Products({
  productContent,
  productFeaturesContent,
  productCarouselContent,
  productFormContent,
}: {
  productContent: ProductCardContent[];
  productFeaturesContent: ProductFeaturesContent;
  productCarouselContent: ProductCarouselContent;
  productFormContent: SampleProductFormContent;
}) {
  return (
    <div className="col-span-full grid grid-cols-subgrid">
      <div className="col-span-full grid grid-cols-subgrid lg:col-span-7">
        <h1 className="h3 col-span-full my-8 font-medium tracking-tight lg:hidden">
          {productFormContent.title}
        </h1>
        <ProductCarousel content={productCarouselContent} />
      </div>
      <div className="col-span-full grid grid-cols-subgrid lg:col-span-5">
        <ProductForm
          productFeatures={productFeaturesContent}
          products={productContent}
          productForm={productFormContent}
        />
      </div>
    </div>
  );
}
