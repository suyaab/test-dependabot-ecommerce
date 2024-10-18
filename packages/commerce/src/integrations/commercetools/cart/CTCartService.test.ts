import { ServiceLocator as SLFinance, TaxService } from "@ecommerce/finance";

import CommercetoolsSdk, { CommercetoolsSdkClient } from "../CommercetoolsSdk";
import CTCartService from "./CTCartService";
import {
  cartWithDiscountCodes,
  cartWithInvalidDiscountCodes,
} from "./stubs/cartWithDiscountCodes";
import createCartResponse from "./stubs/createCartResponse";
import createFullCartResponse from "./stubs/createFullCartResponse";
import ctCartWithTaxData from "./stubs/ctCartWithTaxData";
import getCartResponse from "./stubs/getCartResponse";
import getCustomObjectResponse from "./stubs/getCustomObjectResponse";
import getFullCart from "./stubs/getFullCart";
import updateCartContactResponse from "./stubs/updateCartContactResponse";
import updateCartPaymentInfoResponse from "./stubs/updateCartPaymentInfoResponse";
import updateCartShippingResponse from "./stubs/updateCartShippingResponse";

vi.mock("../CommercetoolsSdk");

const mockTaxService = {
  getTaxAmount: vi.fn().mockResolvedValue({
    currency: "USD",
    subTaxRate: [{ amount: 100, name: "test" }],
  }),
} as unknown as TaxService;
SLFinance.setTaxService(mockTaxService);

describe("CartService", () => {
  const cartService = new CTCartService();

  const mockCommercetoolsSdk = vi.mocked(CommercetoolsSdk);

  it("successfully create a basic, checkout cart", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      carts: vi.fn().mockReturnThis(),
      post: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce({
        statusCode: 201,
        body: createCartResponse,
      }),
    } as unknown as CommercetoolsSdkClient);

    const { id: cartId } = await cartService.createCart({
      countryCode: "US",
      lineItems: [{ sku: "FAKE_SKU", quantity: 1 }],
      currency: "USD",
    });

    expect(cartId).toBe("fake-create-cart-id");
  });

  it("successfully create a full cart", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      customObjects: vi.fn().mockReturnThis(),
      withContainerAndKey: vi.fn().mockReturnThis(),
      carts: vi.fn().mockReturnThis(),
      post: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValue({
        statusCode: 201,
        body: createFullCartResponse,
      }),
    } as unknown as CommercetoolsSdkClient);

    const { id: cartId } = await cartService.createCart({
      countryCode: "US",
      lineItems: [{ sku: "FAKE_SKU", quantity: 1 }],
      currency: "USD",
      customerId: "fake-customer-id",
      shippingAddress: {
        firstName: "Jack",
        lastName: "Sparrow",
        addressLine1: "32, Queens way",
        addressLine2: "",
        city: "St Alban",
        state: "MN",
        postalCode: "12345",
        countryCode: "US",
      },
      billingAddress: {
        firstName: "Jack",
        lastName: "Sparrow",
        addressLine1: "32, Queens way",
        addressLine2: "",
        city: "St Alban",
        state: "MN",
        postalCode: "12345",
        countryCode: "US",
      },
    });

    expect(cartId).toBe("fake-create-cart-id");
  });

  it("successfully gets a partial cart using an id", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      customObjects: vi.fn().mockReturnThis(),
      withContainerAndKey: vi.fn().mockReturnThis(),
      carts: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      execute: vi
        .fn()
        .mockResolvedValueOnce({
          statusCode: 200,
          body: getCustomObjectResponse,
        })
        .mockResolvedValueOnce({
          statusCode: 200,
          body: getCartResponse,
        }),
    } as unknown as CommercetoolsSdkClient);

    const cart = await cartService.getCart("fake-create-cart-id");

    expect(cart?.id).toBe("fake-create-cart-id");
    expect(cart?.version).toBe(1);
    expect(cart?.isActive).toBe(true);
    expect(cart?.currency).toBe("USD");
    expect(cart?.totalPrice).toBe(8900);
  });

  it("successfully update cart with contact info", async () => {
    const contactInfo = {
      firstName: "Jane",
      lastName: "Doe",
      email: "fake@email.com",
      phone: "1112223333",
      marketingConsent: true,
    };

    const postSpy = vi.fn().mockReturnThis();
    mockCommercetoolsSdk.getClient.mockReturnValue({
      customObjects: vi.fn().mockReturnThis(),
      withContainerAndKey: vi.fn().mockReturnThis(),
      carts: vi.fn().mockReturnThis(),
      post: postSpy,
      withId: vi.fn().mockReturnThis(),
      execute: vi
        .fn()
        .mockResolvedValueOnce({
          statusCode: 200,
          body: {
            ...getCustomObjectResponse,
            value: { ...contactInfo, email: undefined },
          },
        })
        .mockResolvedValueOnce({
          statusCode: 200,
          body: updateCartContactResponse,
        }),
    } as unknown as CommercetoolsSdkClient);

    const cartWithContact = await cartService.updateCartContactInfo(
      "fake-cart-id",
      1,
      contactInfo,
    );

    expect(cartWithContact.id).toBe("fake-cart-id");
    expect(postSpy).toHaveBeenCalledWith({
      body: {
        container: "cart-contact-info",
        key: "fake-cart-id",
        value: {
          firstName: "Jane",
          lastName: "Doe",
          phone: "1112223333",
          marketingConsent: true,
        },
      },
      queryArgs: {
        expand: "lineItems[*].productType",
      },
    });
    expect(cartWithContact?.contactInfo?.firstName).toBe("Jane");
    expect(cartWithContact?.contactInfo?.lastName).toBe("Doe");
    expect(cartWithContact?.contactInfo?.phone).toBe("1112223333");
    expect(cartWithContact?.contactInfo?.marketingConsent).toBe(true);
  });

  it("successfully update cart with shipping address", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValueOnce({
      customObjects: vi.fn().mockReturnThis(),
      withContainerAndKey: vi.fn().mockReturnThis(),
      carts: vi.fn().mockReturnThis(),
      post: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce({
        statusCode: 201,
        body: updateCartShippingResponse,
      }),
    } as unknown as CommercetoolsSdkClient);

    mockCommercetoolsSdk.getClient.mockReturnValueOnce({
      carts: vi.fn().mockReturnThis(),
      post: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce({
        statusCode: 201,
        body: ctCartWithTaxData,
      }),
    } as unknown as CommercetoolsSdkClient);

    const cartWithShippingAddress = await cartService.updateCartShippingAddress(
      "fake-cart-id",
      1,
      {
        firstName: "Jane",
        lastName: "Doe",
        addressLine1: "9509 Alameda lane",
        city: "Ilford",
        state: "CA",
        postalCode: "25309",
        countryCode: "US",
      },
    );

    expect(cartWithShippingAddress.id).toBe("fake-cart-id");
    expect(cartWithShippingAddress.version).toBe(2);
    expect(cartWithShippingAddress.shippingAddress).toEqual({
      firstName: "Jane",
      lastName: "Doe",
      addressLine1: "9509 Alameda lane",
      city: "Ilford",
      state: "CA",
      postalCode: "25309",
      countryCode: "US",
    });
  });

  it("successfully update cart with billing address", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValueOnce({
      customObjects: vi.fn().mockReturnThis(),
      withContainerAndKey: vi.fn().mockReturnThis(),
      carts: vi.fn().mockReturnThis(),
      post: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce({
        statusCode: 201,
        body: updateCartShippingResponse,
      }),
    } as unknown as CommercetoolsSdkClient);

    mockCommercetoolsSdk.getClient.mockReturnValueOnce({
      carts: vi.fn().mockReturnThis(),
      post: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce({
        statusCode: 201,
        body: ctCartWithTaxData,
      }),
    } as unknown as CommercetoolsSdkClient);

    const cartWithBillingAddresses =
      await cartService.updateCartShippingAddress("fake-cart-id", 1, {
        firstName: "Jane",
        lastName: "Doe",
        addressLine1: "9509 Alameda lane",
        city: "Ilford",
        state: "CA",
        postalCode: "25309",
        countryCode: "US",
      });
    expect(cartWithBillingAddresses.id).toBe("fake-cart-id");
    expect(cartWithBillingAddresses.version).toBe(2);
    expect(cartWithBillingAddresses.billingAddress).toEqual({
      firstName: "Jane",
      lastName: "Doe",
      addressLine1: "9509 Alameda lane",
      city: "Ilford",
      state: "CA",
      postalCode: "25309",
      countryCode: "US",
    });
  });

  it("successfully update cart with payment info", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      customObjects: vi.fn().mockReturnThis(),
      withContainerAndKey: vi.fn().mockReturnThis(),
      carts: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      post: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce({
        statusCode: 200,
        body: updateCartPaymentInfoResponse,
      }),
    } as unknown as CommercetoolsSdkClient);

    const cartWithPaymentInfo = await cartService.updateCartPaymentInfo(
      "fake-cart-id",
      1,
      "fake-payment-id-2",
    );

    expect(cartWithPaymentInfo.id).toBe("fake-cart-id");
    expect(cartWithPaymentInfo.version).toBe(2);
    expect(cartWithPaymentInfo.payments).toHaveLength(1);
    expect(cartWithPaymentInfo.payments).toEqual(["fake-id"]);
  });

  it("successfully gets a complete cart using an id", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      customObjects: vi.fn().mockReturnThis(),
      withContainerAndKey: vi.fn().mockReturnThis(),
      carts: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      execute: vi
        .fn()
        .mockResolvedValueOnce({
          statusCode: 200,
          body: getCustomObjectResponse,
        })
        .mockResolvedValueOnce({
          statusCode: 200,
          body: getFullCart,
        }),
    } as unknown as CommercetoolsSdkClient);

    const cart = await cartService.getCart("fake-create-cart-id");
    expect(cart?.contactInfo?.email).toBe("test@test.com");
    expect(cart?.contactInfo?.phone).toBe("123456789");
    expect(cart?.contactInfo?.marketingConsent).toBe(true);
    expect(cart?.version).toBe(1);
  });

  it("cannot get if cart id does not exist", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      customObjects: vi.fn().mockReturnThis(),
      withContainerAndKey: vi.fn().mockReturnThis(),
      carts: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValue({
        statusCode: 404,
        body: null,
      }),
    } as unknown as CommercetoolsSdkClient);

    const cart = await cartService.getCart("fake-create-cart-id");
    expect(cart).toBeUndefined();
  });

  describe("getDiscountCodeByName", () => {
    it("should return the discount code when client returns results", async () => {
      const mockDiscountCode = {
        id: "discountCodeId",
        version: 1,
        isActive: true,
        code: "discountCode",
      };

      const mockClient = {
        discountCodes: vi.fn().mockReturnThis(),
        get: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValueOnce({
          statusCode: 200,
          body: { results: [mockDiscountCode] },
        }),
      };
      mockCommercetoolsSdk.getClient.mockReturnValue(
        mockClient as unknown as CommercetoolsSdkClient,
      );

      const result = await cartService.getDiscountCodeByName("discountCode");

      expect(mockClient.get).toHaveBeenCalledWith({
        queryArgs: { where: `code="${mockDiscountCode.code}"` },
      });
      expect(result).toEqual(mockDiscountCode);
    });

    it("should return undefined when the discount code does not exist", async () => {
      const mockDiscountCode = "nonexistentDiscountCode";

      const mockClient = {
        discountCodes: vi.fn().mockReturnThis(),
        get: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValueOnce({
          statusCode: 200,
          body: { results: [] },
        }),
      };
      mockCommercetoolsSdk.getClient.mockReturnValue(
        mockClient as unknown as CommercetoolsSdkClient,
      );

      const result = await cartService.getDiscountCodeByName(mockDiscountCode);
      expect(mockClient.get).toHaveBeenCalledWith({
        queryArgs: { where: `code="${mockDiscountCode}"` },
      });
      expect(result).toBeUndefined();
    });
  });

  describe("addDiscountCodeToCart", () => {
    it("should add the discount code to the cart and return 'MatchesCart' state", async () => {
      const mockCartId = "cartId";
      const mockDiscountCodeId = "fake-discount-code";

      const mockClient = {
        carts: vi.fn().mockReturnThis(),
        withId: vi.fn().mockReturnThis(),
        post: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValueOnce({
          statusCode: 200,
          body: cartWithDiscountCodes,
        }),
      };
      mockCommercetoolsSdk.getClient.mockReturnValue(
        mockClient as unknown as CommercetoolsSdkClient,
      );

      const result = await cartService.addDiscountCodeToCart(
        mockCartId,
        1,
        mockDiscountCodeId,
      );

      expect(mockClient.post).toHaveBeenCalledWith({
        queryArgs: {
          expand: ["discountCodes[*].discountCode", "lineItems[*].productType"],
        },
        body: {
          version: 1,
          actions: [
            {
              action: "addDiscountCode",
              code: mockDiscountCodeId,
            },
          ],
        },
      });
      expect(result).toContain("MatchesCart");
    });

    it("should remove an added discount code to the cart with 'DoesNotMatchCart' state", async () => {
      const mockCartId = "cartId";
      const mockDiscountCodeId = "wrong-discount-code";

      const mockClient = {
        carts: vi.fn().mockReturnThis(),
        withId: vi.fn().mockReturnThis(),
        post: vi.fn().mockReturnThis(),
        execute: vi
          .fn()
          .mockResolvedValueOnce({
            statusCode: 200,
            body: cartWithInvalidDiscountCodes,
          })
          .mockResolvedValueOnce({
            statusCode: 200,
            body: cartWithDiscountCodes,
          })
          .mockResolvedValueOnce({
            statusCode: 200,
            body: getCartResponse,
          }),
      };

      mockCommercetoolsSdk.getClient.mockReturnValue(
        mockClient as unknown as CommercetoolsSdkClient,
      );

      const result = await cartService.addDiscountCodeToCart(
        mockCartId,
        1,
        mockDiscountCodeId,
      );

      expect(mockClient.post).toHaveBeenCalledWith({
        queryArgs: {
          expand: ["discountCodes[*].discountCode", "lineItems[*].productType"],
        },
        body: {
          version: 1,
          actions: [
            {
              action: "addDiscountCode",
              code: mockDiscountCodeId,
            },
          ],
        },
      });
      expect(result).toContain("DoesNotMatchCart");
    });
  });

  describe("removeDiscountCodeFromCart", () => {
    it("should remove the discount code from the cart and return the updated cart", async () => {
      const mockCartId = "cartId";
      const mockDiscountCodeId = "discountCodeId";

      const mockClient = {
        carts: vi.fn().mockReturnThis(),
        withId: vi.fn().mockReturnThis(),
        post: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValueOnce({
          statusCode: 200,
          body: getCartResponse,
        }),
      };
      mockCommercetoolsSdk.getClient.mockReturnValue(
        mockClient as unknown as CommercetoolsSdkClient,
      );

      const result = await cartService.removeDiscountCodeFromCart(
        mockCartId,
        1,
        mockDiscountCodeId,
      );

      expect(mockClient.post).toHaveBeenCalledWith({
        queryArgs: {
          expand: "lineItems[*].productType",
        },
        body: {
          version: 1,
          actions: [
            {
              action: "removeDiscountCode",
              discountCode: {
                typeId: "discount-code",
                id: mockDiscountCodeId,
              },
            },
          ],
        },
      });
      expect(result.isActive).toEqual(true);
      expect(result.discountCodes.length).toBe(0);
    });

    it("should throw an error when the cart does not exist", async () => {
      const mockCartId = "nonexistentCartId";
      const mockDiscountCodeId = "discountCodeId";

      mockCommercetoolsSdk.getClient.mockReturnValue({
        carts: vi.fn().mockReturnThis(),
        withId: vi.fn().mockReturnThis(),
        post: vi.fn().mockReturnThis(),
        execute: vi.fn().mockRejectedValue(new Error()),
      } as unknown as CommercetoolsSdkClient);

      await expect(
        cartService.removeDiscountCodeFromCart(
          mockCartId,
          1,
          mockDiscountCodeId,
        ),
      ).rejects.toThrow();
    });
  });
});
