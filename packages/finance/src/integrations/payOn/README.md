# PayOn

## Overview

[PayOn](https://riverty.docs.oppwa.com/) is a third party Payment Provider which is a partner/works well with Arvato.

PayOn provides a few valuable things:

1. The ability to securely capture user credit card details (and save them for future use)
2. The ability to pre-authorize and charge credit cards
3. The ability to use saved credit card details for another, future transaction

## How it works

PayOn is able to securely receive a user's credit card details via an iframe rendered on the page. This paradigm is
called [COPYandPAY](https://riverty.docs.oppwa.com/integrations/widget/api). The high level summary is that:

1. the application renders this script on the page
2. the user sees an iframe with inputs for credit card details (Name on the Card, Card Number, expiration date, etc)
3. the application has the ability to '_execute_' payment (`window.wpwl?.executePayment("wpwl-container-card");`) (more
   information under [`executePayment`](https://riverty.docs.oppwa.com/integrations/widget/api)
4. the application can use a PayOn API endpoint to retrieve the payment details

> [!IMPORTANT]  
> To be able to render the iframe on the page, the application **MUST** have previously called `createCheckoutSession`,
> as PayOn requires an active session to render the iframe.

> [!NOTE]  
> It is possible to style this PayOn iframe via CSS selectors, please
> see [`payon.css`](apps/web/src/app/style/payon.css) and
> their [documentation](https://riverty.docs.oppwa.com/integrations/widget/customization) for more information.

## Registrations

As mentioned above, PayOn provides the ability to save credit card details for future use. In the terms of this
Ecommerce team, we refer to that as a saved `PaymentMethod`. PayOn refers to that as a `Registration`.

In order to instruct PayOn to save this registration, you must pass in `createRegistration: true` when creating
the `CheckoutSession`.

> [!WARNING]  
> It is possible that when executing the iframe and retrieving the payment that it fails due to status
> code `100.150.203` (`registration is not valid, probably initially rejected`). You might think that it is vague, and
> indeed it is.
>
> This is what error is thrown when a generic exception occurs during the `createRegistration` flow. Most of the time,
> it's due to the `CheckoutSession` missing user data. Often times, it's related to missing
> either `givenName`, `surname`, `phone`, `email`, or `billingAddress`.

Secondly, when creating a registration, you must also pass:

```json
{
  "standingInstruction": {
    "source": "CIT",
    "mode": "INITIAL",
    "type": "RECURRING"
  }
}
```

There is a greater amount of detail on each parameter we pass during the creation of a `CheckoutSession`
in [confluence](https://lingo-abbott.atlassian.net/wiki/spaces/BLUEBIRD/pages/24510820/PayOn+Integration).

## Rate Limits / Throttling

PayOn is not the most modernized, highly available Payment Provider, thus, our application must successfully handle
repeated calls to PayOn API routes to avoid getting errors. There is more information on `Throttling` in
their [documentation](https://riverty.docs.oppwa.com/reference/parameters); however, just take note that when
repeatedly reloading / refreshing a page which invokes a PayOn API, there might be throttling issues (even in
**production**!)

## PayPal

### Overview

PayPal is rendered on page using a PayOn iframe. However, it is not directly integrated with PayOn like Apple Pay and
Google Pay (meaning a lot of the configuration is actually coming from the PayPal documentation and also is connected on
the back end directly (why Taylor says that PayPal isn't directly connected ... I don't know the details, but I know
something is different).

There are two types of PayPal (`PAYPAL` and `PAYPAL_CONTINUE`). One of them opens a popup, and one does a redirect. I
think we originally built UK with a popup and with the 3DS refactors, I think we changed it to the redirect.

### The Problem

PayPal documentation states that `onShippingChange` hook is not available for creating subscriptions (another, yet
different term for a recurring payment (Registration, Payment Method, etc). This means that we cannot *hook* into PayPal
events for when the user selects a shipping address (I am not aware of any configuration that limits addresses either).
But, this means a user *in theory* could purchase with any shipping or billing address, which isn't allowed.

### The Old Solution

The way this worked previously in the UK was that we stopped pre-authorizing the `CheckoutSession` at the time of
PayOn's iframe execution, and we moved it to the processing page. This was extremely complicated and not worth doing
again (we suddenly have to handle 3DS ourselves with various redirects). This is what is currently taking orders in the
UK though (and it's working).

### Possible New Solution

Given the way the US has set up the `CheckoutAccordion` with `shipping address` being it's own section, we might be able
to "turn off" the shipping address from PayPal (similar to how we've done that with Apple Pay) and only use it for
billing address / payment details.

The other option to consider is that we can perform a second Shipping Address country verification to ensure we don't
allow users to ship to an invalid country, but this means for those fail cases, they would see an authorization on their
card (but would never be charged). I think this is acceptable for how little this might happen (and we could ensure it's
a good visible error), but would have to get the OK for Taylor

### Useful Resources

[PayOn Documentation](https://riverty.docs.oppwa.com/integrations/widget/fast-checkout#payPalFastCheckout)

[PayPal Documentation](https://developer.paypal.com/sdk/js/reference/)

## Apple Pay

### Overview

Apple Pay is rendered on the checkout page using a PayOn iframe. When the iframe is executed, the Apple Pay modal will
open up the Apple Pay dialog. Once the payment is complete, the PayOn iframe action will be redirected to.

All configuration will be in the `payon/options.js` under the `applePay` object. These options can be found on
the [PayOn documentation](https://riverty.docs.oppwa.com/integrations/widget/apple-pay).

### Discount Codes

One flaw with PayOn's implementation of Apple Pay is that once the checkout session has been created and the iframe
rendered on the screen, the Apple Pay modal will **NOT** automatically update if the `CheckoutSession` has been updated
**AFTER** the page load.

This is a problem when the user has modified the `CheckoutSession` price _(for example: with a discount code)_ and the
modal opens with the incorrect price. This is solved by utilizing the `onPaymentMethodSelected` as this is called every
time the user's card changes (which happens on load!).

### Shipping Address

Currently, with the three-step accordion, this team does not use Apple Pay to collect Shipping Address from the user.
However, at one point it was which added some complexity with managing invalid shipping countries. If, for example, you
were interested in limiting the Apple Pay modal to only allow United States (USA) shipping addresses, you could add:

```js
var wpwlOptions = {
    applePay: {
        async onShippingContactSelected(shippingContact) {
            const checkout = await getCheckout();

            if (shippingContact.countryCode !== "US") {
                // We want to restrict the choice to ship to other countries
                return {
                    newTotal: {
                        label: DISPLAY_NAME,
                        amount: checkout.amount,
                    },
                    errors: [
                        {
                            code: "shippingContactInvalid",
                            contactField: "countryCode",
                            message: "Invalid country, we only ship within the US",
                        },
                    ],
                };
            }

            return {
                newTotal: {
                    label: DISPLAY_NAME,
                    amount: checkout.amount,
                },
            };
        },
    }
}
```

to the `wpwlOptions`.

### `onPaymentAuthorized`

If you are interested in executing any business logic after the authorization has completed, but before the page has
redirected, you can utilize the `onPaymentAuthorized` to make async API calls.

## Resources

[Documentation](https://riverty.docs.oppwa.com/)

[COPYandPAY](https://riverty.docs.oppwa.com/integrations/widget)

[API Reference](https://riverty.docs.oppwa.com/reference/parameters)

[Result Codes](https://riverty.docs.oppwa.com/reference/resultCodes)

[Test Credit Cards](https://riverty.docs.oppwa.com/tutorials/threeDSecure/TestingGuide)