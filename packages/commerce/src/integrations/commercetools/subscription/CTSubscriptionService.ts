import { CustomerSetCustomFieldAction } from "@commercetools/platform-sdk";

import {
  OrderNumber,
  ServiceLocator,
  SubscriptionStatus,
} from "../../../index";
import {
  Subscription,
  SubscriptionDraft,
  SubscriptionService,
} from "../../../Subscription";
import CommercetoolsSdk from "../CommercetoolsSdk";
import translateCTCustomer from "../translations/customer";
import { translateSubscription } from "../translations/subscription";

export default class CTSubscriptionService implements SubscriptionService {
  public async getSubscription(
    customerId: string,
  ): Promise<Subscription | undefined> {
    const response = await CommercetoolsSdk.getClient()
      .customers()
      .withId({ ID: customerId })
      .get()
      .execute();

    if (response?.body == null) {
      throw new Error(`Unable to get subscription for customer: ${customerId}`);
    }

    return translateSubscription(response.body);
  }

  public async createSubscription(
    customerId: string,
    customerVersion: number,
    subscriptionDraft: SubscriptionDraft,
  ): Promise<[string, number]> {
    const productService = ServiceLocator.getProductService();
    const product = await productService.getProduct(
      subscriptionDraft.subscriptionProduct.id,
    );

    if (product.type !== "subscription") {
      throw new Error(
        `Creating a subscription with an invalid product: ${subscriptionDraft.subscriptionProduct.id}`,
      );
    }

    // Decrement 1 as customer is instantly starting subscription now
    const prepaidShipmentsRemaining = product.attributes.prepaidShipments - 1;

    const response = await CommercetoolsSdk.getClient()
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: "setCustomType",
              type: {
                key: "customer-subscription",
                typeId: "type",
              },
              fields: {
                status: "active",
                parentOrderNumber: subscriptionDraft.parentOrderNumber,
                subscription: {
                  typeId: "product",
                  id: subscriptionDraft.subscriptionProduct.id,
                },
                nextOrderDate: this.getNextOrderDate(
                  product.attributes.shipmentFrequency,
                ),
                prepaidShipmentsRemaining,
                notified: false,
                cancellationDate: undefined,
                paymentMethodId: subscriptionDraft.paymentMethodId,
              },
            },
          ],
        },
      })
      .execute();

    const customer = translateCTCustomer(response.body);
    // ID and version are required from CT
    return [customer.id!, customer.version!];
  }

  public async fulfillSubscription(
    customerId: string,
    customerVersion: number,
  ): Promise<Subscription> {
    const subscription = await this.getSubscription(customerId);
    if (subscription == null) {
      throw new Error(
        "Failed to fulfill subscription for customer without subscription",
      );
    }

    const productService = ServiceLocator.getProductService();
    const subscriptionProduct = await productService.getProduct(
      subscription.subscription,
    );

    if (subscriptionProduct.type !== "subscription") {
      throw new Error("Fulfilling subscription without a valid product");
    }

    if (subscription.prepaidShipmentsRemaining < 0) {
      throw new Error("Failed to fulfill subscription, no months remaining");
    }

    const customer = await this.updateSubscriptionCustomFields(
      customerId,
      customerVersion,
      {
        nextOrderDate: this.getNextOrderDate(
          subscriptionProduct.attributes.shipmentFrequency,
        ),
        prepaidShipmentsRemaining: subscription.prepaidShipmentsRemaining - 1,
        notified: false,
        stoppedRetrying: false,
      },
    );

    return translateSubscription(customer);
  }

  public async renewSubscription(
    customerId: string,
    customerVersion: number,
    newOrderNumber: OrderNumber,
  ): Promise<Subscription> {
    const subscription = await this.getSubscription(customerId);

    if (subscription == null) {
      throw new Error(
        "Failed to renew subscription for customer without subscription",
      );
    }

    const productService = ServiceLocator.getProductService();
    const repurchaseProduct =
      subscription.nextPlan != null
        ? await productService.getProduct(subscription.nextPlan)
        : await productService.getProduct(subscription.subscription);

    if (repurchaseProduct.type === "standalone") {
      throw new Error("Renewing subscription without a valid product");
    }

    const customer = await this.updateSubscriptionCustomFields(
      customerId,
      customerVersion,
      {
        subscription: repurchaseProduct.id,
        nextPlan: subscription.nextPlan != null ? null : undefined,
        nextPlanCartId: subscription.nextPlanCartId != null ? null : undefined,
        nextOrderDate: this.getNextOrderDate(
          repurchaseProduct.attributes.shipmentFrequency,
        ),
        prepaidShipmentsRemaining:
          (repurchaseProduct.attributes.prepaidShipments ?? 1) - 1,
        parentOrderNumber:
          subscription.nextPlan != null ? newOrderNumber : undefined,
        notified: false,
        stoppedRetrying: false,
      },
    );

    return translateSubscription(customer);
  }

  public async cancelSubscription(
    customerId: string,
    customerVersion: number,
  ): Promise<Subscription> {
    const subscription = await this.getSubscription(customerId);

    if (subscription == null) {
      throw new Error(
        "Failed to cancel subscription for customer without subscription",
      );
    }

    const customer = await this.updateSubscriptionCustomFields(
      customerId,
      customerVersion,
      {
        status: "cancelled",
        cancellationDate: new Date(),
        nextPlan: subscription.nextPlan != null ? null : undefined,
        nextPlanCartId: subscription.nextPlanCartId != null ? null : undefined,
      },
    );

    return translateSubscription(customer);
  }

  public async updateSubscription(
    customerId: string,
    customerVersion: number,
    cartId: string,
    productId: string,
  ): Promise<Subscription> {
    const customer = await this.updateSubscriptionCustomFields(
      customerId,
      customerVersion,
      {
        status: "active",
        nextPlanCartId: cartId,
        nextPlan: productId,
      },
    );

    return translateSubscription(customer);
  }

  public async updateSubscriptionDate(
    customerId: string,
    customerVersion: number,
    newDate: Date,
  ): Promise<Subscription> {
    const customer = await this.updateSubscriptionCustomFields(
      customerId,
      customerVersion,
      {
        nextOrderDate: newDate,
      },
    );

    return translateSubscription(customer);
  }

  public async updatePaymentMethod(
    customerId: string,
    customerVersion: number,
    paymentMethodId: string,
  ): Promise<Subscription> {
    const subscription = await this.getSubscription(customerId);

    if (subscription == null) {
      throw new Error(
        "Failed to update payment method subscription for customer without subscription",
      );
    }

    const customer = await this.updateSubscriptionCustomFields(
      customerId,
      customerVersion,
      {
        paymentMethodId: paymentMethodId,
        stoppedRetrying: false,
      },
    );

    return translateSubscription(customer);
  }

  public async updateStoppedRetrying(
    customerId: string,
    customerVersion: number,
    stoppedRetrying: boolean,
  ): Promise<Subscription | undefined> {
    const customer = await this.updateSubscriptionCustomFields(
      customerId,
      customerVersion,
      {
        stoppedRetrying,
      },
    );

    return translateSubscription(customer);
  }

  public async updateSubscriptionStatus(
    customerId: string,
    customerVersion: number,
    status: SubscriptionStatus,
  ): Promise<Subscription | undefined> {
    const customer = await this.updateSubscriptionCustomFields(
      customerId,
      customerVersion,
      {
        status,
      },
    );

    return translateSubscription(customer);
  }

  /**
   * Dynamically updates commercetools custom fields based on Subscription draft
   * - If you set a field in the draft to `undefined`, it will not be updated since it's not passed in
   * - If a field is set to `null`, it will be removed from the subscription (customer custom fields)
   * - **Note**: If you try to nullify an already empty field, it will throw an error
   * @private
   */
  private async updateSubscriptionCustomFields(
    customerId: string,
    customerVersion: number,
    subscriptionDraft: Partial<Subscription>,
  ) {
    enum CTFieldTypes {
      NUM_TYPE = "number",
      STR_TYPE = "string",
      BOOL_TYPE = "boolean",
      DATE_TYPE = "Date",
      PROD_REF_TYPE = "product",
      ORDER_REF_TYPE = "order",
    }

    const fieldToTypeMap = new Map<string, CTFieldTypes>([
      ["status", CTFieldTypes.STR_TYPE],
      ["subscription", CTFieldTypes.PROD_REF_TYPE],
      ["nextPlan", CTFieldTypes.PROD_REF_TYPE],
      ["nextPlanCartId", CTFieldTypes.STR_TYPE],
      ["prepaidShipmentsRemaining", CTFieldTypes.NUM_TYPE],
      ["parentOrderNumber", CTFieldTypes.STR_TYPE],
      ["paymentMethodId", CTFieldTypes.STR_TYPE],
      ["nextOrderDate", CTFieldTypes.DATE_TYPE],
      ["cancellationDate", CTFieldTypes.DATE_TYPE],
      ["notified", CTFieldTypes.BOOL_TYPE],
      ["stoppedRetrying", CTFieldTypes.BOOL_TYPE],
    ]);

    const actions = Object.entries(subscriptionDraft)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => {
        const action: CustomerSetCustomFieldAction = {
          action: "setCustomField",
          name: key,
        };

        // to remove a custom field's value in CommerceTools, the `value` object must be absent or null,
        // thus, return `action` early and do not set `value` below.
        if (value === null) {
          return action;
        }

        const type = fieldToTypeMap.get(key);
        switch (type) {
          case CTFieldTypes.NUM_TYPE:
            return { ...action, value: value as number };
          case CTFieldTypes.STR_TYPE:
            return { ...action, value: value as string };
          case CTFieldTypes.BOOL_TYPE:
            return { ...action, value: value as boolean };
          case CTFieldTypes.DATE_TYPE:
            return { ...action, value: (value as Date).toISOString() };
          case CTFieldTypes.PROD_REF_TYPE:
          case CTFieldTypes.ORDER_REF_TYPE:
            return { ...action, value: { typeId: type, id: value as string } };
          default:
            throw new Error(`Unknown field type for field ${key}`);
        }
      });

    const response = await CommercetoolsSdk.getClient()
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions,
        },
      })
      .execute();

    if (response?.body == null) {
      throw new Error(
        `Unable to update subscription custom fields for customer: ${customerId}`,
      );
    }

    return response.body;
  }

  /**
   * Calculates next order date by getting today's date and adding
   * the shipment frequency (the amount of time, for a specific product
   * between shipments (in days))
   *
   * @private
   */
  private getNextOrderDate(shipmentFrequency: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + shipmentFrequency);

    return date;
  }
}
