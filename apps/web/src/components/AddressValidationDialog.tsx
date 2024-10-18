import { Dispatch, SetStateAction, useState } from "react";

import { AddressFormData } from "@ecommerce/utils";

import Button from "~/components/Button";
import Card from "~/components/Card";
import {
  Dialog,
  DialogCloseIcon,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "~/components/Dialog";
import cn from "~/lib/utils";

interface AddressValidationDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  originalAddress: AddressFormData;
  recommendedAddress?: AddressFormData;
  onAccept: (recommendedAddress: AddressFormData) => Promise<void>;
  onReject: (originalAddress: AddressFormData) => Promise<void>;
}

// TODO: Just need one handler instead of onAccept and onReject
export default function AddressValidationDialog({
  isOpen,
  setIsOpen,
  originalAddress,
  recommendedAddress,
  onAccept,
  onReject,
}: AddressValidationDialogProps) {
  const [useRecommended, setUseRecommended] = useState(true);

  const handleSelect = (id: string) => {
    setUseRecommended(id === "recommendedAddress");
  };

  const handleSubmit = async (): Promise<void> => {
    setIsOpen(false);
    if (useRecommended) {
      // It's okay to use "!" because we are only doing this if
      // recommended address exists below but TS doesn't know
      await onAccept(recommendedAddress!);
    } else {
      await onReject(originalAddress);
    }
  };

  const handleUseEntered = async (): Promise<void> => {
    setIsOpen(false);
    await onReject(originalAddress);
  };

  if (!isOpen) {
    return null;
  }

  if (recommendedAddress != null) {
    return (
      <Dialog open={isOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent
            onPointerDownOutside={(e) => e.preventDefault()}
            className="content-center bg-linen px-6 py-8 max-lg:bottom-0 max-lg:left-0 max-lg:right-0 max-lg:top-auto max-lg:ml-[50%] max-lg:-translate-x-1/2 max-lg:-translate-y-0 lg:min-w-[700px] lg:rounded-lg lg:p-20"
          >
            <main className="flex-wrap justify-center pt-12 lg:pt-0">
              <h4 className="mb-12 flex text-wrap text-center font-medium">
                Confirm shipping address
              </h4>

              <Card
                id="originalAddress"
                name="originalAddress"
                handleSelect={handleSelect}
                selected={!useRecommended}
                className={cn("mb-8 flex-shrink flex-col", {
                  "bg-transparent": useRecommended,
                })}
              >
                <h6 className="mb-3 font-medium">You entered:</h6>
                <p className="items-stretch font-light">
                  {`${originalAddress.addressLine1}, ${originalAddress.city}
                            ${originalAddress.state}, ${originalAddress.postalCode}`}
                </p>
              </Card>

              <Card
                id="recommendedAddress"
                name="recommendedAddress"
                handleSelect={handleSelect}
                selected={useRecommended}
                className={cn("mb-8 flex-shrink flex-col", {
                  "bg-transparent": !useRecommended,
                })}
              >
                <div>
                  <h6 className="mb-3 font-medium">We suggest: </h6>

                  <p className="items-stretch font-light">
                    {`${recommendedAddress.addressLine1}, ${recommendedAddress.city} 
                      ${recommendedAddress.state}, ${recommendedAddress.postalCode}`}
                  </p>
                </div>
              </Card>
            </main>

            <DialogCloseIcon onClick={() => setIsOpen(false)} />

            <Button
              onClick={() => void handleSubmit()}
              text="Save and Continue"
              variant="dark"
              className="mt-14"
            />
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="content-center bg-linen px-6 py-8 max-lg:bottom-0 max-lg:left-0 max-lg:right-0 max-lg:top-auto max-lg:ml-[50%] max-lg:-translate-x-1/2 max-lg:-translate-y-0 lg:min-w-[700px] lg:rounded-lg lg:p-20">
          <main className="flex-wrap justify-center pt-12 lg:pt-0">
            <h4 className="mb-12 flex text-wrap font-medium">
              We are unable to verify your address
            </h4>
            <Card
              id="inputAddress"
              name="inputAddress"
              handleSelect={handleSelect}
              className="mb-8 flex-shrink cursor-default flex-col bg-transparent"
            >
              <h6 className="mb-3 font-medium">You entered:</h6>
              <p className="items-stretch font-light">
                {`${originalAddress.addressLine1}, ${originalAddress.city}
                    ${originalAddress.state}, ${originalAddress.postalCode}`}
              </p>
            </Card>
          </main>

          <DialogCloseIcon onClick={() => setIsOpen(false)} />

          <Button
            onClick={() => setIsOpen(false)}
            text="Re-enter your address"
            variant="dark"
            className="mt-14"
          />

          <Button
            onClick={() => void handleUseEntered()}
            text="Use entered address"
            variant="outline"
            className="ml-4 mt-14"
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
