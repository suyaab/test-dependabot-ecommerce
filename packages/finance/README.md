# Finance

## Overview

Finance package is the primary way for this team to create and retrieve payments. To create a payment, you must first by
creating a `CheckoutSession` (_could also be called a `PaymentIntent` or a `CheckoutIntent` as it represents the user
intention to pay, but without performing the actual pre-authorization yet_)

## `CheckoutService`

This service exposes the ability to `createCheckoutSession`, `getCheckoutSession`, and update said `CheckoutSession`
with a variety of user inputted data (Customer information, Billing information, etc.).

Once the `CheckoutSession` is ready to be **pre-authorized** (ie: see a pending charge on the credit card), given the
existing implementation of PayOn, you can `window.wpwl?.executePayment("wpwl-container-card");` (this makes the
assumption that the PayOn script, options, and styles have been applied to the page).

Once the payment has been executed via PayOn _(or whatever Payment Provider is being used)_, you can
use `getCheckoutPayment` to retrieve the newly created `Payment` object.

> [!WARNING]  
> `getCheckoutPayment` is a utility function to help usages of this package correlate a `CheckoutSession` to
> a `payment`; however **IT CAN ONLY BE CALLED/INVOKED ONE TIME**. Once the invoking code retrieves the `Payment`
> object, you must use the `Payment.id` to retrieve again

## Usage

```ts
// GIVEN: a checkout session is created
const checkoutService = ServiceLocator.getCheckoutService();
const checkoutSession = await checkoutService.createCheckoutSession(
    orderNumber,
    cart.totalPrice,
    cart.currency,
);

// WHEN: a checkout session pre-authorization is invoked by the payment provider
window.wpwl?.executePayment("wpwl-container-card");

// THEN: the payment can be retrieved using the `CheckoutSession.id`
const checkoutPayment = await checkoutService.getCheckoutPayment(checkoutSessionId);
```

## `PaymentGateway`

This service exposes the ability to `getPayment` and `getSavedPaymentMethod`, but more importantly the ability
to `authorizeRecurringPayment`.

1. `getPayment` is useful when retroactively querying for a payment _(ie: showing an order details page)_
2. `getSavedPaymentMethod` is useful for retrieving a user's saved card details _(ie: showing the user the brand and
   expiration date of credit card under their saved payment methods)_
3. `authorizeRecurringPayment` is useful as it has the ability to create new pre-authorizations using an
   existing `paymentMethodId` _(ie: extremely useful when creating new orders for a user's subscription)_

```ts
// GIVEN: a payment exists
const checkoutService = ServiceLocator.getCheckoutService();
const checkoutSession = await checkoutService.createCheckoutSession(
    orderNumber,
    cart.totalPrice,
    cart.currency,
);

// THEN: the payment can be retrieved using the `Payment.id`
const checkoutPayment = await checkoutService.getPayment("payment-id");

// OR THEN: the payment method can be retrieved using the `PaymentMethod.id`
const paymentMethod = await checkoutService.getSavedPaymentMethod("payment-method-id");
```

## Future Improvements

1. Remove the helper functions `postPayonData` and `getPayonData` as the duplication is relatively minor and the
   indirection and abstraction levels (in my opinion) don't provide much value.
2. Once express pay is built and cleaned up, ensure `paymentMethodBrandSchema` and `paymentMethodTypeSchema` properly
   align and make sense. I think it would be beneficial to capture the credit card brand _(ie: VISA, MASTERCARD, etc.)_
   as the brand and save the type as Express Pay types _(ie: APPLE PAY, GOOGLE PAY, PAYPAL, etc.)_. Thus, we would
   remove `APPLE_PAY`, `GOOGLE_PAY`, and `PAYPAL` from `paymentMethodBrandSchema`)
3. Add a specific [`README.md`](./integrations/payOn/README.md) for all the unique issues, details, etc.
