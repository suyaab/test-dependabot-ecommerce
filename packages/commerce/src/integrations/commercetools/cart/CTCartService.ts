import {
  CartSetShippingAddressAction,
  CartSetShippingMethodAction,
} from "@commercetools/platform-sdk";
import { HttpErrorType } from "@commercetools/sdk-client-v2";

import { ServiceLocator as SLFinance, TaxService } from "@ecommerce/finance";
import { Address } from "@ecommerce/utils";

import {
  Cart,
  CartDraft,
  cartSchema,
  CartService,
  ContactInfo,
  DiscountCode,
  DiscountCodeInfo,
  discountCodeSchema,
} from "../../../Cart";
import CommercetoolsSdk from "../CommercetoolsSdk";
import {
  translateAddress,
  translateCTCart,
  translateCTDiscountCode,
} from "../translations/cart";

export default class CTCartService implements CartService {
  private taxService: TaxService;

  constructor() {
    this.taxService = SLFinance.getTaxService();
  }

  public async createCart(cartDraft: CartDraft): Promise<Cart> {
    const resp = await CommercetoolsSdk.getClient()
      .carts()
      .post({
        body: {
          taxMode: "External",
          currency: cartDraft.currency,
          country: cartDraft.countryCode,
          customerEmail: cartDraft?.customerEmail,
          lineItems: cartDraft.lineItems,
          customerId: cartDraft.customerId,
          taxRoundingMode: "HalfUp",
          shippingAddress:
            cartDraft.shippingAddress != null
              ? translateAddress(cartDraft.shippingAddress)
              : undefined,
          billingAddress:
            cartDraft.billingAddress != null
              ? translateAddress(cartDraft.billingAddress)
              : undefined,
          shippingMethod:
            cartDraft.shippingAddress != null
              ? {
                  key: "ups-shipping-method",
                  typeId: "shipping-method",
                }
              : undefined,
        },
        queryArgs: {
          expand: "lineItems[*].productType",
        },
      })
      .execute();

    let updatedCart = cartSchema.parse(translateCTCart(resp.body));

    if (cartDraft.shippingAddress != null) {
      updatedCart = await this.updateCartTaxRate(updatedCart);
    }

    return updatedCart;
  }

  public async getCart(cartId: string): Promise<Cart | undefined> {
    const customObjResponse = await CommercetoolsSdk.getClient()
      .customObjects()
      .withContainerAndKey({
        container: "cart-contact-info",
        key: cartId,
      })
      .get({
        queryArgs: {
          expand: "lineItems[*].productType",
        },
      })
      .execute()
      .catch((error: HttpErrorType) => {
        if (error.statusCode !== 404) {
          // We want to rethrow whatever error CT threw if it's not a 404
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw error;
        }
      });

    const cartResponse = await CommercetoolsSdk.getClient()
      .carts()
      .withId({ ID: cartId })
      .get({
        queryArgs: {
          expand: "lineItems[*].productType",
        },
      })
      .execute()
      .catch((error: HttpErrorType) => {
        if (error.statusCode !== 404) {
          // We want to rethrow whatever error CT threw if it's not a 404
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw error;
        }
      });

    if (cartResponse?.body == null) {
      return undefined;
    }

    const translatedCart = translateCTCart(
      cartResponse.body,
      customObjResponse?.body,
    );

    return cartSchema.parse(translatedCart);
  }

  public async updateCartCustomerId(
    cartId: string,
    cartVersion: number,
    customerId: string,
  ): Promise<Cart> {
    const cartResponse = await CommercetoolsSdk.getClient()
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: cartVersion,
          actions: [{ action: "setCustomerId", customerId: customerId }],
        },
        queryArgs: {
          expand: "lineItems[*].productType",
        },
      })
      .execute();

    return cartSchema.parse(translateCTCart(cartResponse.body));
  }

  public async updateCartContactInfo(
    cartId: string,
    cartVersion: number,
    contactInfo: ContactInfo,
  ): Promise<Cart> {
    const customObjResponse = await CommercetoolsSdk.getClient()
      .customObjects()
      .post({
        body: {
          container: "cart-contact-info",
          key: cartId,
          value: {
            firstName: contactInfo.firstName,
            lastName: contactInfo.lastName,
            phone: contactInfo.phone,
            marketingConsent: contactInfo.marketingConsent,
          },
        },
        queryArgs: {
          expand: "lineItems[*].productType",
        },
      })
      .execute();

    const cartResponse = await CommercetoolsSdk.getClient()
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: cartVersion,
          actions: [{ action: "setCustomerEmail", email: contactInfo.email }],
        },
        queryArgs: {
          expand: "lineItems[*].productType",
        },
      })
      .execute();

    return cartSchema.parse(
      translateCTCart(cartResponse.body, customObjResponse.body),
    );
  }

  public async updateCartShippingAddress(
    cartId: string,
    cartVersion: number,
    shippingAddress: Address,
    setShippingMethod = true,
  ): Promise<Cart> {
    const actions = setShippingMethod
      ? [
          {
            action: "setShippingAddress",
            address: translateAddress(shippingAddress),
          } as CartSetShippingAddressAction,
          {
            action: "setShippingMethod",
            shippingMethod: {
              key: "ups-shipping-method",
              typeId: "shipping-method",
            },
          } as CartSetShippingMethodAction,
        ]
      : [
          {
            action: "setShippingAddress",
            address: translateAddress(shippingAddress),
          } as CartSetShippingAddressAction,
        ];

    const { body: updatedCtCart } = await CommercetoolsSdk.getClient()
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: cartVersion,
          actions: actions,
        },
        queryArgs: {
          expand: "lineItems[*].productType",
        },
      })
      .execute();

    const parsedCart = cartSchema.parse(translateCTCart(updatedCtCart));

    if (parsedCart.totalGross !== 0) {
      return await this.updateCartTaxRate(parsedCart);
    }
    return parsedCart;
  }

  public async updateCartBillingAddress(
    cartId: string,
    cartVersion: number,
    billingAddress: Address,
  ): Promise<Cart> {
    const { body: updatedCtCart } = await CommercetoolsSdk.getClient()
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
              action: "setBillingAddress",
              address: {
                firstName: billingAddress.firstName,
                lastName: billingAddress.lastName,
                streetName: billingAddress.addressLine1,
                additionalStreetInfo: billingAddress.addressLine2,
                city: billingAddress.city,
                postalCode: billingAddress.postalCode,
                state: billingAddress.state,
                country: billingAddress.countryCode,
              },
            },
          ],
        },
        queryArgs: {
          expand: "lineItems[*].productType",
        },
      })
      .execute();

    return cartSchema.parse(translateCTCart(updatedCtCart));
  }
  public async updateCartPaymentInfo(
    cartId: string,
    cartVersion: number,
    paymentId: string,
  ): Promise<Cart> {
    const cartResponse = await CommercetoolsSdk.getClient()
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
              action: "addPayment",
              payment: {
                id: paymentId,
                typeId: "payment",
              },
            },
          ],
        },
        queryArgs: {
          expand: "lineItems[*].productType",
        },
      })
      .execute();

    return cartSchema.parse(translateCTCart(cartResponse.body));
  }

  public async getDiscountCodeByName(
    code: string,
  ): Promise<DiscountCode | undefined> {
    const response = await CommercetoolsSdk.getClient()
      .discountCodes()
      .get({
        queryArgs: {
          where: `code="${code}"`,
        },
      })
      .execute();

    const discountCodeData = response.body.results[0];
    // TODO: use case for logger warn if multiple discounts with same name returned

    if (discountCodeData == null) {
      return;
    }

    return discountCodeSchema.parse(translateCTDiscountCode(discountCodeData));
  }

  public async addDiscountCodeToCart(
    cartId: string,
    cartVersion: number,
    code: string,
  ): Promise<[DiscountCodeInfo["state"], Cart]> {
    const { body: updatedCtCart } = await CommercetoolsSdk.getClient()
      .carts()
      .withId({ ID: cartId })
      .post({
        queryArgs: {
          expand: ["discountCodes[*].discountCode", "lineItems[*].productType"],
        },
        body: {
          version: cartVersion,
          actions: [
            {
              action: "addDiscountCode",
              code: code,
            },
          ],
        },
      })
      .execute();

    let finalCart = cartSchema.parse(translateCTCart(updatedCtCart));

    const state = finalCart.discountCodes.find(
      (dc) => dc.discountCode.code === code,
    )!.state;

    // Multiple codes shouldn't happen since the UI requires removing a discount before
    // adding one but someone can maliciously send multiple requests to add discount codes
    // Remove all discount codes except the one that was just added and ones that don't match cart
    for (const dc of finalCart.discountCodes) {
      if (dc.discountCode.code !== code || dc.state !== "MatchesCart") {
        finalCart = await this.removeDiscountCodeFromCart(
          finalCart.id,
          finalCart.version,
          dc.discountCode.id,
        );
      }
    }

    if (finalCart.discountCodes.length > 1) {
      throw new Error("Multiple discount codes are added to the cart.");
    }

    return [state, finalCart];
  }

  public async removeDiscountCodeFromCart(
    cartId: string,
    cartVersion: number,
    discountCodeId: string,
  ): Promise<Cart> {
    const { body: updatedCtCart } = await CommercetoolsSdk.getClient()
      .carts()
      .withId({ ID: cartId })
      .post({
        queryArgs: {
          expand: "lineItems[*].productType",
        },
        body: {
          version: cartVersion,
          actions: [
            {
              action: "removeDiscountCode",
              discountCode: {
                typeId: "discount-code",
                id: discountCodeId,
              },
            },
          ],
        },
      })
      .execute();

    return cartSchema.parse(translateCTCart(updatedCtCart));
  }

  private async updateCartTaxRate(cart: Cart): Promise<Cart> {
    if (cart.shippingAddress == null) {
      throw new Error(
        "Unable to update cart tax! Cart does not have a shipping address.",
      );
    }

    const lineItem = cart.lineItems[0];
    if (lineItem == null) {
      throw new Error(
        "Cart does not have any line items! Unable to fetch the tax data without a line item.",
      );
    }

    // TODO: Let's not get the tax data if the totalPrice is $0
    const taxData = await this.taxService.getTaxAmount(
      cart.shippingAddress,
      cart.totalPrice,
      lineItem.product.sku,
    );

    if (taxData == null) {
      throw new Error(
        "Tax data could not be retrieved to update the cart item tax rate.",
      );
    }

    const { body: updatedCtCart } = await CommercetoolsSdk.getClient()
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          version: cart.version,
          actions: [
            {
              action: "setLineItemTaxRate",
              lineItemId: lineItem.id,
              externalTaxRate: {
                name: "avaTaxSDK",
                country: "US",
                subRates: taxData.subTaxRate,
              },
            },
            {
              action: "setShippingMethodTaxRate",
              externalTaxRate: {
                name: "avaTaxSDK",
                country: "US",
                subRates: taxData.subTaxRate,
              },
            },
          ],
        },
        queryArgs: {
          expand: "lineItems[*].productType",
        },
      })
      .execute();

    return cartSchema.parse(translateCTCart(updatedCtCart));
  }

  public async freezeCart(cartId: string, cartVersion: number): Promise<Cart> {
    const { body: updatedCtCart } = await CommercetoolsSdk.getClient()
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
              action: "freezeCart",
            },
          ],
        },
        queryArgs: {
          expand: "lineItems[*].productType",
        },
      })
      .execute();

    return cartSchema.parse(translateCTCart(updatedCtCart));
  }

  public async removeCustomerFromCart(
    cartId: string,
    cartVersion: number,
  ): Promise<Cart> {
    const { body: updatedCtCart } = await CommercetoolsSdk.getClient()
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: cartVersion,
          actions: [{ action: "setCustomerId" }],
        },
        queryArgs: {
          expand: "lineItems[*].productType",
        },
      })
      .execute();

    return cartSchema.parse(translateCTCart(updatedCtCart));
  }

  public async removePaymentRefFromCart(
    cartId: string,
    cartVersion: number,
    paymentReferenceId: string,
  ): Promise<Cart> {
    const { body: updatedCtCart } = await CommercetoolsSdk.getClient()
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
              action: "removePayment",
              payment: { id: paymentReferenceId, typeId: "payment" },
            },
          ],
        },
        queryArgs: {
          expand: "lineItems[*].productType",
        },
      })
      .execute();

    return cartSchema.parse(translateCTCart(updatedCtCart));
  }
}
