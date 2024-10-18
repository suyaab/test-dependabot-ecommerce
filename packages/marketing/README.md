# Marketing

## Overview

Marketing package is one of the ways for this team to manager user's and their respective data throughout the entire
purchase lifecycle _(pre-purchase, during purchase, and post-purchase)_

**Currently, Lingo does not have a CRM (Braze is not a CRM).**

However, Lingo uses Braze _like_ a CRM, thus we need to treat Braze like one.

## `MarketingService`

This service exposes the ability to create a `createUser`, retrieve users with either `getUser` or `getUserById`.

This might look like:

```ts
const marketingService = ServiceLocator.getMarketingService();
const marketingUser = await marketingService.getUser(customer.email)
```

Also, this service allows for updates to the user via various events that occur during the user lifecycle. The two
updates that might occur are either:

1. a user event that triggers an **Update to User Attributes**

   example:
   ```ts
   const marketingService = ServiceLocator.getMarketingService();
   
   await marketingService.updateUserAttributes(MarketingAttributeType.Purchase, {
    externalId: customer.externalId,
    sku: order.lineItems[0].product.sku,
   })
   ```
2. a user event that triggers a **Marketing Event**

   example:
   ```ts
   const marketingService = ServiceLocator.getMarketingService();
   
   await marketingService.sendEvent(MarketingEventType.Purchase, {
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
   })
   ```

## Future Improvements

1. Is it possible (a good idea?) to encapsulate `@braze/web-sdk` dependency into this package. Furthermore, does it make
   sense / possible to be able to unify `createUser` to handle both the Braze SDK and the Braze API to automatically
   determine what should be used? OR, can we use `import "server-only"` and `import "client-only"` to have imports
   like: `@ecommerce/marketing/server` and `@ecommerce/marketing/client`?
