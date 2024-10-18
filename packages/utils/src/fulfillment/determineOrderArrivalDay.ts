import { AddressCountryCode, getLocale } from "../location";
import { Carrier } from "./carriers";

interface DeliveryRange {
  deliveryMinimum: number;
  deliveryMaximum: number;
}

type CarrierDeliveryRange = Record<Carrier, DeliveryRange>;

export const COUNTRY_CARRIER_DELIVERY_MAP = new Map<
  AddressCountryCode,
  CarrierDeliveryRange
>([
  [
    "US",
    {
      USPS: { deliveryMinimum: 3, deliveryMaximum: 5 },
      DHL: { deliveryMinimum: 3, deliveryMaximum: 5 },
      UPS: { deliveryMinimum: 3, deliveryMaximum: 5 },
    },
  ],
  [
    "GB",
    {
      USPS: { deliveryMinimum: 0, deliveryMaximum: 0 },
      DHL: { deliveryMinimum: 3, deliveryMaximum: 5 },
      UPS: { deliveryMinimum: 3, deliveryMaximum: 5 },
    },
  ],
  [
    "XI",
    {
      USPS: { deliveryMinimum: 0, deliveryMaximum: 0 },
      DHL: { deliveryMinimum: 3, deliveryMaximum: 5 },
      UPS: { deliveryMinimum: 3, deliveryMaximum: 5 },
    },
  ],
]);

export function determineArrivalDay(
  orderDate: string,
  countryCode: AddressCountryCode,
  carrier: Carrier,
) {
  const formattedOrderDate = new Date(orderDate);
  let deliveryDate;
  // get the hours to determine whether order placed before or after 2pm
  const hours = formattedOrderDate.getHours();
  // get the day that the order was placed (0-6, Sun-Sat)
  const day = formattedOrderDate.getDay();

  const carrierDeliveryInfo = COUNTRY_CARRIER_DELIVERY_MAP.get(countryCode);

  if (carrierDeliveryInfo?.[carrier] == null) {
    throw new Error(`Invalid carrier ${carrier} in country ${countryCode}`);
  }

  const deliveryMin = carrierDeliveryInfo[carrier].deliveryMinimum;
  const deliveryMax = carrierDeliveryInfo[carrier].deliveryMaximum;

  if (deliveryMax == 0 || deliveryMin == 0) {
    throw new Error("Carrier does not deliver in selected country");
  }

  const millisecondsInADay = 24 * 60 * 60 * 1000;

  // set the estimated delivery date depending on the current day of the week and time
  if (
    hours < 14 &&
    (day === 0 || day === 1 || day === 2 || day === 3 || day === 4)
  ) {
    deliveryDate = new Date(
      formattedOrderDate.getTime() + deliveryMin * millisecondsInADay,
    );
  } else if (
    hours >= 14 &&
    (day === 0 || day === 1 || day === 2 || day === 3 || day === 4)
  ) {
    deliveryDate = new Date(
      formattedOrderDate.getTime() + (deliveryMax - 1) * millisecondsInADay,
    );
  } else if (day === 5) {
    deliveryDate = new Date(
      formattedOrderDate.getTime() + deliveryMax * millisecondsInADay,
    );
  } else {
    deliveryDate = new Date(
      formattedOrderDate.getTime() + (deliveryMax - 1) * millisecondsInADay,
    );
  }
  return deliveryDate;
}

export function getArrivalDate(
  orderDate: string,
  countryCode: AddressCountryCode,
  carrier: Carrier,
) {
  const estimatedDelivery = determineArrivalDay(
    orderDate,
    countryCode,
    carrier,
  );

  const estimatedDeliveryDate = new Date(estimatedDelivery);

  const locale = getLocale(countryCode);

  return estimatedDeliveryDate.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function calculateDaysUntilDelivery(
  orderDate: string,
  countryCode: AddressCountryCode,
  carrier: Carrier,
) {
  const estimatedDelivery = determineArrivalDay(
    orderDate,
    countryCode,
    carrier,
  );

  const millisecondsInADay = 1000 * 60 * 60 * 24; // 86400000

  return Math.round(
    (estimatedDelivery.getTime() - Date.now()) / millisecondsInADay,
  );
}
