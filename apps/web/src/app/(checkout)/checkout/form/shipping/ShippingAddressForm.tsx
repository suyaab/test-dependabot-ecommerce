import { KeyboardEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { LocationAttributes } from "@ecommerce/analytics";
import { Cart } from "@ecommerce/commerce";
import { CheckoutSession } from "@ecommerce/finance";
import { AddressFormData, addressSchema } from "@ecommerce/utils";

import AddressValidationDialog from "~/components/AddressValidationDialog";
import Button from "~/components/Button";
import ErrorAlert from "~/components/ErrorAlert";
import AddressInput from "~/components/forms/AddressInput";
import { validateAddress } from "~/app/actions/address/validateAddress";
import { submitShippingAddress } from "~/app/actions/checkout/addresses/submitShippingAddress";
import { VALID_SHIPPING_ADDRESS_COUNTRY_CODES } from "~/constants";
import { ShippingAddressFormData, shippingAddressFormSchema } from "./schema";

interface ShippingAddressFormProps {
  cart: Cart;
  checkoutSession: CheckoutSession;
  moveToNextStep: () => void;
}

export default function ShippingAddressForm({
  cart,
  checkoutSession,
  moveToNextStep,
}: ShippingAddressFormProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [addressValidationResponse, setAddressValidationResponse] =
    useState<AddressFormData>();
  const [currentAddress, setCurrentAddress] = useState<
    AddressFormData | undefined
  >(cart.shippingAddress);

  const submitAddress = async (data: AddressFormData) => {
    const shippingAddress = addressSchema.parse({
      firstName: cart.contactInfo?.firstName,
      lastName: cart.contactInfo?.lastName,
      ...data,
    });

    const resp = await submitShippingAddress(
      cart.id,
      cart.version,
      checkoutSession.id,
      shippingAddress,
    );

    if (!resp.ok) {
      setErrorMessage(resp.message);
      return;
    }

    moveToNextStep();
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

    // TODO: do we also want to check if `response.success` below?
    if (response.status === "fix") {
      setShowValidationDialog(true);
      return;
    }

    if (response.status === "confirm") {
      setAddressValidationResponse(response.recommendedAddress);
      setShowValidationDialog(true);

      return;
    }

    // if status is `accept`, do not show modal and submit
    await submitAddress(data.shippingAddress);
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

  const { isSubmitting } = formMethods.formState;

  const onAccept = async (recommendedAddress: AddressFormData) => {
    setCurrentAddress(recommendedAddress);
    await submitAddress(recommendedAddress);
  };

  return (
    <div className="mb-18">
      <div className="flex flex-col">
        <div className="space-y-8">
          {errorMessage && <ErrorAlert message={errorMessage} />}

          <FormProvider {...formMethods}>
            <form
              onSubmit={(event) =>
                void formMethods.handleSubmit(onNextClicked)(event)
              }
              onKeyDown={handleKeyDown}
            >
              {/*Shipping Address Form*/}
              <AddressInput
                name="shippingAddress"
                supportedCountries={VALID_SHIPPING_ADDRESS_COUNTRY_CODES}
                addressToSet={currentAddress}
              />

              <div className="flex items-center justify-center">
                <Button
                  variant="dark"
                  buttonType="submit"
                  text="Next"
                  className="my-10 w-full lg:w-1/2"
                  analyticsActionAttribute="Save Shipping Address"
                  analyticsLocationAttribute={LocationAttributes.CHECKOUT}
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting}
                />
              </div>

              <AddressValidationDialog
                isOpen={showValidationDialog}
                setIsOpen={setShowValidationDialog}
                originalAddress={formMethods.getValues("shippingAddress")}
                recommendedAddress={addressValidationResponse}
                onAccept={onAccept}
                onReject={submitAddress}
              />
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
