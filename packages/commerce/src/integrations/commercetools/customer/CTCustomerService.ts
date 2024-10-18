import {
  CustomerAddAddressAction,
  CustomerChangeAddressAction,
  CustomerSetDefaultShippingAddressAction,
} from "@commercetools/platform-sdk";
import ShortUniqueId from "short-unique-id";

import {
  Address,
  addressSchema,
  getRandomInt,
  LingoEnv,
  SchemaException,
  stringifyError,
} from "@ecommerce/utils";

import { Cart } from "../../../Cart";
import {
  Customer,
  CustomerGroup,
  customerGroupSchema,
  customerSchema,
  CustomerService,
} from "../../../Customer";
import CommercetoolsSdk from "../CommercetoolsSdk";
import { env } from "../env";
import translateCTCustomer from "../translations/customer";

function oneLine(strings: TemplateStringsArray, ...values: string[]): string {
  // Join the strings and values into a single string
  let result = strings.reduce(
    (acc, str, i) => acc + str + (values[i] ?? ""),
    "",
  );

  // Replace newlines and multiple spaces with a single space
  result = result.replace(/\s+/g, " ").trim();

  return result;
}

export default class CTCustomerSDK implements CustomerService {
  private static singletonInstance: CTCustomerSDK | undefined;
  private uid: ShortUniqueId;

  static getInstance = (): CTCustomerSDK => {
    if (this.singletonInstance == undefined) {
      this.singletonInstance = new CTCustomerSDK();
    }
    return this.singletonInstance;
  };

  constructor() {
    this.uid = new ShortUniqueId({ dictionary: "alphanum_upper" });
  }

  public generateCustomerNumber(): string {
    const prefixes: Record<LingoEnv, string> = {
      dev: "91",
      qa: "92",
      stg: "93",
      prod: `${getRandomInt(9)}${getRandomInt(9)}`,
    };

    const prefix = prefixes[env.LINGO_ENV] ?? prefixes.prod;

    const RANDOM_STRING_LENGTH = 7;

    return `${prefix}${this.uid.randomUUID(RANDOM_STRING_LENGTH)}`;
  }

  public async createCustomerFromCart(
    externalId: string,
    cart: Cart,
  ): Promise<Customer> {
    if (cart.contactInfo?.email == null) {
      throw new Error("Customer email is required to create a customer");
    }

    if (cart.shippingAddress == null) {
      throw new Error("Shipping address is required");
    }

    function translateAddress(address: Address, phone: string) {
      return {
        firstName: address.firstName,
        lastName: address.lastName,
        streetName: address.addressLine1,
        additionalStreetInfo: address.addressLine2,
        postalCode: address.postalCode,
        city: address.city,
        state: address.state,
        country: address.countryCode,
        phone,
      };
    }

    const addresses = [
      translateAddress(cart.shippingAddress, cart.contactInfo.phone),
    ];

    if (cart.billingAddress != null) {
      addresses.push(translateAddress(cart.billingAddress, ""));
    }

    const { body: customerResult } = await CommercetoolsSdk.getClient()
      .customers()
      .post({
        body: {
          externalId,
          customerNumber: this.generateCustomerNumber(),
          firstName: cart.shippingAddress.firstName,
          lastName: cart.shippingAddress.lastName,
          email: cart.contactInfo?.email?.toLowerCase(),
          addresses,
          defaultShippingAddress: 0,
          defaultBillingAddress: addresses.length === 2 ? 1 : undefined,
          authenticationMode: "ExternalAuth",
        },
      })
      .execute();

    return customerSchema.parse(translateCTCustomer(customerResult.customer));
  }

  public async createCustomer(
    externalId: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
  ): Promise<Customer> {
    const { body: newCustomer } = await CommercetoolsSdk.getClient()
      .customers()
      .post({
        body: {
          externalId: externalId,
          firstName: firstName,
          lastName: lastName,
          email: email.toLowerCase(),
          addresses: [{ phone: phone, country: "US" }],
          defaultShippingAddress: 0,
          authenticationMode: "ExternalAuth",
        },
      })
      .execute();

    return customerSchema.parse(translateCTCustomer(newCustomer.customer));
  }

  public async getCustomerByEmail(
    email: string,
  ): Promise<Customer | undefined> {
    const response = await CommercetoolsSdk.getClient()
      .customers()
      .get({
        queryArgs: {
          where: `lowercaseEmail="${email.toLowerCase()}"`,
        },
      })
      .execute();

    if (response.body.results[0] == null) {
      return undefined;
    }

    return customerSchema.parse(translateCTCustomer(response.body.results[0]));
  }

  public async getCustomerById(
    id: string,
    options?: { includeSubscription: boolean },
  ): Promise<Customer | undefined> {
    const response = await CommercetoolsSdk.getClient()
      .customers()
      .withId({ ID: id })
      .get()
      .execute();

    return customerSchema.parse(
      translateCTCustomer(response.body, options?.includeSubscription),
    );
  }

  public async updateCustomerInformation(
    id: string,
    version: number,
    firstName: string,
    lastName: string,
    phone: string,
  ): Promise<Customer> {
    // Retrieve existing customer's address
    const { body: existingCustomer } = await CommercetoolsSdk.getClient()
      .customers()
      .withId({ ID: id })
      .get()
      .execute();

    if (existingCustomer == null) {
      throw new Error(`Unable to find customer: ${id}`);
    }

    const shippingAddress = existingCustomer.addresses.find(
      ({ id }) => id === existingCustomer.defaultShippingAddressId,
    );

    if (shippingAddress == null) {
      throw new Error(
        "Unable to update phone number for invalid shipping address",
      );
    }

    const { body: updatedCustomer } = await CommercetoolsSdk.getClient()
      .customers()
      .withId({ ID: id })
      .post({
        body: {
          version: version,
          actions: [
            {
              action: "setFirstName",
              firstName: firstName,
            },
            {
              action: "setLastName",
              lastName: lastName,
            },
            {
              action: "changeAddress",
              addressId: existingCustomer.defaultShippingAddressId,
              address: {
                ...shippingAddress,
                phone,
              },
            },
          ],
        },
      })
      .execute();

    return customerSchema.parse(translateCTCustomer(updatedCustomer));
  }

  public async updateCustomerBillingAddress(
    id: string,
    version: number,
    billingAddress: Address,
  ): Promise<Customer> {
    const addressParse = addressSchema.safeParse(billingAddress);

    if (!addressParse.success) {
      throw new SchemaException("Invalid billing address", addressParse.error);
    }

    // query commercetools customer to get default billing address
    const { body: customer } = await CommercetoolsSdk.getClient()
      .customers()
      .withId({ ID: id })
      .get()
      .execute();

    let updatedCustomer;
    if (customer?.defaultBillingAddressId != null) {
      // update default billing address in commercetools
      const resp = await CommercetoolsSdk.getClient()
        .customers()
        .withId({ ID: id })
        .post({
          body: {
            version: version,
            actions: [
              {
                action: "changeAddress",
                addressId: customer.defaultBillingAddressId,
                address: {
                  firstName: billingAddress.firstName,
                  lastName: billingAddress.lastName,
                  streetName: billingAddress.addressLine1,
                  additionalStreetInfo: billingAddress.addressLine2,
                  postalCode: billingAddress.postalCode,
                  city: billingAddress.city,
                  state: billingAddress.state,
                  country: billingAddress.countryCode,
                },
              },
            ],
          },
        })
        .execute();

      updatedCustomer = resp.body;
    } else {
      // create new billing address
      const resp = await CommercetoolsSdk.getClient()
        .customers()
        .withId({ ID: id })
        .post({
          body: {
            version: version,
            actions: [
              {
                action: "addAddress",
                address: {
                  key: "default-billing",
                  firstName: billingAddress.firstName,
                  lastName: billingAddress.lastName,
                  streetName: billingAddress.addressLine1,
                  additionalStreetInfo: billingAddress.addressLine2,
                  postalCode: billingAddress.postalCode,
                  city: billingAddress.city,
                  state: billingAddress.state,
                  country: billingAddress.countryCode,
                },
              },
              {
                action: "setDefaultBillingAddress",
                addressKey: "default-billing",
              },
            ],
          },
        })
        .execute();

      updatedCustomer = resp.body;
    }

    return customerSchema.parse(translateCTCustomer(updatedCustomer));
  }

  public async updateCustomerShippingAddress(
    id: string,
    version: number,
    shippingAddress: Address,
    phone?: string,
  ): Promise<Customer> {
    const addressParse = addressSchema.safeParse(shippingAddress);

    if (!addressParse.success) {
      throw new SchemaException("Invalid shipping address", addressParse.error);
    }

    const { body: customer } = await CommercetoolsSdk.getClient()
      .customers()
      .withId({ ID: id })
      .get()
      .execute();

    const address = {
      firstName: shippingAddress.firstName,
      lastName: shippingAddress.lastName,
      streetName: shippingAddress.addressLine1,
      additionalStreetInfo: shippingAddress.addressLine2,
      postalCode: shippingAddress.postalCode,
      city: shippingAddress.city,
      state: shippingAddress.state,
      country: shippingAddress.countryCode,
      phone: phone,
    };
    const actions =
      customer.defaultShippingAddressId == null
        ? [
            {
              action: "addAddress",
              address: { ...address, key: "default-shipping" },
            } as CustomerAddAddressAction,
            {
              action: "setDefaultShippingAddress",
              addressKey: "default-shipping",
            } as CustomerSetDefaultShippingAddressAction,
          ]
        : [
            {
              action: "changeAddress",
              addressId: customer.defaultShippingAddressId,
              address: address,
            } as CustomerChangeAddressAction,
          ];

    const { body: updatedCustomer } = await CommercetoolsSdk.getClient()
      .customers()
      .withId({ ID: id })
      .post({
        body: {
          version: version,
          actions: actions,
        },
      })
      .execute();

    return customerSchema.parse(translateCTCustomer(updatedCustomer));
  }

  public async deleteCustomer(id: string, version: number): Promise<void> {
    await CommercetoolsSdk.getClient()
      .customers()
      .withId({ ID: id })
      .delete({ queryArgs: { version } })
      .execute();

    // TODO handle response errors
  }

  public async getCustomerGroupByName(
    groupName: string,
  ): Promise<CustomerGroup | undefined> {
    const response = await CommercetoolsSdk.getClient()
      .customerGroups()
      .get({
        queryArgs: {
          where: `name="${groupName}"`,
        },
      })
      .execute();

    return customerGroupSchema.parse(response.body.results[0]);
  }

  /**
   * This is used by Subscription Manager to get customers with upcoming subscriptions
   * Since we can only send 100 messages to a service bus queue at a time,
   * we limit the number of customers to 100
   * https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-quotas
   *
   * @returns [customers, errorMessages]
   */
  public async getCustomersWithUpcomingSubscription(): Promise<
    [Customer[], string[]]
  > {
    const currentDateTime = new Date().toISOString();

    // Update the logic in sm-process-order which is used as a safeguard
    const wherePredicate = oneLine`
      (custom(fields(nextOrderDate<"${currentDateTime}")) and (custom(fields(stoppedRetrying is not defined)) or custom(fields(stoppedRetrying = false)))) and
      (custom(fields(status="active")) or custom(fields(prepaidShipmentsRemaining > 0)))
    `;

    const response = await CommercetoolsSdk.getClient()
      .customers()
      .get({
        queryArgs: {
          where: wherePredicate,
          limit: 100,
        },
      })
      .execute();

    return response.body.results.reduce(
      (acc: [Customer[], string[]], customer) => {
        try {
          const parsedCustomer = customerSchema.parse(
            translateCTCustomer(customer, true),
          );
          acc[0].push(parsedCustomer);
          return acc;
        } catch (e) {
          acc[1].push(
            `Error parsing customer: ${customer.id}: ${stringifyError(e)}`,
          );
          return acc;
        }
      },
      [[], []],
    );
  }

  public async getCustomerByExternalId(
    externalId: string,
  ): Promise<Customer | undefined> {
    const response = await CommercetoolsSdk.getClient()
      .customers()
      .get({
        queryArgs: {
          where: `externalId="${externalId}"`,
        },
      })
      .execute();

    if (response.body.results[0] == null) {
      return undefined;
    }
    return customerSchema.parse(
      translateCTCustomer(response.body.results[0], true),
    );
  }
}
