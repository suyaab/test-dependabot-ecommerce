import qs from "qs";
import { z } from "zod";

import { Address, centsToDollars, Currency } from "@ecommerce/utils";

import { CheckoutService, CheckoutSession } from "../../CheckoutService";
import { Payment } from "../../PaymentGateway";
import { env } from "./env";
import { payOnPaymentSchema } from "./PayOnPaymentGateway";
import { isCheckoutSessionPending, isPayonSuccessful } from "./statusCodes";
import { translatePayOnCheckoutSession } from "./translations/checkoutSession";
import { translatePayOnPayment } from "./translations/payment";

/**
 * CHECKOUT SESSIONS
 */
export const payOnCheckoutSessionResponseSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  result: z.object({
    code: z.string(),
    description: z.string(),
  }),
});
export type PayOnCheckoutResponse = z.infer<
  typeof payOnCheckoutSessionResponseSchema
>;

export const payOnCheckoutSessionSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  result: z.object({
    code: z.string(),
    description: z.string(),
  }),
  amount: z.string(),
  currency: z.string(),
});
export type PayOnCheckoutSession = z.infer<typeof payOnCheckoutSessionSchema>;

export default class PayOnCheckoutService implements CheckoutService {
  public async createCheckoutSession(
    orderNumber: string,
    totalPrice: number,
    currency: Currency,
  ): Promise<CheckoutSession> {
    try {
      const checkoutSessionData = {
        entityId: env.PAYON_ECOMM_ENTITY_ID,
        amount: centsToDollars(totalPrice).toFixed(2),
        currency: currency,
        createRegistration: true,
        paymentType: "PA",
        standingInstruction: {
          source: "CIT",
          mode: "INITIAL",
          type: "RECURRING",
        },
        merchantTransactionId: orderNumber,
        testMode: env.PAYON_TEST_MODE,
      };

      const payOnCheckoutSessionResponse =
        await this.postPayonData<PayOnCheckoutResponse>(
          "/checkouts",
          checkoutSessionData,
        );

      if (
        !isCheckoutSessionPending(payOnCheckoutSessionResponse?.result?.code)
      ) {
        throw new Error(
          `Payon create result unsuccessful: ${payOnCheckoutSessionResponse?.result?.code}`,
        );
      }

      return await this.getCheckoutSession(payOnCheckoutSessionResponse.id);
    } catch (error) {
      throw new Error(`Error creating checkout session: ${orderNumber}`, {
        cause: error,
      });
    }
  }

  public async getCheckoutSession(
    checkoutSessionId: string,
  ): Promise<CheckoutSession> {
    const response = await fetch(
      `${env.PAYON_API_URL}/checkouts/${checkoutSessionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${env.PAYON_AUTH_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    // TODO: do we want to throw on this? or just return failed checkout session
    if (!response.ok) {
      throw new Error(
        `PayOn API Failure ${response.status}: Unable to GET /checkout/${checkoutSessionId}`,
        {
          cause: new Error(await response.text()),
        },
      );
    }

    // TODO: verify this schema because unsafe parse will throw an error
    // also we are parsing this schema before translating and parsing why?
    const payOnCheckoutSession = payOnCheckoutSessionSchema.parse(
      await response.json(),
    );

    return translatePayOnCheckoutSession(payOnCheckoutSession);
  }

  public async updateCheckoutSessionCustomer(
    checkoutSessionId: string,
    ip: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
  ): Promise<void> {
    try {
      const customerData = {
        entityId: env.PAYON_ECOMM_ENTITY_ID,
        customer: {
          ip,
          givenName: firstName,
          surname: lastName,
          email,
          phone,
        },
      };

      const payOnCheckoutResult =
        await this.postPayonData<PayOnCheckoutResponse>(
          `/checkouts/${checkoutSessionId}`,
          customerData,
        );

      if (!isCheckoutSessionPending(payOnCheckoutResult?.result?.code)) {
        throw new Error(
          `Payon update result unsuccessful ${payOnCheckoutResult?.result?.code}`,
        );
      }
    } catch (error) {
      throw new Error(
        `Error updating checkout session customer. ${checkoutSessionId}`,
        {
          cause: error,
        },
      );
    }
  }

  public async updateCheckoutSessionAddress(
    checkoutSessionId: string,
    billingAddress: Address,
  ): Promise<void> {
    try {
      const addressData = {
        entityId: env.PAYON_ECOMM_ENTITY_ID,
        customer: {
          givenName: billingAddress.firstName,
          surname: billingAddress.lastName,
        },
        billing: {
          street1: billingAddress.addressLine1,
          street2: billingAddress.addressLine2,
          postcode: billingAddress.postalCode,
          city: billingAddress.city,
          state: billingAddress.state,
          country: billingAddress.countryCode,
        },
      };

      const payOnCheckoutResult =
        await this.postPayonData<PayOnCheckoutResponse>(
          `/checkouts/${checkoutSessionId}`,
          addressData,
        );

      if (!isCheckoutSessionPending(payOnCheckoutResult?.result?.code)) {
        throw new Error(
          `Failed to update payon checkout: ${payOnCheckoutResult?.result?.code}`,
        );
      }
    } catch (error) {
      throw new Error(
        `Error updating checkout session address. ${checkoutSessionId}`,
        {
          cause: error,
        },
      );
    }
  }

  public async getCheckoutPayment(checkoutSessionId: string): Promise<Payment> {
    try {
      const response = await fetch(
        `${env.PAYON_API_URL}/checkouts/${checkoutSessionId}/payment?entityId=${env.PAYON_ECOMM_ENTITY_ID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.PAYON_AUTH_TOKEN}`,
          },
          cache: "no-store",
        },
      );

      // TODO: do we want to throw on this? or just return failed payment data
      if (!response.ok) {
        throw new Error(
          `PayOn Failed ${response.status}: Unable to GET /checkouts/${checkoutSessionId}/payment`,
          {
            cause: new Error(await response.text()),
          },
        );
      }

      const payonPayment = payOnPaymentSchema.parse(await response.json());

      if (!isPayonSuccessful(payonPayment.result.code)) {
        throw new Error(
          `Invalid PayOn paymentStatus: ${payonPayment?.result?.code}, checkout session: ${checkoutSessionId}`,
        );
      }

      return translatePayOnPayment(payonPayment);
    } catch (error) {
      throw new Error("Unable to get checkout payment", { cause: error });
    }
  }

  public async updateAuthorizedPrice(
    currency: string,
    totalPrice: number,
    checkoutSessionId: string,
  ): Promise<boolean> {
    const checkoutSessionData = {
      entityId: env.PAYON_ECOMM_ENTITY_ID,
      amount: centsToDollars(totalPrice).toFixed(2),
      currency: currency,
    };

    const payOnCheckoutResult = await this.postPayonData<PayOnCheckoutResponse>(
      `/checkouts/${checkoutSessionId}`,
      checkoutSessionData,
    );

    return isCheckoutSessionPending(payOnCheckoutResult?.result?.code);
  }

  // TODO: refactor this function out
  private async postPayonData<T>(
    extension: string,
    queryParams: unknown,
  ): Promise<T> {
    const response = await fetch(
      `${env.PAYON_API_URL}/${extension}?${qs.stringify(queryParams, {
        allowDots: true,
      })}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.PAYON_AUTH_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    const responseData = (await response.json()) as T;

    if (!response.ok) {
      throw new Error(
        `PayOn Failed: Unable to POST to ${extension}, statusCode: ${
          response.status
        }. ${JSON.stringify(responseData)}`,
      );
    }

    return responseData;
  }
}
