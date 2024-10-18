import { KeyboardEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Cart } from "@ecommerce/commerce";
import { AddressFormData } from "@ecommerce/utils";

import AddressValidationDialog from "~/components/AddressValidationDialog";
import Button from "~/components/Button";
import ErrorAlert from "~/components/ErrorAlert";
import AddressInput from "~/components/forms/AddressInput";
import { validateAddress } from "~/app/actions/address/validateAddress";
import { completePromoCheckout } from "~/app/actions/promotional/completePromoCheckout";
import { VALID_SHIPPING_ADDRESS_COUNTRY_CODES } from "~/constants";
import { ShippingAddressFormData, shippingAddressFormSchema } from "./schema";

export default function ShippingAddressForm({ cart }: { cart: Cart }) {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [isValidationDialogShown, setIsValidationDialogShown] = useState(false);
  const [addressValidationResponse, setAddressValidationResponse] =
    useState<AddressFormData>();
  const [currentAddress, setCurrentAddress] = useState<
    AddressFormData | undefined
  >(cart.shippingAddress);

  const completeCheckout = async (shippingAddress: AddressFormData) => {
    const newAddress = {
      firstName: cart.contactInfo?.firstName,
      lastName: cart.contactInfo?.lastName,
      ...shippingAddress,
    };

    const response = await completePromoCheckout(
      cart.id,
      cart.version,
      newAddress,
    );

    if (!response.ok) {
      setErrorMessage(response.message);
      return;
    }

    router.push(`/promotional/confirmation/${response.orderId}`);
  };

  const onNextClicked: SubmitHandler<ShippingAddressFormData> = async (
    data,
    event,
  ) => {
    event?.preventDefault();

    setErrorMessage("");

    const response = await validateAddress(data.shippingAddress);

    if (!response.ok) {
      setErrorMessage(response.message);
      return;
    }

    if (response.status === "fix") {
      setIsValidationDialogShown(true);
      return;
    }

    if (response.status === "confirm") {
      setAddressValidationResponse(response.recommendedAddress);
      setIsValidationDialogShown(true);
      return;
    }

    await completeCheckout(data.shippingAddress);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const formMethods = useForm<ShippingAddressFormData>({
    resolver: zodResolver(shippingAddressFormSchema),
    defaultValues: {
      shippingAddress: {
        addressLine1: cart.shippingAddress?.addressLine1,
        addressLine2: cart.shippingAddress?.addressLine2,
        city: cart.shippingAddress?.city,
        postalCode: cart.shippingAddress?.postalCode,
        countryCode: cart.shippingAddress?.countryCode ?? "US",
      },
    },
  });

  const {
    formState: { isSubmitting },
  } = formMethods;

  const onAccept = async (recommendedAddress: AddressFormData) => {
    setCurrentAddress(recommendedAddress);
    await completeCheckout(recommendedAddress);
  };

  return (
    <div className="mb-18">
      <div className="flex flex-col">
        <div className="space-y-8">
          {errorMessage != "" && <ErrorAlert message={errorMessage} />}

          <FormProvider {...formMethods}>
            <form
              onSubmit={(event) =>
                void formMethods.handleSubmit(onNextClicked)(event)
              }
              onKeyDown={handleKeyDown}
            >
              <AddressInput
                name="shippingAddress"
                supportedCountries={VALID_SHIPPING_ADDRESS_COUNTRY_CODES}
                addressToSet={currentAddress}
              />

              <div className="flex items-center justify-center">
                <Button
                  variant="dark"
                  buttonType="submit"
                  text="Order"
                  className="my-10 w-full lg:w-1/2"
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                />
              </div>

              <AddressValidationDialog
                isOpen={isValidationDialogShown}
                setIsOpen={setIsValidationDialogShown}
                originalAddress={formMethods.getValues("shippingAddress")}
                recommendedAddress={addressValidationResponse}
                onAccept={onAccept}
                onReject={completeCheckout}
              />
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
