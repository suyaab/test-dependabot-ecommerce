// TODO: make server-only when ServiceLocator isn't in same pacakge
// import "server-only";

import { Claims, getSession } from "@auth0/nextjs-auth0";
import { z } from "zod";

import { Customer, ServiceLocator } from "@ecommerce/commerce";

import { AuthService, AuthUser, authUserSchema } from "../Auth";
import { env } from "./env";

const SIGNED_UP_STATUS = "SignedUp";
const NOT_SIGNED_UP = "NotSignedUp";

const graphQLResponse = z.object({
  data: z.object({
    customerAccountStatus: z.object({
      accountStatus: z.enum([SIGNED_UP_STATUS, NOT_SIGNED_UP]),
    }),
  }),
});

const translateAuthUser = (user: Claims): AuthUser => {
  return authUserSchema.parse({
    externalId: user["https://hellolingo.com/lingo_id"] as string,
    regionCode: (user["https://hellolingo.com/region_code"] ?? "UK") as string,
    shippingCountryCode: (user[
      "https://hellolingo.com/shipping_country_code"
    ] ?? "GB") as string,
    email: user.email as string,
  });
};

export default class Auth0Provider implements AuthService {
  async getUser(): Promise<AuthUser | undefined> {
    const session = await getSession();
    if (session?.user == null) {
      return undefined;
    }

    return translateAuthUser(session.user);
  }

  async getAuthenticatedCustomer(): Promise<Customer | undefined> {
    const user = await this.getUser();
    if (user == null) {
      return undefined;
    }

    const customerService = ServiceLocator.getCustomerService();
    return customerService.getCustomerByExternalId(user.externalId);
  }

  async checkUserExist(email: string): Promise<boolean> {
    const query = `
    query ($email: String!) {
      customerAccountStatus(email: $email) {
        accountStatus
      }
    }
  `;
    const variables = { email };
    const graphqlURL = `${env.LINGO_APP_GRAPHQL_ENDPOINT}?subscription-key=${env.LINGO_APP_API_KEY}`;
    try {
      const response = await fetch(graphqlURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
      });

      const validatedResponse = graphQLResponse.safeParse(
        await response.json(),
      );

      if (!validatedResponse.success) {
        throw new Error("GraphQL errors:", {
          cause: validatedResponse?.error,
        });
      }
      const {
        data: {
          customerAccountStatus: { accountStatus },
        },
      } = validatedResponse.data;
      return accountStatus === SIGNED_UP_STATUS;
    } catch (error) {
      throw new Error("Error checking user in Auth0:", { cause: error });
    }
  }
}
