"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { LocationAttributes } from "@ecommerce/analytics";
import { Customer } from "@ecommerce/commerce";
import {
  AddressFormData,
  addressFormSchema,
  addressSchema,
  SchemaException,
} from "@ecommerce/utils";

import AddressInput from "~/components/forms/AddressInput";
import { useToast } from "~/components/Toast";
import { updateShippingAddress } from "~/app/actions/account/updateShippingAddress";
import { VALID_SHIPPING_ADDRESS_COUNTRY_CODES } from "~/constants";
import Spinner from "~/icons/Spinner";

export default function ShippingAddressForm({
  customer,
}: {
  customer: Customer;
}) {
  const { toast } = useToast();

  // some customers might not have a shipping address (at least right away)
  const shippingAddressParse = addressSchema
    .optional()
    .safeParse(customer.shippingAddress);

  if (!shippingAddressParse.success) {
    throw new SchemaException(
      "Failed to update customer shipping address, invalid address",
      shippingAddressParse.error,
    );
  }

  const formMethods = useForm<{ shippingAddress: AddressFormData }>({
    resolver: zodResolver(z.object({ shippingAddress: addressFormSchema }), {
      async: true,
    }),
    defaultValues: {
      shippingAddress: {
        ...customer.shippingAddress,
      },
    },
  });

  const { isSubmitting } = formMethods.formState;

  const onSaveClicked: SubmitHandler<{
    shippingAddress: AddressFormData;
  }> = async (data, event) => {
    event?.preventDefault();

    const response = await updateShippingAddress(data.shippingAddress);

    if (!response.ok) {
      toast({
        title: "Unable to update shipping address",
        description: "Please try again later",
        status: "failure",
      });
      return;
    }

    toast({ title: "Updated shipping address", status: "success" });
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={(event) =>
          void formMethods.handleSubmit(onSaveClicked)(event)
        }
      >
        <div className="my-4 max-w-screen-md">
          <AddressInput
            name="shippingAddress"
            addressToSet={customer.shippingAddress}
            supportedCountries={VALID_SHIPPING_ADDRESS_COUNTRY_CODES}
          />
        </div>

        <div className="my-6">
          <button
            type="submit"
            className="button-dark"
            data-analytics-location={LocationAttributes.ACCOUNT_DETAILS}
            data-analytics-action="Save Shipping Address"
            disabled={isSubmitting}
          >
            <span className="relative px-6 text-center">
              {isSubmitting && (
                <Spinner className="spinner absolute left-0 top-0 mr-2 inline-block size-4 text-white" />
              )}
              <span>Save</span>
            </span>
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
