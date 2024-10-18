import { z } from "zod";

import { addressSchema, carrierSchema } from "@ecommerce/utils";

import { lineItemProductSchema } from "./Products";

export const orderLineItemSchema = z.object({
  product: lineItemProductSchema,
  name: z.string(), // TODO: should this live under product?
  quantity: z.number(),
  price: z.number(),
  totalNet: z.number(),
  totalDiscount: z.number(),
  taxRate: z.number(),
  taxAmount: z.number(),
  totalGross: z.number(),
});

/**
 * A line item on an order
 *
 * - product: subset of the product associated with the line item
 * - name: name of the product
 * - quantity: how many of this product are in the line item
 * - price: price of the product before discounts
 * - totalNet: price - tax - discounts
 * - totalDiscount: total discount for the line item
 * - taxRate: tax rate (decimal) for the line item
 * - taxAmount: tax amount in cents for the line item
 * - totalGross: total amount grossed in cents which includes taxes
 */
export type OrderLineItem = z.infer<typeof orderLineItemSchema>;

export const lineItemDraftSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
});

export type LineItemDraft = z.infer<typeof lineItemDraftSchema>;

export const orderNumberSchema = z.custom<`${"USL" | "GBL"}${number}`>();
export type OrderNumber = z.infer<typeof orderNumberSchema>;

export const orderStatusCodeSchema = z.union([
  z.literal("Open"),
  z.literal("Confirmed"),
  z.literal("Complete"),
  z.literal("Cancelled"),
]);

/**
 * Order Status Code represents the order's current order state
 *
 * * Open: order has been created
 * * Confirmed: order has been received by arvato
 * * Complete: order has been delivered (TODO)
 * * Cancelled: order has been cancelled
 */
export type OrderStatusCode = z.infer<typeof orderStatusCodeSchema>;

export const paymentStatusCodeSchema = z.union([
  z.literal("Pending"), // pending authorization or charge
  z.literal("Paid"), // successful charge
  z.literal("BalanceDue"), // ???
  z.literal("CreditOwed"), // refund
  z.literal("Failed"), // authorization or charge has failed
]);

/**
 * Payment Status Code represents the order's current payment state
 *
 * * Pending: payment is pending authorization or charge (TODO)
 * * Paid: payment has been successfully charged
 * * BalanceDue: currently represents failure (TODO REMOVE ???)
 * * CreditOwed: refund
 * * Failed: authorization or charge has failed (TODO)
 */
export type PaymentStatusCode = z.infer<typeof paymentStatusCodeSchema>;

export const shipmentStatusCodeSchema = z.union([
  z.literal("Pending"),
  z.literal("Shipped"),
  z.literal("Ready"),
  z.literal("Delivered"),
]);

/**
 * Shipment Status Code represents the order's current shipment state
 *
 * * Pending: order hasn't been shipped yet, but will be (TODO)
 * * Shipped: when leaves warehouse
 * * Ready: out for delivery
 * * Delivered: when the package has arrived at destination
 */
export type ShipmentStatusCode = z.infer<typeof shipmentStatusCodeSchema>;

export const orderSchema = z.object({
  id: z.string(),
  version: z.number(),
  createdAt: z.string(),
  orderNumber: orderNumberSchema,
  customerId: z.string(),
  customerEmail: z.string().optional(),

  // statuses
  status: orderStatusCodeSchema,
  paymentStatus: paymentStatusCodeSchema.optional(),
  shipmentStatus: shipmentStatusCodeSchema.optional(),

  lineItems: orderLineItemSchema.array().min(1),

  // addresses
  billingAddress: addressSchema.optional(),
  shippingAddress: addressSchema,
  shippingMethod: carrierSchema.optional(),

  // prices
  totalPrice: z.number(), // Price of all line items, could include tax and productDiscount(s)
  totalNet: z.number(), // totalGross - tax
  totalTax: z.number(), // Total tax for the order
  totalGross: z.number(), // Total gross = (totalPrice + tax)  - discount

  currencyCode: z.string(),

  caseId: z.string().optional(),
  discountCodeId: z.string().optional(),
});

/**
 * An Orders holds all user and product information about an Order
 *
 * id: the order identifier
 * version: the concurrency version
 * createdAt: date which the order was created
 * orderNumber: the order number associated (ie: USL9191919)
 * customerId: the customer id associated with the order
 * customerEmail: the customer email associated with the order
 * status: the order status
 * paymentStatus: represents the current payment state
 * shipmentStatus: represents the current shipment state
 * lineItems: all the line items attached to the order
 * billingAddress: the billing address (Address type)
 * shippingAddress: the shipping address (Address type)
 * shippingMethod: the method of shipping
 * totalPrice: the price of all line items (discounted value)
 * totalNet: the total price less taxes
 * totalTax: the total tax for the order
 * currencyCode: currency code
 * - caseId: the ID used by Customer Service to track customer cases
 * **(note this is set on customer's Shipping Address Company field)**
 */
export type Order = z.infer<typeof orderSchema>;

/**
 * The different events that can be used to update an order
 */
export enum OrderStatusType {
  Order = "Order",
  Payment = "Payment",
  Shipment = "Shipment",
}

export interface OrderStatusData {
  [OrderStatusType.Order]: OrderStatusCode;
  [OrderStatusType.Payment]: PaymentStatusCode;
  [OrderStatusType.Shipment]: ShipmentStatusCode;
}

export interface OrderService {
  generateOrderNumber(): OrderNumber;

  createOrderFromCart(
    cartId: string,
    cartVersion: number,
    orderNumber: string,
  ): Promise<Order>;

  getOrderById(orderId: string): Promise<Order | undefined>;

  getOrderByOrderNumber(orderNumber: string): Promise<Order | undefined>;

  getAllOrders(customerId: string): Promise<Order[]>;

  getMostRecentOrder(customerId: string): Promise<Order | undefined>;

  updateOrderStatus<T extends OrderStatusType>(
    orderStatusType: T,
    status: OrderStatusData[T],
    orderNumber: string,
    version: number,
  ): Promise<Order | undefined>;
}
