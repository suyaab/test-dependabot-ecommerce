# Consent

## Overview

Consent package is the primary way for this team to collect legal / marketing consent for users

## `ConsentManager`

This service exposes the ability to `getConsent` and `postConsent`, effectively allow to create and retrieve user
consents.

## Usage

```ts
const consentManager = ServiceLocator.getConsentManager();
await consentManager.postConsents("some-collection-point", "external-id", true);
```

Or `getConsent` for a specified user's `externalId`

```ts
const consentManager = ServiceLocator.getConsentManager();
const consents = await consentManager.getConsents(customer.externalId);
```

## Future Improvements

1. Remove the exports for `SUBSCRIBED_CONSENT_STATUSES`, `UNSUBSCRIBED_CONSENT_STATUSES`, and the interface
   function `getGlobalMarketingPurposeIds` to help tidy the `consent` package's dependency on `OneTrust`. Doing this
   would change how the `update-marketing-preferences` operates, but could solve by possibly introducing a new function
   that exposes less implementation details (either using existing `getConsent` or a new function like `checkConsent`
   which validates an existing user's `externalId` and a consent purpose)
