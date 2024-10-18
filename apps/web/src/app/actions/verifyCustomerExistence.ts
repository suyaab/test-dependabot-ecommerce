"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ServiceLocator as AuthServiceLocator } from "@ecommerce/auth";
import { ServiceLocator } from "@ecommerce/commerce";
import { getLogger } from "@ecommerce/logger";

import ActionException from "~/app/actions/ActionException";

export default async function verifyCustomerExistence(email: string) {
  const logger = getLogger({
    prefix: "web:actions:verifyCustomerExistence",
    headers: headers(),
  });

  let redirectUrl = "";
  try {
    logger.debug({ email }, "Checking if the customer exists in the system.");
    const authService = AuthServiceLocator.getAuthService();
    const isUserExistsInAuth0 = await authService.checkUserExist(email);

    if (isUserExistsInAuth0) {
      logger.debug(
        { email },
        "Customer found in Auth0. Redirecting to login page.",
      );
      redirectUrl = "/api/auth/login";
    } else {
      const customerService = ServiceLocator.getCustomerService();
      const customer = await customerService.getCustomerByEmail(email);

      if (customer == null) {
        logger.debug(
          { email },
          "Customer does not exist in Commerce Engine. Redirecting to create account page.",
        );
        // INFO: We do not have a create account page in US yet--404 page!
        redirectUrl = "/create-account";
      } else {
        logger.debug(
          { email },
          "Customer found in Commerce Engine. Redirecting to sign up page.",
        );
        redirectUrl = "/api/auth/signup";
      }
    }
  } catch (error) {
    logger.error(error, "Error occurred verifying customer existence");
    throw new ActionException("Error occurred verifying customer existence", {
      cause: error,
    });
  }
  redirect(redirectUrl);
}
