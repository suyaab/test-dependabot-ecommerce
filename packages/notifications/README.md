# Notifications

## Overview

Notifications package is the primary way for this team to communicate with users _(which is only emails today, but could
easily expand in the future)_

## `EmailService`

This service exposes the ability to `sendEmail` which requires a specific email template, a recipient, and user/dynamic
data.

## Usage

```ts
const emailService = ServiceLocator.getEmailService();

await emailService.sendEmail(
    EmailTemplate.CarrierReturn,
    recipient,
    {
        first_name: order.shippingAddress.firstName,
        order_number: order.orderNumber,
    },
);
```

## Future Improvements

1. If we need to create a new form of notifying the user (like sending a text message), we can create a
   new `PhoneService` to handle that!
