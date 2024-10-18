import { z } from "zod";

import {
  MarketingAttributeData,
  MarketingAttributeType,
  MarketingEventData,
  MarketingEventType,
  MarketingService,
  MarketingUser,
  marketingUserSchema,
  SignupSource,
} from "../MarketingService";
import { env } from "./env";

export interface BrazeEventData {
  [MarketingEventType.Purchase]: {
    purchases: {
      external_id: string;
      app_id: string;
      name: string;
      time: string;
      email: string;
      price: number;
      currency: string;
      product_id: string;
      properties: {
        product_type: string;
      };
    }[];
    events: {
      name: string;
      time: string;
      external_id: string;
      email: string;
      app_id: string;
      properties: Record<string, unknown>;
    }[];
  };
}

export interface BrazeUserAttributeData {
  [MarketingAttributeType.Subscription]: {
    attributes: [
      {
        external_id: string;
        email_subscribe: "unsubscribed" | "subscribed" | "opted_in";
        subscription_groups: [
          {
            subscription_group_id: string;
            subscription_state: "unsubscribed" | "subscribed" | "opted_in";
          },
          {
            subscription_group_id: string;
            subscription_state: "unsubscribed" | "subscribed" | "opted_in";
          },
          {
            subscription_group_id: string;
            subscription_state: "unsubscribed" | "subscribed" | "opted_in";
          },
        ];
      },
    ];
  };
  [MarketingAttributeType.Purchase]: {
    attributes: [
      {
        email: string;
        external_id: string;
        sku_name: string;
      },
    ];
  };
}

export class BrazeMarketingService implements MarketingService {
  public async createUser(
    externalId: string,
    email: string,
    marketingConsent: boolean,
    signupSource: SignupSource,
    countryCode: string,
  ): Promise<void> {
    try {
      if (externalId == null) {
        throw new Error("Invalid External Id");
      }

      const attributes = [
        {
          external_id: externalId,
          email: email,
          email_subscribe: "subscribed",
          first_signup_date: new Date(),
          signup_source: marketingConsent ? { add: [signupSource] } : undefined,
          country: countryCode,
        },
      ];

      const events = marketingConsent
        ? [
            {
              name: "signup",
              time: new Date(),
              external_id: externalId,
              email: email,
            },
          ]
        : undefined;

      const response = await fetch(`${env.BRAZE_API_URL}/users/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.BRAZE_API_KEY}`,
        },
        body: JSON.stringify({
          attributes,
          events,
        }),
      });

      if (!response.ok) {
        throw new Error(`Invalid response code ${response.status}`);
      }
    } catch (error) {
      throw new Error("Braze create user API request failed", {
        cause: error,
      });
    }
  }

  public async getUserById(
    externalId: string,
  ): Promise<MarketingUser | undefined> {
    const response = await fetch(`${env.BRAZE_API_URL}/users/export/ids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.BRAZE_API_KEY}`,
      },
      body: JSON.stringify({
        external_ids: [externalId],
        fields_to_export: ["email_subscribe", "external_id"],
      }),
    });

    const brazeTrackUserSchema = z.object({
      users: z
        .array(
          z.object({
            external_id: z.string(),
            email_subscribe: z.string(),
          }),
        )
        .min(1),
    });

    const usersParse = brazeTrackUserSchema.safeParse(await response.json());

    if (!usersParse.success) {
      return undefined;
    }

    const user = usersParse.data.users[0];

    if (user == null) {
      return undefined;
    }

    return marketingUserSchema.parse({
      externalId: user.external_id,
      subscribed: user.email_subscribe,
    });
  }

  public async getUser(userEmail: string): Promise<MarketingUser | undefined> {
    try {
      // TODO: this is not recommended as it can be rate-limited (2500 per minute)
      // https://www.braze.com/docs/user_guide/data_and_analytics/user_data_collection/best_practices/
      const response = await fetch(`${env.BRAZE_API_URL}/users/export/ids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.BRAZE_API_KEY}`,
        },
        body: JSON.stringify({
          email_address: userEmail.toLowerCase(),
          fields_to_export: ["email_subscribe", "external_id"],
        }),
      });

      const brazeTrackUserSchema = z.object({
        users: z
          .array(
            z.object({
              external_id: z.string(),
              email_subscribe: z.string(),
            }),
          )
          .min(1),
      });

      if (!response.ok) {
        throw new Error(
          `Invalid response from Braze's getUser ${response.status}`,
          { cause: response },
        );
      }

      const responseJson: unknown = await response.json();
      const usersParse = brazeTrackUserSchema.safeParse(responseJson);

      if (!usersParse.success) {
        // don't throw error as braze is just tracking
        return undefined;
      }

      const user = usersParse.data.users[0];

      if (user == null) {
        // don't throw error as braze is just tracking
        return undefined;
      }

      return marketingUserSchema.parse({
        externalId: user.external_id,
        subscribed: user.email_subscribe,
      });
    } catch (error) {
      throw new Error("Failed to getUser from Braze", { cause: error });
    }
  }

  public async sendEvent<T extends MarketingEventType>(
    event: T,
    eventData: MarketingEventData[T],
  ): Promise<void> {
    const preparedBrazeData = this.buildBrazeEventData(event, eventData);

    await this.sendRequest(
      `${env.BRAZE_API_URL}/users/track`,
      preparedBrazeData,
    );
  }

  public async updateUserAttributes<T extends MarketingAttributeType>(
    attributeType: T,
    attributeData: MarketingAttributeData[T],
  ): Promise<void> {
    const preparedBrazeData = this.buildBrazeAttributeData(
      attributeType,
      attributeData,
    );

    await this.sendRequest(
      `${env.BRAZE_API_URL}/users/track`,
      preparedBrazeData,
    );
  }

  private async sendRequest(url: string, data: object) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.BRAZE_API_KEY}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          `Request to Braze failed with status ${response.status}`,
        );
      }
    } catch (error) {
      throw new Error("Failed to send request to Braze", {
        cause: error,
      });
    }
  }

  private buildBrazeEventData<T extends MarketingEventType>(
    event: T,
    eventData: MarketingEventData[T],
  ): BrazeEventData[T] {
    const preparedBrazeData: BrazeEventData = {
      [MarketingEventType.Purchase]: {
        purchases: [
          {
            external_id: eventData.externalId,
            app_id: env.BRAZE_LINGO_DATA_PLATFORM_ID,
            name: "purchase",
            time: new Date().toISOString(),
            email: eventData.email,
            product_id: eventData.product.productId,
            currency: eventData.product.currency,
            price: eventData.product.price,
            properties: {
              product_type: eventData.product.properties.productType,
            },
          },
        ],
        events: [
          {
            name: "purchase",
            time: new Date().toISOString(),
            external_id: eventData.externalId,
            email: eventData.email,
            app_id: env.BRAZE_LINGO_DATA_PLATFORM_ID,
            properties: eventData.product,
          },
        ],
      },
    };

    return preparedBrazeData[event];
  }

  private buildBrazeAttributeData<T extends MarketingAttributeType>(
    event: T,
    attributeData: MarketingAttributeData[T],
  ): BrazeUserAttributeData[T] {
    const brazeDataBuilder: {
      [K in MarketingAttributeType]: (
        data: MarketingAttributeData[K],
      ) => BrazeUserAttributeData[K];
    } = {
      [MarketingAttributeType.Subscription]: (data) => ({
        attributes: [
          {
            external_id: data.externalId,
            email_subscribe: data.subscriptionStatus,
            subscription_groups: [
              {
                subscription_group_id: env.BRAZE_SUBSCRIPTION_NEWS_CONTENT,
                subscription_state: data.subscriptionStatus,
              },
              {
                subscription_group_id: env.BRAZE_SUBSCRIPTION_PRODUCT_UPDATES,
                subscription_state: data.subscriptionStatus,
              },
              {
                subscription_group_id: env.BRAZE_SUBSCRIPTION_SPECIAL_OFFERS,
                subscription_state: data.subscriptionStatus,
              },
            ],
          },
        ],
      }),
      [MarketingEventType.Purchase]: (data) => ({
        attributes: [
          {
            external_id: data.externalId,
            email: data.email,
            sku_name: data.sku,
            promo_codes: { add: [data.promoCode] },
          },
        ],
      }),
    };

    if (brazeDataBuilder[event] == null) {
      throw new Error(`Invalid Marketing Attribute Event Type: ${event}`);
    }

    return brazeDataBuilder[event](attributeData);
  }
}
