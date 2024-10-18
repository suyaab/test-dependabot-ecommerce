import { ShipmentStatusCode } from "@ecommerce/commerce";

export const ArvatoShipmentReason = {
  OUT: "OUT_FOR_DELIV",
  RETURN: "RETURN",
  INTRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
} as const;

export function getShipmentStatus(
  arvatoShipmentCode: string,
): ShipmentStatusCode {
  switch (arvatoShipmentCode) {
    // we use Order status as `Ready` for `Out for delivery` because CommerceTools doesn't have this built in
    case ArvatoShipmentReason.OUT:
      return "Ready";

    case ArvatoShipmentReason.RETURN:
      return "Pending";

    case ArvatoShipmentReason.INTRANSIT:
      return "Shipped";

    case ArvatoShipmentReason.DELIVERED:
      return "Delivered";

    default:
      throw new Error(`Invalid Arvato Shipment Reason: ${arvatoShipmentCode}`);
  }
}
