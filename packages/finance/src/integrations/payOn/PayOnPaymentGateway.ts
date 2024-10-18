import qs from "qs";
import { z } from "zod";

import {
  centsToDollars,
  RecurPayAuthException,
  SchemaException,
} from "@ecommerce/utils";

import {
  ChannelDetails,
  Payment,
  PaymentChannel,
  PaymentGateway,
  PaymentMethod,
} from "../../PaymentGateway";
import { env } from "./env";
import { isPayonSuccessful } from "./statusCodes";
import { translatePayOnPayment } from "./translations/payment";
import { translatePayOnPaymentMethod } from "./translations/paymentMethod";

/**
 * PAYON PAYMENT BRANDS
 */
export const payonPaymentBrandSchema = z.union([
  z.literal("VISA"),
  z.literal("MASTER"),
  z.literal("AMEX"),
  z.literal("PAYPAL_CONTINUE"),
  z.literal("GOOGLEPAY"),
  z.literal("APPLEPAY"),
]);
export type PayonPaymentBrand = z.infer<typeof payonPaymentBrandSchema>;

/**
 * PAYON PAYMENTS
 */

export const payOnPaymentSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  result: z.object({
    code: z.string(),
    description: z.string(),
  }),
  amount: z.coerce.number(),
  currency: z.string(),
  merchantTransactionId: z.string(),
  registrationId: z.string(),
  customParameters: z.object({
    tokenSource: z.string().optional(),
  }),
  customer: z.object({
    givenName: z.string(),
    surname: z.string(),
    email: z.string(),
  }),
  billing: z.object({
    street1: z.string(),
    street2: z.string().optional(),
    city: z.string(),
    state: z.string().optional(),
    postcode: z.string(),
    country: z.string(),
  }),
  paymentBrand: payonPaymentBrandSchema,
  card: z.object({
    expiryMonth: z.string(),
    expiryYear: z.string(),
    last4Digits: z.string(),
  }),
});
export type PayOnPayment = z.infer<typeof payOnPaymentSchema>;

export interface PayOnRecurringPayment {
  id: string;
  amount: number;
  currency: string;
  merchantTransactionId: string;
  result: {
    code: string;
    description: string;
  };
}

/**
 * PAYON REGISTRATIONS
 */
export const payonRegistrationSchema = z.object({
  id: z.string(),
  paymentBrand: payonPaymentBrandSchema,
  card: z.object({
    last4Digits: z.string(),
    expiryMonth: z.string(),
    expiryYear: z.string(),
  }),
  customer: z.object({
    givenName: z.string(),
    surname: z.string(),
  }),
  billing: z.object({
    street1: z.string(),
    street2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postcode: z.string(),
    country: z.string(),
  }),
  result: z.object({
    code: z.string(),
    description: z.string(),
  }),
  customParameters: z.object({
    tokenSource: z.string().optional(),
  }),
});
export type PayOnRegistration = z.infer<typeof payonRegistrationSchema>;

export default class PayOnPaymentGateway implements PaymentGateway {
  public async getSavedPaymentMethod(
    paymentMethodId: string,
  ): Promise<PaymentMethod> {
    try {
      const payonRegistration =
        await this.getPayOnRegistration(paymentMethodId);

      return translatePayOnPaymentMethod(payonRegistration);
    } catch (error) {
      throw new Error("Unable to get saved payment method", { cause: error });
    }
  }

  public getChannelDetails(channel: PaymentChannel): ChannelDetails {
    switch (channel) {
      case "moto":
        return {
          channel: "moto",
          ccLocId: "CU",
          entityId: env.PAYON_MOTO_ENTITY_ID,
        };
      case "ecommerce":
      default:
        return {
          channel: "ecommerce",
          ccLocId: "I1",
          entityId: env.PAYON_ECOMM_ENTITY_ID,
        };
    }
  }

  public async authorizeRecurringPayment(
    paymentMethodId: string,
    price: number,
    currency: string,
    orderNumber: string,
  ): Promise<Payment> {
    try {
      const paymentAuthorizationData = {
        entityId: env.PAYON_ECOMM_ENTITY_ID,
        amount: centsToDollars(price).toFixed(2),
        currency: currency,
        paymentType: "PA",
        standingInstruction: {
          source: "MIT",
          mode: "REPEATED",
          type: "UNSCHEDULED",
        },
        merchantTransactionId: orderNumber,
        testMode: env.PAYON_TEST_MODE,
      };

      const payOnPaymentAuthorizationResult =
        await this.postPayonData<PayOnRecurringPayment>(
          `/registrations/${paymentMethodId}/payments`,
          paymentAuthorizationData,
        );

      if (!isPayonSuccessful(payOnPaymentAuthorizationResult?.result?.code)) {
        throw new RecurPayAuthException(
          `Unsuccessful authorization for recurring payment: ${payOnPaymentAuthorizationResult?.result?.code}`,
        );
      }

      return await this.getPayment(payOnPaymentAuthorizationResult.id);
    } catch (error) {
      throw new RecurPayAuthException("Error authorizing recurring payment", {
        cause: error,
      });
    }
  }

  public async getPayment(paymentId: string): Promise<Payment> {
    const payonPayment = await this.getPayonData<PayOnPayment>(
      `payments/${paymentId}?entityId=${env.PAYON_ECOMM_ENTITY_ID}`,
    );

    if (payonPayment == null) {
      throw new Error(`Cannot query PayOn payment: ${paymentId}`);
    }

    if (!isPayonSuccessful(payonPayment.result.code)) {
      throw new Error(
        `Invalid PayOn payment. statusCode: ${payonPayment?.result?.code}, payment: ${paymentId}`,
      );
    }

    return translatePayOnPayment(payonPayment);
  }

  private async getPayOnRegistration(
    registrationId: string,
  ): Promise<PayOnRegistration> {
    try {
      const registrationDetails = await this.getPayonData<PayOnRegistration>(
        `/registrations/${registrationId}?entityId=${env.PAYON_ECOMM_ENTITY_ID}`,
      );

      if (registrationDetails == null) {
        throw new Error(
          `Invalid PayOn registration from the query for order: ${registrationId}`,
        );
      }

      const registrationParse =
        payonRegistrationSchema.safeParse(registrationDetails);

      if (!registrationParse.success) {
        throw new SchemaException(
          "Unable to translate PayOn Registration",
          registrationParse.error,
        );
      }

      return registrationParse.data;
    } catch (error) {
      throw new Error("Error getting the registration Details", {
        cause: error,
      });
    }
  }

  // TODO: refactor this function out
  private async getPayonData<T>(extension: string): Promise<T> {
    const response = await fetch(`${env.PAYON_API_URL}/${extension}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.PAYON_AUTH_TOKEN}`,
      },
      cache: "no-store",
    });

    const responseData = (await response.json()) as T;

    if (!response.ok) {
      throw new Error(
        `PayOn Failed: Unable to GET ${extension}, statusCode: ${
          response.status
        }. ${JSON.stringify(responseData)}`,
      );
    }

    return responseData;
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
