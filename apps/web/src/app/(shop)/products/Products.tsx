"use client";

import type {
  ProductCardContent,
  ProductCarouselContent,
  ProductDecideDialogContent,
  ProductFeaturesContent,
  ProductFormContent,
} from "@ecommerce/cms";
import { Product } from "@ecommerce/commerce";

import ProductCarousel from "./ProductCarousel";
import ProductForm from "./ProductForm";

export default function Products({
  products,
  productContent,
  productFeaturesContent,
  productCarouselContent,
  productFormContent,
  productDecideDialogContent,
}: {
  products: Product[];
  productContent: ProductCardContent[];
  productFeaturesContent: ProductFeaturesContent;
  productCarouselContent: ProductCarouselContent;
  productFormContent: ProductFormContent;
  productDecideDialogContent: ProductDecideDialogContent;
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
          productContent={productContent}
          productForm={productFormContent}
          productDecideDialog={productDecideDialogContent}
          products={products}
        />
      </div>
    </div>
  );
}
