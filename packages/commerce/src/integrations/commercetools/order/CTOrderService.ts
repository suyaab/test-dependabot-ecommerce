import {
  OrderChangeOrderStateAction,
  OrderChangePaymentStateAction,
  OrderChangeShipmentStateAction,
} from "@commercetools/platform-sdk";
import ShortUniqueId from "short-unique-id";
import { z } from "zod";

import { getRandomInt, LingoEnv, SchemaException } from "@ecommerce/utils";

import {
  OrderNumber,
  orderNumberSchema,
  orderSchema,
  OrderService,
  OrderStatusData,
  OrderStatusType,
  type Order,
} from "../../../Order";
import CommercetoolsSdk from "../CommercetoolsSdk";
import { env } from "../env";
import translateCTOrder from "../translations/order";

// available actions and the corresponding type to update status in commercetools
interface OrderStatusDataAction {
  [OrderStatusType.Order]: OrderChangeOrderStateAction;
  [OrderStatusType.Payment]: OrderChangePaymentStateAction;
  [OrderStatusType.Shipment]: OrderChangeShipmentStateAction;
}

export default class CTOrderService implements OrderService {
  public generateOrderNumber(): OrderNumber {
    const uid = new ShortUniqueId({ dictionary: "alphanum_upper" });

    const prefixes: Record<LingoEnv, string> = {
      dev: "USL91",
      qa: "USL92",
      stg: "USL93",
      prod: `USL${getRandomInt(9)}${getRandomInt(9)}`,
    };

    const RANDOM_STRING_LENGTH = 7;

    const prefix = prefixes[env.LINGO_ENV] ?? prefixes.prod;

    const orderNumberParse = orderNumberSchema.safeParse(
      `${prefix}${uid.randomUUID(RANDOM_STRING_LENGTH)}`,
    );

    if (!orderNumberParse.success) {
      throw new SchemaException(
        "Failed to generate order number",
        orderNumberParse.error,
      );
    }

    return orderNumberParse.data;
  }

  public async createOrderFromCart(
    cartId: string,
    cartVersion: number,
    orderNumber: string,
  ): Promise<Order> {
    const ctResp = await CommercetoolsSdk.getClient()
      .orders()
      .post({
        body: {
          cart: { id: cartId, typeId: "cart" },
          version: cartVersion,
          orderNumber: orderNumber,
        },
        queryArgs: {
          expand: "lineItems[*].productType",
        },
      })
      .execute();

    await CommercetoolsSdk.getClient()
      .carts()
      .withId({ ID: cartId })
      .delete({ queryArgs: { version: cartVersion + 1 } })
      .execute()
      .catch(() => {
        // No-op: don't error here as we log this in middleware already
      });

    await CommercetoolsSdk.getClient()
      .customObjects()
      .withContainerAndKey({
        container: "cart-contact-info",
        key: cartId,
      })
      .delete()
      .execute()
      .catch(() => {
        // No-op: don't error here as we log this in middleware already
      });

    return orderSchema.parse(translateCTOrder(ctResp.body));
  }

  public async getOrderById(orderId: string): Promise<Order | undefined> {
    const ctResp = await CommercetoolsSdk.getClient()
      .orders()
      .withId({ ID: orderId })
      .get({
        queryArgs: {
          expand: "lineItems[*].productType",
        },
      })
      .execute();

    if (ctResp?.body == null) {
      throw new Error(`Unable to get order: ${orderId}`);
    }

    return orderSchema.parse(translateCTOrder(ctResp.body));
  }

  public async getOrderByOrderNumber(
    orderNumber: string,
  ): Promise<Order | undefined> {
    const ctResp = await CommercetoolsSdk.getClient()
      .orders()
      .withOrderNumber({ orderNumber })
      .get({
        queryArgs: {
          expand: "lineItems[*].productType",
        },
      })
      .execute();

    if (ctResp?.body == null) {
      throw new Error(`Unable to get order: ${orderNumber}`);
    }

    return orderSchema.parse(translateCTOrder(ctResp.body));
  }

  public async getAllOrders(customerId: string): Promise<Order[]> {
    const ctResp = await CommercetoolsSdk.getClient()
      .orders()
      .get({
        queryArgs: {
          where: `customerId="${customerId}"`,
          expand: "lineItems[*].productType",
        },
      })
      .execute();

    if (ctResp?.body == null) {
      throw new Error(`Unable to get all orders for customer: ${customerId}`);
    }

    return z
      .array(orderSchema)
      .parse(ctResp.body.results.map((ctOrder) => translateCTOrder(ctOrder)));
  }

  public async getMostRecentOrder(
    customerId: string,
  ): Promise<Order | undefined> {
    const ctResp = await CommercetoolsSdk.getClient()
      .orders()
      .get({
        queryArgs: {
          where: `customerId="${customerId}"`,
          limit: 1,
          sort: ["createdAt desc"],
          expand: "lineItems[*].productType",
        },
      })
      .execute();

    if (ctResp?.body?.results?.[0] == null) {
      throw new Error(`Unable to get most recent order: ${customerId}`);
    }

    return orderSchema.parse(translateCTOrder(ctResp.body.results[0]));
  }

  public async updateOrderStatus<T extends OrderStatusType>(
    orderStatusType: T,
    status: OrderStatusData[T],
    orderNumber: string,
    version: number,
  ): Promise<Order | undefined> {
    const action = this.buildUpdateOrderAction(orderStatusType, status);

    const ctResp = await CommercetoolsSdk.getClient()
      .orders()
      .withOrderNumber({ orderNumber })
      .post({
        body: {
          version,
          actions: [action],
        },
        queryArgs: {
          expand: "lineItems[*].productType",
        },
      })
      .execute();

    if (ctResp?.body == null) {
      throw new Error(`Unable to update order ${orderNumber} to ${status}`);
    }

    return orderSchema.parse(translateCTOrder(ctResp.body));
  }

  private buildUpdateOrderAction<T extends OrderStatusType>(
    statusType: T,
    status: OrderStatusData[T],
  ): OrderStatusDataAction[T] {
    const actions: OrderStatusDataAction = {
      [OrderStatusType.Order]: {
        action: "changeOrderState",
        orderState: status,
      },
      [OrderStatusType.Payment]: {
        action: "changePaymentState",
        paymentState: status,
      },
      [OrderStatusType.Shipment]: {
        action: "changeShipmentState",
        shipmentState: status,
      },
    };

    return actions[statusType];
  }
}
