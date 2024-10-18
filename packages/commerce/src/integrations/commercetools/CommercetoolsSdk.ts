import {
  ByProjectKeyRequestBuilder,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";
import {
  ClientBuilder,
  createAuthForClientCredentialsFlow,
  createHttpClient,
  Middleware,
  MiddlewareRequest,
  MiddlewareResponse,
  Next,
} from "@commercetools/sdk-client-v2";

import { getLogger } from "@ecommerce/logger";

import { env } from "./env";

export type CommercetoolsSdkClient = ByProjectKeyRequestBuilder;

function createLoggerMiddleware(): Middleware {
  return (next: Next): Next =>
    (request: MiddlewareRequest, response: MiddlewareResponse) => {
      const logger = getLogger({ prefix: "commercetools-sdk" });

      logger.trace({ request }, "CommerceTools Request");

      if (response.statusCode === 404) {
        logger.debug({ response }, "CommerceTools SDK 404 Response");
      } else if (response.statusCode >= 400) {
        logger.error({ response }, "CommerceTools SDK Error Response");
      } else {
        logger.trace({ response }, "CommerceTools SDK Response");
      }

      next(request, response);
    };
}

export default abstract class CommercetoolsSdk {
  private static client: CommercetoolsSdkClient | undefined;

  static getClient(): CommercetoolsSdkClient {
    if (CommercetoolsSdk.client == null) {
      // TODO: Upgrade CommerceTools to v3 SDK when out of beta
      // https://github.com/commercetools/commercetools-sdk-typescript/tree/master/packages/sdk-client-v3
      const client = new ClientBuilder()
        .withProjectKey(env.CTP_PROJECT_KEY)
        .withMiddleware(
          createAuthForClientCredentialsFlow({
            host: env.CTP_AUTH_URL,
            projectKey: env.CTP_PROJECT_KEY,
            credentials: {
              clientId: env.CTP_CLIENT_ID,
              clientSecret: env.CTP_CLIENT_SECRET,
            },
            oauthUri: "/oauth/token",
            scopes: [`manage_project:${env.CTP_PROJECT_KEY}`],

            // avoid nextjs caching
            fetch: (url: string, options?: RequestInit) =>
              fetch(url, { cache: "no-store", ...options }),
          }),
        )
        .withMiddleware(
          createHttpClient({
            host: env.CTP_API_URL,
            // avoid nextjs caching
            fetch: (url: string, options?: RequestInit) =>
              fetch(url, { cache: "no-store", ...options }),
          }),
        )
        .withMiddleware(createLoggerMiddleware())
        .build();

      // V2 SDK Builder (custom middleware doesn't log responses)
      // const client = new ClientBuilder()
      //   .withClientCredentialsFlow({
      //     host: env.CTP_AUTH_URL,
      //     projectKey: env.CTP_PROJECT_KEY,
      //     credentials: {
      //       clientId: env.CTP_CLIENT_ID,
      //       clientSecret: env.CTP_CLIENT_SECRET,
      //     },
      //     oauthUri: "/oauth/token",
      //     scopes: [`manage_project:${env.CTP_PROJECT_KEY}`],
      //   })
      //   .withHttpMiddleware({
      //     host: env.CTP_API_URL,
      //     fetch,
      //   })
      //   .withLoggerMiddleware()
      //   .withAfterExecutionMiddleware(createLoggerMiddleware())
      //   .build();

      const apiRoot = createApiBuilderFromCtpClient(client);

      CommercetoolsSdk.client = apiRoot.withProjectKey({
        projectKey: env.CTP_PROJECT_KEY,
      });
    }

    return CommercetoolsSdk.client;
  }
}
