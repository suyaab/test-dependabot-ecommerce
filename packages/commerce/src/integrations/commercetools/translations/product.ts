import {
  Attribute,
  AttributePlainEnumValue,
  Product as CTProduct,
} from "@commercetools/platform-sdk";
import { PartialDeep } from "type-fest";

import {
  OrderOrigin,
  Product,
  ProductAttributes,
  ProductType,
  productTypeSchema,
  SubscriptionProductAttribute,
  type ProductPrice,
} from "../../../Products";

function translateProductPrice(product: CTProduct): ProductPrice {
  const prices = product?.masterData?.current?.masterVariant?.prices;
  if (prices?.[0]?.value == null) {
    throw new Error(`Product ${product.id} does not have a price`);
  }

  const price = prices[0]?.value;

  return {
    amount: price.centAmount,
    currency: price.currencyCode,
  };
}

export function translateCTAttributes(
  productType: ProductType,
  attributes: Attribute[] = [],
) {
  if (productType == "standalone") {
    return attributes.reduce((acc, attribute) => {
      switch (attribute.name) {
        case "order-origin": {
          const value = attribute.value as AttributePlainEnumValue;
          acc.orderOrigin = value.key as OrderOrigin;
          break;
        }
        case "returnable-days": {
          acc.returnableDays = attribute.value as number;
          break;
        }
      }
      return acc;
    }, {} as ProductAttributes);
  }

  // subscription products
  return attributes.reduce((acc, attribute) => {
    switch (attribute.name) {
      case "order-origin": {
        const value = attribute.value as AttributePlainEnumValue;
        acc.orderOrigin = value.key as OrderOrigin;
        break;
      }
      case "returnable-days": {
        acc.returnableDays = attribute.value as number;
        break;
      }
      case "prepaid-shipments": {
        acc.prepaidShipments = attribute.value as number;
        break;
      }
      case "shipment-frequency": {
        acc.shipmentFrequency = attribute.value as number;
        break;
      }
      case "auto-renew": {
        acc.autoRenew = attribute.value as boolean;
        break;
      }
    }
    return acc;
  }, {} as SubscriptionProductAttribute);
}

export function translateProduct(product: CTProduct): PartialDeep<Product> {
  if (product.productType.obj?.key == null) {
    throw new Error(
      "Unable to translate Product `product.type` - Please ensure the CommerceTools SDK client is using reference expansion: `productType.name`",
    );
  }

  const productType = productTypeSchema.parse(product.productType.obj?.key);
  const attributes = product.masterData.current.masterVariant.attributes ?? [];

  const productAttributes = translateCTAttributes(productType, attributes);
  const productPrice = translateProductPrice(product);

  return {
    id: product.id,
    version: product.version,
    type: productType,
    sku: product.masterData.current.masterVariant.sku!,
    slug: product.masterData.current.slug.en,
    attributes: productAttributes,
    createdAt: new Date(product.createdAt),
    lastModifiedAt: new Date(product.lastModifiedAt),
    price: productPrice,
  };
}
