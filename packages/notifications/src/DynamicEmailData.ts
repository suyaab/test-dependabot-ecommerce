import { EmailTemplate } from "./EmailTemplate";

export interface DynamicEmailData {
  [EmailTemplate.OrderConfirmation]: {
    first_name: string;
    order_number: string;
    estimated_delivery: string;
    delivery_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state_province_region: string;
    postal_code: string;
    country: string;
  };
  [EmailTemplate.ShippingConfirmation]: {
    first_name: string;
    delivery_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state_province_region: string;
    postal_code: string;
    country: string;
    tracking_url: string;
  };
  [EmailTemplate.OrderOutForDelivery]: {
    first_name: string;
    order_number: string;
    delivery_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state_province_region: string;
    postal_code: string;
    country: string;
    tracking_url: string;
  };
  [EmailTemplate.DeliveryConfirmation]: {
    first_name: string;
    order_number: string;
    tracking_url: string;
  };
  [EmailTemplate.OrderCancellation]: {
    first_name: string;
  };
  [EmailTemplate.CarrierReturn]: {
    first_name: string;
    order_number: string;
  };
  [EmailTemplate.PaymentFailure]: {
    first_name: string;
  };
  [EmailTemplate.AccountDetailsUpdated]: never;
  [EmailTemplate.SubscriptionConfirmation]: {
    first_name: string;
    order_number: string;
    estimated_delivery: string;
    delivery_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state_province_region: string;
    postal_code: string;
    country: string;
  };
}

export type RequiredDynamicData<T extends EmailTemplate> =
  DynamicEmailData[T] extends never ? undefined : DynamicEmailData[T];
