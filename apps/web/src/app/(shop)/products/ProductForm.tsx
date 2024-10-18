"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import { LocationAttributes } from "@ecommerce/analytics";
import {
  ProductCardContent,
  ProductDecideDialogContent,
  ProductFeaturesContent,
  ProductFormCheckboxes,
  ProductFormContent,
  ProductFormSchema,
  ProductFormType,
} from "@ecommerce/cms";
import { Product } from "@ecommerce/commerce";

import Button from "~/components/Button";
import Checkbox from "~/components/forms/Checkbox";
import Icon from "~/components/Icon";
import TooltipIcon from "~/components/TooltipIcon";
import { addToCart } from "~/app/actions/checkout/addToCart";
import { deleteCheckoutSessionIdCookie } from "~/app/actions/checkout/checkoutSession";
import { useCreateQueryString } from "~/hooks/useCreateQueryString";
import ShippingTruck from "~/icons/ShippingTruck";
import ThumbsUp from "~/icons/ThumbsUp";
import ProductCards from "./ProductCards";
import ProductDecideDialog from "./ProductDecideDialog";
import ProductFeatures from "./ProductFeatures";

const FormComponents = {
  Checkbox: Checkbox<ProductFormCheckboxes>,
  Button,
};

export interface CheckoutProductCard extends ProductCardContent {
  selected: boolean;
}

interface ProductFormProps {
  productForm: ProductFormContent;
  productFeatures: ProductFeaturesContent;
  productContent: ProductCardContent[];
  productDecideDialog: ProductDecideDialogContent;
  products: Product[];
}

function initializeProductCardItems(
  productsCardContent: ProductCardContent[],
  slugParam: string | null,
  products: Product[],
): CheckoutProductCard[] {
  const productMap = new Map(products.map((product) => [product.sku, product]));

  let preselectedProduct = false;

  const updatedProductCardContent = productsCardContent.map(
    (productCardContent) => {
      const matchingProduct = productMap.get(productCardContent.sku);
      const slug = matchingProduct?.slug;
      const hasSlugMatchParam = slug === slugParam;
      if (hasSlugMatchParam) {
        preselectedProduct = true;
      }

      return {
        ...productCardContent,
        slug,
        selected: hasSlugMatchParam,
      };
    },
  );

  if (!preselectedProduct && updatedProductCardContent[0] != null) {
    updatedProductCardContent[0].selected = true;
  }

  return updatedProductCardContent;
}

function initializeSelectedProductCard(
  products: CheckoutProductCard[],
): string {
  const selectedProduct = products.find((product) => product.selected);
  return selectedProduct?.title ?? "";
}

export default function ProductForm(props: ProductFormProps) {
  const router = useRouter();
  const {
    productForm: {
      orderButtonLabel,
      title,
      footer,
      terms,
      taxInfo,
      shippingInfo,
      moneyBackInfo,
    },
    productFeatures,
    productDecideDialog,
    productContent,
    products,
  } = props;

  const pathName = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString(searchParams);
  const slugParam = searchParams.get("p");

  const [productCardItems, setProductCardItems] = useState<
    CheckoutProductCard[]
  >(initializeProductCardItems(productContent, slugParam, products));

  const [selectedProductName, setSelectedProductName] = useState<string>(
    initializeSelectedProductCard(productCardItems),
  );

  const methods = useForm<ProductFormType>({
    resolver: zodResolver(ProductFormSchema),
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const handleSelect = (sku: string) => {
    const newCards = productCardItems.map((card) => {
      if (card.sku === sku) {
        setSelectedProductName(card.title);
        if (card.slug != null) {
          router.replace(`${pathName}?${createQueryString("p", card.slug)}`, {
            scroll: false,
          });
        }
        return { ...card, selected: true };
      } else {
        return { ...card, selected: false };
      }
    });
    setProductCardItems(newCards);
  };

  const onSubmit: SubmitHandler<ProductFormType> = async () => {
    const selectedProduct = productCardItems.find((item) => item.selected);

    if (!selectedProduct) return;

    await deleteCheckoutSessionIdCookie();
    await addToCart(selectedProduct.sku);
    // Redirect here because redirecting in addToCart doesn't set cart ID cookie
    router.push("/checkout");
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        className="col-span-full grid grid-cols-subgrid"
      >
        <h1 className="h3 col-span-full mb-4 mt-12 hidden font-medium tracking-tight lg:mt-0 lg:block">
          {title}
        </h1>

        <ProductFeatures
          title={productFeatures.title}
          features={productFeatures.items}
        />

        <ProductCards products={productCardItems} onSelect={handleSelect} />

        <div className="col-span-full">
          <ProductDecideDialog {...productDecideDialog} />

          <hr className="my-10 h-0 border-t-[1px] border-solid border-charcoal/40 lg:my-6" />

          {terms.map(({ title, fields, errorMessage, tooltipContent }) => (
            <fieldset className="my-10 lg:my-6" key={title}>
              <div className="mb-10 lg:mb-6">
                <h4 className="font-semibold text-base">
                  {title}{" "}
                  {tooltipContent != null && (
                    <TooltipIcon tooltipContent={tooltipContent} />
                  )}
                </h4>
              </div>

              {fields.map(({ component, name, required, label }) => {
                const Input = FormComponents[component];
                return (
                  <div className="my-3" key={name}>
                    <Input
                      required={required}
                      name={name}
                      label={
                        <div dangerouslySetInnerHTML={{ __html: label }} />
                      }
                      displayInlineErorrs={false}
                    />
                  </div>
                );
              })}

              {hasErrors && (
                <div className="flex items-center text-xs text-red">
                  <Icon name="InvertInfoIcon" />
                  <p className="ml-1">{errorMessage}</p>
                </div>
              )}
            </fieldset>
          ))}

          <p className="mb-0 border-t border-t-charcoal/40 pb-4 pt-6 text-center text-xs">
            {taxInfo}
          </p>

          <div className="mb-6">
            <Button
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              className="w-full text-base"
              text={`${orderButtonLabel} ${selectedProductName}`}
              buttonType="submit"
              variant="dark"
              analyticsActionAttribute="buy"
              analyticsLocationAttribute={LocationAttributes.SKU_HIGHLIGHT}
            />
            <div className="my-5 flex justify-center gap-x-2 text-xs">
              <span className="flex items-center gap-x-1">
                <ShippingTruck className="size-4" />
                {shippingInfo}
              </span>
              <span className="text-lg text-charcoal/70">|</span>
              <span className="flex items-center gap-x-1">
                <ThumbsUp className="size-4" />
                {moneyBackInfo}
              </span>
            </div>
          </div>

          <footer
            className="text-xs text-charcoal/70 [&>p]:mb-4"
            dangerouslySetInnerHTML={{ __html: footer }}
          ></footer>
        </div>
      </form>
    </FormProvider>
  );
}
