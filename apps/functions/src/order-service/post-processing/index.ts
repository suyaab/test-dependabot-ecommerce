import { app, InvocationContext } from "@azure/functions";
import { z } from "zod";

import { Order, ServiceLocator } from "@ecommerce/commerce";
import { ServiceLocator as FinanceSL } from "@ecommerce/finance";
import { getLogger } from "@ecommerce/logger";
import {
  MarketingAttributeType,
  MarketingEventType,
  ServiceLocator as MarketingSL,
} from "@ecommerce/marketing";
import { centsToDollars, SchemaException } from "@ecommerce/utils";

import { env } from "../../env";
import getArvatoEnvironment from "./getArvatoEnvironment";
import getCreditCardType from "./getCreditCardType";
import { ArvatoPayload, ArvatoResponse } from "./types";

const messageSchema = z.object({
  type: z.literal("OrderCreated"),
  order: z.object({
    id: z.string(),
    version: z.number(),
  }),
});

export async function postProcessing(
  message: unknown,
  context: InvocationContext,
): Promise<void> {
  const logger = getLogger({
    correlationId: context.invocationId,
    prefix: "order-post-processing",
  });
  logger.info({ message }, "Processing CT Order");

  try {
    const messageParse = messageSchema.safeParse(message);

    if (!messageParse.success) {
      logger.error(
        messageParse.error.errors,
        "Failed to parse order from commercetools event",
      );

      throw new SchemaException(
        "Failed to parse order from commercetools event",
        messageParse.error,
      );
    }

    const orderService = ServiceLocator.getOrderService();
    const order = await orderService.getOrderById(messageParse.data.order.id);

    if (order == null) {
      throw new Error(`Unable to retrieve order ${messageParse.data.order.id}`);
    }

    logger.info({ order }, "Retrieved Order");

    if (order.lineItems[0] == null) {
      throw new Error("Order has no line items");
    }

    const taxService = FinanceSL.getTaxService();

    const customerService = ServiceLocator.getCustomerService();
    const customer = await customerService.getCustomerById(order.customerId, {
      includeSubscription: true,
    });

    if (customer == null) {
      throw new Error(`Unable to retrieve customer ${order.customerId}`);
    }

    logger.info({ customer }, "Retrieved Customer");

    const productService = ServiceLocator.getProductService();
    const discountCodeService = ServiceLocator.getDiscountCodeService();

    // let's find another way to determine orders are recurring, so we can avoid a lot of
    // this logic if it's not required.  it would help with all the places we `!` or
    // give default values
    let parentOrder: Order | undefined;

    // TODO: let's rethink where orderOrigin should live (custom field on order)
    const orderedProduct = await productService.getProduct(
      order.lineItems[0].product.id,
    );

    logger.info({ orderedProduct }, "Retrieved Ordered Product");

    let orderOrigin = orderedProduct.attributes.orderOrigin;

    if (
      order.totalGross === 0 &&
      (orderOrigin === "CUSTOMER" || orderOrigin === "INITIAL")
    ) {
      orderOrigin = "SAMPLE";
    }

    if (order.discountCodeId != null) {
      const discount = await discountCodeService.getDiscountCodeById(
        order.discountCodeId,
      );

      if (discount?.code === "CHI262") {
        orderOrigin = "NOSHIP";
      }
    }

    let numberOfShipments = 1;
    if (orderedProduct.type === "subscription") {
      numberOfShipments = orderedProduct.attributes.prepaidShipments;
    }
    if (customer.subscription != null) {
      parentOrder = await orderService.getOrderByOrderNumber(
        customer.subscription.parentOrderNumber,
      );

      if (parentOrder?.lineItems[0]?.product.id == null) {
        throw new Error(
          "Unable to find parent order line items on customer subscription",
        );
      }

      logger.info({ parentOrder }, "Retrieved Parent Order");

      const parentOrderProduct = await productService.getProduct(
        parentOrder.lineItems[0].product.id,
      );

      logger.info({ parentOrderProduct }, "Retrieved Parent Order Product");

      if (parentOrderProduct.type === "subscription") {
        numberOfShipments = parentOrderProduct.attributes.prepaidShipments;
      }
    }

    const defaultImageUrl =
      "https://www.hellolingo.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FheroImageHalf.33ffa155.jpg&w=1920&q=75";

    const addresses = (
      [
        ["SOLD_TO", order.billingAddress ?? order.shippingAddress],
        ["SHIP_TO", order.shippingAddress],
        ["BILL_TO", order.billingAddress ?? order.shippingAddress],
      ] as const
    ).map(([typeCode, address]) => {
      return {
        customerId:
          typeCode === "SOLD_TO" ? customer.customerNumber : undefined,
        typeCode,
        firstName: address.firstName,
        lastName: address.lastName,
        street2: address.addressLine2,
        street: address.addressLine1,
        city: address.city,
        state: address.state,
        zipCode: address.postalCode,
        country: address.countryCode,
        phoneNumber: customer.phone ?? "",
        customerEmail: customer.email,
        language: "en",
      };
    });

    // TODO: can we use customer's subscription or product type for this?
    const isRecurringOrder = ["INITIAL", "AUTORENEWAL", "FULFILLMENT"].includes(
      orderOrigin,
    );

    const orderLines = await Promise.all(
      order.lineItems.map(async (lineItem) => {
        logger.info({ lineItem }, "Processing Line Item");

        const netAmountBeforeDiscount = lineItem.price;
        const netAmountAfterDiscount = lineItem.totalNet;
        const taxAmount = lineItem.taxAmount;
        let revenue = netAmountAfterDiscount / numberOfShipments;

        if (orderOrigin === "FULFILLMENT") {
          if (parentOrder == null) {
            throw new Error("Fulfillment order does not have a parent!");
          }
          revenue = parentOrder.totalNet / numberOfShipments;
        }

        const product = await productService.getProduct(lineItem.product.id);

        if (product == null) {
          throw new Error(
            `Unable to retrieve product from line item: ${lineItem.product.id}`,
          );
        }

        logger.info({ product }, "Retrieved Product from Line Item");

        // record transaction in Avalara
        const { totalTaxCalculated } = await taxService.createTaxTransaction(
          order.shippingAddress,
          centsToDollars(netAmountAfterDiscount),
          lineItem.product.sku,
          order.orderNumber,
          customer.customerNumber,
        );

        if (totalTaxCalculated !== centsToDollars(taxAmount)) {
          logger.error(
            "Error Tax amount from Tax Service does not match the order tax amount! ",
          );
          throw new Error("Error Tax Amount does not equal!");
        }

        return {
          orderLineId: "11397", // TODO: what is this?
          sku: product.sku,
          itemDescription: lineItem.name,
          isSet: true,
          quantity: lineItem.quantity,
          returnableUntil: product.attributes.returnableDays,
          imageURL: defaultImageUrl, // TODO: should we use imageURL from CT or something else?
          linePrices: [
            {
              priceType: "netAmountBeforeDiscount",
              amount: centsToDollars(netAmountBeforeDiscount),
              currency: order.currencyCode,
            },
            {
              priceType: "netAmountAfterDiscount",
              amount: centsToDollars(netAmountAfterDiscount),
              currency: order.currencyCode,
            },
            {
              priceType: "taxAmount",
              amount: centsToDollars(taxAmount),
              currency: order.currencyCode,
            },
            {
              priceType: "netDiscount",
              amount: centsToDollars(lineItem.totalDiscount),
              currency: order.currencyCode,
            },
            {
              priceType: "revenue",
              amount: centsToDollars(Math.round(revenue)),
              currency: order.currencyCode,
            },
          ],
        };
      }),
    );

    // NOTE: For some odd reason, `street2` must appear before `street` for the Arvato request to be successful
    const arvatoPayload: ArvatoPayload = {
      header: {
        correlationId: context.invocationId,
        eventName: "sendOrderDetails",
        environment: getArvatoEnvironment(),
        businessCode: "LGO",
        applicationCountryCode: env.ARVATO_APPLICATION_COUNTRY_CODE,
      },
      payload: {
        order: {
          orderUpdate: false,
          orderNumber: order.orderNumber,
          address: addresses,
          shippingCode: "Standard",
          orderOrigin,
          caseId: order.caseId,
          orderDate: order.createdAt,
          invoiceCopack: false,
          subscription: isRecurringOrder,
          subscriptionId: parentOrder?.orderNumber,
          orderPriority: 90,
          orderLines,
        },
      },
    };

    logger.info(arvatoPayload, "Initial Arvato Payload");

    if (order.totalGross !== 0) {
      const paymentService = ServiceLocator.getPaymentService();
      const paymentReference = await paymentService.getPaymentReference(
        order.orderNumber,
      );

      if (paymentReference == null) {
        throw new Error("Payment Reference not found");
      }

      logger.info({ paymentReference }, "Payment Reference");

      const paymentGateway = FinanceSL.getPaymentGateway();
      const payment = await paymentGateway.getPayment(
        paymentReference.interfaceId,
      );
      const totalGrossInDollars = centsToDollars(order.totalGross);

      logger.info({ payment }, "Payment");

      arvatoPayload.payload.order.paymentData = {
        ccType: getCreditCardType(payment.paymentMethod),
        ccExpiryDate: `${payment.paymentMethod.card.expiryMonth}${payment.paymentMethod.card.expiryYear}`,
        ccPayID: paymentReference.interfaceId,
        ccReferenceID: "10003718", // TODO: what is this?
        ccLocID: paymentGateway.getChannelDetails(paymentReference.channel)
          .ccLocId, // TODO: refactor simplify
        Prices: [
          {
            priceType: "ccAuthorizedAmount",
            amount: totalGrossInDollars,
            currency: order.currencyCode,
          },
        ],
      };
    }

    logger.info(arvatoPayload, "Final Arvato Payload");

    const response = await fetch(`${env.ARVATO_SEEBURGER_URL}/order`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${env.ARVATO_USERNAME}:${env.ARVATO_PASSWORD}`,
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arvatoPayload),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to POST payload to Arvato with status code ${response.status}`,
        {
          cause: new Error(await response.text()),
        },
      );
    }

    /**
     * The order has already been processed so we no longer want to throw an error
     * because it would cause this messaged to be retried multiple times (x10)
     * Everything after the order has been sent to Arvato is our best effort
     * and should be in the following nested try/catch block and not rethrown
     */
    try {
      // Get Arvato Response details for logging and correlation
      const body = (await response.json()) as ArvatoResponse;

      if (body?.status !== "success") {
        logger.warn({ response: body }, "Unexpected Arvato response status");
      }

      logger.info(
        `Successfully sent order ${order.orderNumber} to Arvato: ${body.TrackID}`,
      );

      // send event to update customer in crm
      const marketingService = MarketingSL.getMarketingService();

      const discountCodeService = ServiceLocator.getDiscountCodeService();
      let discountCode;
      if (order.discountCodeId != null) {
        discountCode = await discountCodeService.getDiscountCodeById(
          order.discountCodeId,
        );
      }
      const postProcessingTasks = await Promise.allSettled([
        marketingService.sendEvent(MarketingEventType.Purchase, {
          externalId: customer.externalId,
          email: customer.email,
          product: {
            productId: order.lineItems[0].product.sku,
            currency: order.currencyCode,
            price: order.totalPrice / 100,
            properties: {
              productType: order.lineItems[0].product.type,
            },
          },
        }),
        marketingService.updateUserAttributes(MarketingAttributeType.Purchase, {
          externalId: customer.externalId,
          email: customer.email,
          sku: order.lineItems[0].product.sku,
          promoCode: discountCode?.code ?? "",
        }),
      ]);

      postProcessingTasks.forEach((task) => {
        if (task.status === "rejected") {
          logger.error(task.reason, "Failed to complete post processing task");
        }
      });

      // FIXME: create transaction object AFTER successful Arvato POST
      // const transactionData = {
      //   paymentId,
      //   type: "Charge",
      //   currencyCode: order.totalPrice.currencyCode,
      //   centAmount: order.totalPrice.centAmount,
      //   state: "Pending",
      //   version: paymentInfo.version,
      // };
      // TODO: attachTransactionToPayment

      // const channelLocIdMap = new Map<PaymentChannel, string>([
      //   ["ecommerce", "I1"],
      //   ["moto", "CU"],
      // ]);
    } catch (error) {
      // This nested try/catch is to ensure that the order is not processed again
      // DO NOT rethrow errors here
      logger.error(error, "Failed to complete post processing tasks");
    }
  } catch (error) {
    logger.error(error, "Failed to send order to Arvato");

    throw error;
  }
}

app.serviceBusQueue("order-post-processing", {
  queueName: "dtc-orders",
  connection: "AZURE_SERVICEBUS_CONN_STR",
  handler: postProcessing,
});
