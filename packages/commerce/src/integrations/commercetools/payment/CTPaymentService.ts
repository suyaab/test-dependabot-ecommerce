import crypto from "crypto";

import { Payment } from "@ecommerce/finance";

import {
  PaymentReference,
  PaymentService,
  Transaction,
} from "../../../Payment";
import CommercetoolsSdk from "../CommercetoolsSdk";
import { translatePaymentReference } from "../translations/payment";

export default class CTPaymentService implements PaymentService {
  // TODO: Add error handling to methods below
  public async createPaymentReference(
    payment: Payment,
    customerId: string,
    transactions?: Transaction[],
  ): Promise<{ id: string; version: number }> {
    const { body: ctPayment } = await CommercetoolsSdk.getClient()
      .payments()
      .post({
        body: {
          interfaceId: payment.id,
          amountPlanned: {
            currencyCode: payment.currency,
            centAmount: Math.round(payment.amount),
          },
          paymentMethodInfo: {
            paymentInterface: payment.paymentInterface,
            method: payment.paymentMethod.type,
            name: {
              en: payment.paymentMethod.type,
            },
          },
          paymentStatus: payment.paymentStatus,
          customer: {
            id: customerId,
            typeId: "customer",
          },
          transactions: transactions?.map((transaction) => ({
            type: transaction.type,
            amount: transaction.amount,
            state: transaction.state,
            interactionId: crypto.randomUUID(),
            timestamp: transaction.timestamp.toISOString(),
          })),
          custom: {
            type: {
              typeId: "type",
              key: "payment-reference",
            },
            fields: {
              channel: "ecommerce", // TODO: add other channels here
            },
          },
        },
      })
      .execute();

    return { id: ctPayment.id, version: ctPayment.version };
  }

  public async getPaymentReference(
    orderNumber: string,
  ): Promise<PaymentReference | undefined> {
    const { body: order } = await CommercetoolsSdk.getClient()
      .orders()
      .withOrderNumber({ orderNumber })
      .get({
        queryArgs: {
          expand: "paymentInfo.payments[*]",
        },
      })
      .execute();

    if (order?.paymentInfo?.payments?.[0]?.obj == null) {
      return;
    }

    const payment = order?.paymentInfo.payments[0].obj;

    return translatePaymentReference(payment);
  }

  public async attachTransactionToPaymentReference(
    paymentId: string,
    version: number,
    transaction: Transaction,
  ): Promise<void> {
    await CommercetoolsSdk.getClient()
      .payments()
      .withId({ ID: paymentId })
      .post({
        body: {
          version,
          actions: [
            {
              action: "addTransaction",
              transaction: {
                type: transaction.type,
                amount: transaction.amount,
                state: transaction.state,
                interactionId: transaction.interactionId,
                timestamp: transaction.timestamp.toISOString(),
              },
            },
          ],
        },
      })
      .execute();
  }

  public async deletePaymentReference(
    paymentRefId: string,
    paymentRefVersion: number,
  ): Promise<void> {
    await CommercetoolsSdk.getClient()
      .payments()
      .withId({ ID: paymentRefId })
      .delete({
        queryArgs: {
          version: paymentRefVersion,
        },
      })
      .execute();
  }
}
