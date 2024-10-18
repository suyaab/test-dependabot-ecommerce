# Fulfillment Service > Process Shipment Status

## Overview

This function is used as a Webhook from Arvato's shipment/carrier system which informs our systems
that an order is 1. Ready to be shipped, 2. Has shipped, 3. Has been loaded on truck for delivery, 
and 4. Has been delivered.  

The status code we are looking for appears on the request body: `body.payload.shipment.status.code`,
which can be either `READY`, `INTRANSIT`, `OUT`, or `DELIVERED` respectively. 

**Trigger:** `API` via Arvato CXC System
**Log Prefix:** `fs-process-shipment-status`

## Request Body Example

```json
{
  "locale": "en-GB",
  "source": "tnc",
  "payload": {
    "orderId": "USL91MXE0MPB",
    "shipment": {
      "eta": "2024-06-24T13:37:47.000Z",
      "status": {
        "code": "READY",
        "text": "",
        "reason": "IN_TRANSIT",
        "datetime": "2024-06-19T13:38:31.000Z",
        "location": "Hannover",
        "pudoLocation": ""
      },
      "carrier": "PARCELFORCE",
      "content": {
        "items": [
          {
            "title": "Lingo glucose biosensor program",
            "variant": "",
            "imageUrl": "https://3fb913159dc81116c61b-92c987132599058d6c775a4d75c322ca.ssl.cf3.rackcdn.com/puck-w14SRwni.png",
            "quantity": 1
          }
        ],
        "grossAmount": "",
        "currencyCode": "GBP"
      },
      "signature": "Signature",
      "trackingId": "PBSL0782435001",
      "creationDate": "2024-06-10T08:44:35.524Z",
      "deliveryType": "customer",
      "consignmentId": "LINGO",
      "deliverySubType": "default",
      "carrierTrackingURL": "https://www.dhl.de/de/privatkunden.html?piececode=PBSL0782435001"
    }
  },
  "traceId": "37d93b30-2e41-11ef-9bd0-8b4e91169647",
  "clientId": "C100107",
  "channelMeta": {
    "channel": "webhook",
    "webhookUrl": "https://api-q.hellolingo.com/dtcorder/dtc-order-carrier-status"
  },
  "referenceIds": {
    "orderId": "GBL920750754",
    "trackingId": "PBSL0782435001"
  },
  "correlationId": "586e8fe9-2822-42fd-b929-1ffe1694167a",
  "notificationGroup": "8",
  "payloadValidation": {
    "schemaName": "StatusUpdate",
    "pathToSpecification": "webhook/webhook.yaml"
  }
}
```