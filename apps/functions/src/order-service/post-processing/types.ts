import { OrderOrigin } from "@ecommerce/commerce";

// TODO: Can we move all of this logic into the fulfillment package?
export interface ArvatoPayload {
  header: {
    correlationId: string;
    eventName: string;
    environment: string;
    businessCode: string;
    applicationCountryCode: string;
  };
  payload: {
    order: {
      orderUpdate: boolean;
      orderNumber: string;
      address: Address[];
      shippingCode: string;
      orderOrigin: OrderOrigin;
      caseId?: string;
      orderDate: string;
      invoiceCopack: boolean;
      subscription: boolean;
      subscriptionId?: string;
      orderPriority: number;
      orderLines: OrderLine[];
      paymentData?: PaymentData;
    };
  };
}

export interface Address {
  customerId?: string;
  typeCode: "SOLD_TO" | "SHIP_TO" | "BILL_TO";
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  phoneNumber?: string;
  customerEmail: string;
  language: string;
}

export interface OrderLine {
  orderLineId: string;
  sku: string;
  itemDescription: string;
  isSet: boolean;
  quantity: number;
  returnableUntil: number;
  imageURL: string;
  linePrices: LinePrice[];
}

export interface LinePrice {
  priceType: string;
  amount: number;
  currency: string;
}

export interface PaymentData {
  ccType: "VISA" | "MC" | "AMEX" | "APPL" | "APAM" | "PAYP";
  ccExpiryDate: string;
  ccPayID: string;
  ccReferenceID: string;
  ccLocID: string;
  Prices: Price[];
}

export interface Price {
  priceType: string;
  amount: number;
  currency: string;
}

export type ArvatoResponse =
  | {
      status: never;
      overallStatus: string;
      trackId: string;
      timestamp: string;
      message: {
        messageId: string;
        status: string;
        detail: {
          code: number;
          error: string;
          reference: string;
        }[];
      }[];
    }
  | {
      httpCode: string;
      status: "success";
      TrackID: string;
    };
