import {
  Address as CommerceToolsAddress,
  Customer as CommerceToolsCustomer,
} from "@commercetools/platform-sdk";
import { PartialDeep } from "type-fest";

import { Locale } from "@ecommerce/utils";

import { Customer } from "../../../Customer";
import translateCTAddress from "./address";
import { translateSubscription } from "./subscription";

function getAddress(
  addresses: CommerceToolsAddress[],
  addressId: string | undefined,
): CommerceToolsAddress | undefined {
  if (addresses.length > 0 && addressId != null) {
    return addresses.find((address) => address.id === addressId);
  }
}

export default function translateCTCustomer(
  ctCustomer: CommerceToolsCustomer,
  includeSubscription?: boolean,
): PartialDeep<Customer> {
  const ctShippingAddress = getAddress(
    ctCustomer.addresses,
    ctCustomer.defaultShippingAddressId,
  );

  const ctBillingAddress = getAddress(
    ctCustomer.addresses,
    ctCustomer.defaultBillingAddressId,
  );

  const customer: PartialDeep<Customer> = {
    id: ctCustomer.id,
    version: ctCustomer.version,
    createdAt: new Date(ctCustomer.createdAt),
    email: ctCustomer.email,
    phone: ctShippingAddress?.phone,
    customerNumber: ctCustomer.customerNumber,
    externalId: ctCustomer.externalId,
    firstName: ctCustomer.firstName,
    lastName: ctCustomer.lastName,
    locale: ctCustomer.locale as Locale,
    customerGroup: {
      id:
        ctCustomer.customerGroup != null
          ? ctCustomer.customerGroup.id
          : undefined,
      name: undefined,
    },
    billingAddress:
      ctBillingAddress != null
        ? translateCTAddress(ctBillingAddress)
        : undefined,
    shippingAddress:
      ctShippingAddress != null
        ? translateCTAddress(ctShippingAddress)
        : undefined,
  };

  if ((includeSubscription ?? false) && ctCustomer.custom != null) {
    // TODO: by combining translate and parse together we are
    // double parsing when doing a translation like this
    // not going to refactor now to show an example for discussion
    customer.subscription = translateSubscription(ctCustomer);
  }

  return customer;
}
