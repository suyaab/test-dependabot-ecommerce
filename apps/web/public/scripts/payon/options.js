/* global Cookies */
/* eslint-disable no-console */

const DISPLAY_NAME = "HelloLingo";

/**
 * Retrieve PayOn checkout session
 *
 * This is used by express pay to retrieve the most up-to-date price
 * from the checkout session.  This is important as the checkout session
 * price may have been updated due to a Promo Code since the page has loaded.
 *
 * @returns {Promise<{amount, currency}>}
 */
async function getCheckout() {
  try {
    const response = await fetch("/api/checkout/apple-pay/session", {
      method: "POST",
      body: JSON.stringify({
        checkoutSessionId: window?.wpwl?.checkout?.id,
      }),
    });

    const body = await response.json();

    return {
      amount: body.amount,
      currency: body.currency,
    };
  } catch (error) {
    console.log(error);
  }
}

const options = {
  style: "plain",
  showCVVHint: true,
  showPlaceholders: false,
  brandDetection: true,
  brandDetectionPriority: ["VISA", "MASTER", "AMEX"],
  forceCardHolderEqualsBillingName: false,
  disableSubmitOnEnter: true,
  errorMessages: {
    cardHolderError: "Invalid name",
    cvvError: "Invalid security code",
    expiryMonthError: "Invalid expiration date",
    expiryYearError: "Invalid expiration date",
  },
  labels: {
    cardHolder: "Name on card",
    cvv: "CVC",
    cardNumber: "Card number",
    expiryDate: "Expiration (MM/YY)",
  },
  onReady() {
    const cardHolderDiv = $(".wpwl-group-cardHolder");
    const cardNumberDiv = $(".wpwl-group-cardNumber");
    const expiryDateDiv = $(".wpwl-group-expiry");

    // Move Cardholder Name to Top
    cardHolderDiv.after(cardNumberDiv);

    // Move Expiration after Card Number
    cardNumberDiv.after(expiryDateDiv);

    // Change Buy Now Button Text
    $(".wpwl-button-pay").html("Buy now");
  },

  applePay: {
    version: 14,
    displayName: DISPLAY_NAME,
    currencyCode: "USD",
    countryCode: ["US"],
    merchantIdentifier: "merchant.com.hellolingo.test",
    merchantCapabilities: ["supports3DS", "supportsCredit", "supportsDebit"],
    initiativeContext: "hellolingo.com",
    initiative: "web",
    supportedNetworks: ["masterCard", "visa", "amex"],
    shippingContactEditingMode: "available",
    submitOnPaymentAuthorized: ["billing"],
    requiredBillingContactFields: ["name", "postalAddress"],

    /**
     * PayOn Apple Pay Hook for payment method change
     *
     * This is called whenever the user changes a payment method using the Apple Pay modal
     * This is ALSO called onLoad when the first payment method has been selected.  This is
     * the primary use case as it ensures the Apple Pay modal has the most up-to-date price
     *
     * reference: https://riverty.docs.oppwa.com/integrations/widget/apple-pay
     *
     * @param paymentMethod
     */
    async onPaymentMethodSelected(paymentMethod) {
      const checkout = await getCheckout();

      return {
        newTotal: {
          label: DISPLAY_NAME,
          amount: checkout.amount,
        },
        billingInfo: JSON.stringify(paymentMethod.billingContact),
      };
    },

    /**
     * PayOn Apple Pay Hook for shipping address change
     *
     * This is called whenever the user changes or selects a shipping address.
     * This is important and used to verify that a user is shipping Lingo to
     * a valid Country.
     *
     * reference: https://riverty.docs.oppwa.com/integrations/widget/apple-pay
     *
     * @param shippingContact
     */
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

    /**
     * PayOn Apple Pay Hook for successful payment authorization
     *
     * This function is called whenever the Apple Pay modal has performed
     * a successful pre-authorization.  This function will call a Lingo API
     * to update the cart and the addresses, before the processing page.
     *
     * @param payment
     * @returns {Promise<{status: string}>}
     */
    async onPaymentAuthorized(payment) {
      const cartId = Cookies.get("cart_id");

      if (cartId == null) {
        console.log("Unable to retrieve cartId");

        return {
          status: "FAILURE",
        };
      }

      const response = await fetch(
        "/api/checkout/apple-pay/update-billing-address",
        {
          method: "POST",
          body: JSON.stringify({
            cartId,
            billingAddress: {
              firstName: payment.billingContact.givenName,
              lastName: payment.billingContact.familyName,
              addressLine1: payment.billingContact.addressLines[0],
              addressLine2: payment.billingContact.addressLines[1],
              city: payment.billingContact.locality,
              state: payment.billingContact.administrativeArea,
              postalCode: payment.billingContact.postalCode,
              countryCode: payment.billingContact.countryCode,
            },
          }),
        },
      );

      if (!response.ok) {
        console.error(
          "Unable to update billing address from Apple Pay",
          await response.json(),
        );

        return {
          status: "FAILURE",
        };
      }

      return {
        status: "SUCCESS",
      };
    },
  },
};

// Create global, hoisted variable for PayOn

/* eslint-disable-next-line no-var */
/* eslint-disable no-unused-vars */
var wpwlOptions = options;
