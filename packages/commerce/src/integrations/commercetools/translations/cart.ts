import {
  Address as CTAddress,
  Cart as CTCart,
  DiscountCode as CTDiscountCode,
  DiscountCodeInfo as CTDiscountCodeInfo,
  LineItem as CTLineItem,
  Locale as CTLocale,
  CustomObject,
  PaymentReference,
} from "@commercetools/platform-sdk";
import { PartialDeep } from "type-fest";

import { Address, AddressCountryCode, Currency } from "@ecommerce/utils";

import {
  Cart,
  CartLineItem,
  cartLineItemSchema,
  DiscountCode,
  DiscountCodeInfo,
} from "../../../Cart";
import { productTypeSchema } from "../../../Products";
import translateCTAddress from "./address";

function translateCTCartPayments(
  ctPayments: PaymentReference[] | undefined,
): Cart["payments"] | undefined {
  if (ctPayments != null && ctPayments?.length > 0) {
    return ctPayments.map((ctPayment) => {
      return ctPayment.id;
    });
  }
  return undefined;
}

export function translateCTCartLineItems(
  ctLineItems: CTLineItem[],
  locale: CTLocale = "en",
): CartLineItem[] {
  if (ctLineItems?.length < 1) {
    return [];
  }

  return ctLineItems?.map((ctLineItem) => {
    if (ctLineItem.productType.obj?.key == null) {
      throw new Error(
        "Unable to translate Cart Line Item `product.type` - Please ensure the CommerceTools SDK client is using reference expansion: `lineItems[*].productType`",
      );
    }

    return cartLineItemSchema.parse({
      id: ctLineItem.id,
      product: {
        id: ctLineItem.productId,
        sku: ctLineItem.variant.sku,
        type: productTypeSchema.parse(ctLineItem.productType.obj?.key),
      },
      name: ctLineItem.name[locale],
      quantity: ctLineItem.quantity,
      price: ctLineItem.price.value.centAmount,
      totalNet:
        ctLineItem.discountedPricePerQuantity[0]?.discountedPrice?.value
          ?.centAmount ?? 0,
      totalDiscount:
        ctLineItem.discountedPricePerQuantity[0]?.discountedPrice
          ?.includedDiscounts[0]?.discountedAmount?.centAmount ?? 0,
      taxRate: ctLineItem.taxRate?.amount,
      totalGross: ctLineItem?.taxedPrice?.totalGross?.centAmount,
    });
  });
}

export function translateAddress(address: Address): CTAddress {
  return {
    firstName: address.firstName,
    lastName: address.lastName,
    streetName: address.addressLine1,
    additionalStreetInfo: address.addressLine2,
    postalCode: address.postalCode,
    city: address.city,
    state: address.state,
    country: address.countryCode,
  };
}

export type ContactInfoCustomObject = Omit<CustomObject, "value"> & {
  value: {
    firstName: string;
    lastName: string;
    phone: string;
    marketingConsent: boolean;
  };
};

function getTotalPrice(ctCart: CTCart) {
  // if tax has been calculated
  if (ctCart.taxedPrice?.totalGross != null) {
    return ctCart.taxedPrice.totalGross.centAmount;
  }

  // if tax does not exist on cart yet
  return ctCart.totalPrice.centAmount;
}

export function translateCTCart(
  ctCart: CTCart,
  contactInfoObject?: ContactInfoCustomObject,
): PartialDeep<Cart> {
  let contactInfo;

  if (contactInfoObject && ctCart.customerEmail != null) {
    contactInfo = {
      firstName: contactInfoObject.value.firstName,
      lastName: contactInfoObject.value.lastName,
      email: ctCart.customerEmail,
      phone: contactInfoObject.value.phone,
      marketingConsent: contactInfoObject.value.marketingConsent,
    };
  }

  return {
    id: ctCart.id,
    version: ctCart.version,
    isActive: ctCart.cartState === "Active",
    currency: ctCart.totalPrice.currencyCode as Currency,
    countryCode: ctCart?.country as AddressCountryCode,
    subtotal: ctCart.totalPrice.centAmount,
    totalPrice: getTotalPrice(ctCart),
    totalTaxAmount: ctCart.taxedPrice?.totalTax?.centAmount,
    totalGross: ctCart.taxedPrice?.totalGross?.centAmount,
    lineItems: translateCTCartLineItems(ctCart.lineItems),
    contactInfo,
    billingAddress: ctCart.billingAddress
      ? translateCTAddress(ctCart.billingAddress)
      : undefined,
    shippingAddress: ctCart.shippingAddress
      ? translateCTAddress(ctCart.shippingAddress)
      : undefined,
    payments: translateCTCartPayments(ctCart.paymentInfo?.payments),
    discountCodes: ctCart.discountCodes.map((dc) =>
      translateCTCartDiscountCodeInfo(dc),
    ),
  };
}

export function translateCTCartDiscountCodeInfo(
  discountCodeInfo: CTDiscountCodeInfo,
): DiscountCodeInfo {
  return {
    discountCode: {
      id: discountCodeInfo.discountCode.id,
      version: discountCodeInfo.discountCode.obj?.version,
      code: discountCodeInfo.discountCode.obj?.code,
    },
    state: discountCodeInfo.state as DiscountCodeInfo["state"],
  };
}

export function translateCTDiscountCode(
  discountCodeData: CTDiscountCode,
): DiscountCode {
  return {
    id: discountCodeData.id,
    version: discountCodeData.version,
    code: discountCodeData.code,
    isActive: discountCodeData.isActive,
  };
}
