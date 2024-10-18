// "use client";

// import { postEmailConsent } from "~/app/actions/postEmailConsent";
// import getOrCreateExternalId from "../getOrCreateExternalId";
// import {
//   CustomAttributes,
//   Events,
//   SignupSources,
//   Subscriptions,
// } from "./constants";
// import updateUserEmailSubscription from "./subscription";
// import { BrazeSDKServiceConfig, SignupSource } from "./types";

// /**
//  * Creates a new Braze user with a signup source.
//  * @param config - The Braze SDK service configuration.
//  * @param email - The email of the user.
//  * @param signUpSource - The signup source of the user.
//  * @returns The external ID of the created user.
//  * @throws Error if the configuration is missing or invalid, or if the parameters are invalid.
//  */
// export async function signup(
//   config: BrazeSDKServiceConfig,
//   email: string,
//   signUpSource: SignupSource,
// ) {
//   try {
//     const { externalId, subscribed } = await getOrCreateExternalId(email);

//     if (email == null) {
//       throw new Error("Invalid signup parameter");
//     }

//     // TODO: Determine how to best use SDK with API
//     const { changeUser, getUser, logCustomEvent, requestImmediateDataFlush } =
//       await import("@braze/web-sdk");

//     changeUser(externalId);
//     const brazeUser = getUser();

//     if (brazeUser == null) {
//       throw new Error("Braze user is null");
//     }

//     brazeUser.addAlias(email, "signup_email");
//     brazeUser.addAlias(externalId, "external_id");
//     brazeUser.setEmail(email);

//     brazeUser.setCustomUserAttribute(
//       CustomAttributes.FIRST_SIGNUP_DATE,
//       new Date(),
//     );

//     brazeUser.addToCustomAttributeArray(
//       SignupSources.BRAZE_SIGNUP_SOURCE,
//       signUpSource,
//     );
//     logCustomEvent(Events.SIGNUP);

//     const shouldUpdateSubscriptionStatus =
//       subscribed !== Subscriptions.OPTED_IN;

//     if (shouldUpdateSubscriptionStatus) {
//       brazeUser.setEmailNotificationSubscriptionType(Subscriptions.SUBSCRIBED);
//       updateUserEmailSubscription(config, brazeUser, true);
//     }

//     requestImmediateDataFlush();

//     await postEmailConsent(externalId);
//   } catch (error) {
//     throw new Error(`Braze web sdk email signup failed`, { cause: error });
//   }
// }
