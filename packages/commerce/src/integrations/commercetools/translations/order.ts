import {
  LineItem as CTLineItem,
  Locale as CTLocale,
  Order as CTOrder,
} from "@commercetools/platform-sdk";
import { PartialDeep } from "type-fest";

import { Carrier } from "@ecommerce/utils";

import {
  Order,
  OrderLineItem,
  orderLineItemSchema,
  orderNumberSchema,
  orderStatusCodeSchema,
  paymentStatusCodeSchema,
  shipmentStatusCodeSchema,
} from "../../../Order";
import { productTypeSchema } from "../../../Products";
import translateCTAddress from "./address";

export function translateCTOrderLineItems(
  ctLineItems: CTLineItem[],
  locale: CTLocale = "en",
): OrderLineItem[] {
  if (ctLineItems?.length < 1) {
    return [];
  }

  return ctLineItems?.map((ctLineItem) => {
    if (ctLineItem.productType.obj?.key == null) {
      throw new Error(
        "Unable to translate Order Line Item `product.type` - Please ensure the CommerceTools SDK client is using reference expansion: `lineItems[*].productType`",
      );
    }

    return orderLineItemSchema.parse({
      product: {
        id: ctLineItem.productId,
        sku: ctLineItem.variant.sku,
        type: productTypeSchema.parse(ctLineItem.productType.obj?.key),
      },
      name: ctLineItem.name[locale],
      quantity: ctLineItem.quantity,
      price: ctLineItem.price.value.centAmount,
      totalNet: ctLineItem.taxedPrice?.totalNet.centAmount,
      totalDiscount:
        ctLineItem.discountedPricePerQuantity[0]?.discountedPrice
          ?.includedDiscounts[0]?.discountedAmount?.centAmount ?? 0,
      taxRate: ctLineItem.taxRate?.amount,
      taxAmount: ctLineItem.taxedPrice?.totalTax?.centAmount,
      totalGross: ctLineItem.taxedPrice?.totalGross?.centAmount,
    });
  });
}

export default function translateCTOrder(ctOrder: CTOrder): PartialDeep<Order> {
  return {
    id: ctOrder.id,
    version: ctOrder.version,
    orderNumber: orderNumberSchema.parse(ctOrder.orderNumber),
    customerEmail: ctOrder.customerEmail,
    customerId: ctOrder.customerId,
    createdAt: ctOrder.createdAt,
    status: orderStatusCodeSchema.parse(ctOrder.orderState),
    paymentStatus: paymentStatusCodeSchema
      .optional()
      .parse(ctOrder.paymentState),
    shipmentStatus: shipmentStatusCodeSchema
      .optional()
      .parse(ctOrder.shipmentState),
    lineItems: translateCTOrderLineItems(ctOrder.lineItems),
    billingAddress:
      ctOrder.billingAddress != null
        ? translateCTAddress(ctOrder.billingAddress)
        : undefined,
    shippingAddress:
      ctOrder.shippingAddress != null
        ? translateCTAddress(ctOrder.shippingAddress)
        : undefined,
    shippingMethod: ctOrder.shippingInfo?.shippingMethodName as Carrier,
    totalPrice: ctOrder.totalPrice.centAmount,
    totalNet: ctOrder.taxedPrice?.totalNet.centAmount,
    totalGross: ctOrder.taxedPrice?.totalGross?.centAmount,
    totalTax: ctOrder.taxedPrice?.totalTax?.centAmount ?? 0,
    currencyCode: ctOrder.totalPrice.currencyCode,
    caseId: ctOrder.shippingAddress?.company,
    discountCodeId: ctOrder.discountCodes?.[0]?.discountCode?.id,
  };
}
