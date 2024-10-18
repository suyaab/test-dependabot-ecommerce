import { redirect } from "next/navigation";

import { ServiceLocator } from "@ecommerce/auth";
import { getShopUrlByEnv } from "@ecommerce/utils";

import { env } from "~/env";

export async function authRegionCheck() {
  const authService = ServiceLocator.getAuthService();
  const authUser = await authService.getUser();

  if (authUser == null) {
    throw new Error("User is not authenticated");
  }

  // TODO: this won't scale let's rethink
  if (authUser.regionCode === "UK") {
    redirect(getShopUrlByEnv(env.LINGO_ENV) + "/account");
  } else if (authUser.regionCode !== "US") {
    throw new Error(`Unsupported region code: "${authUser.regionCode}"`);
  }
}
