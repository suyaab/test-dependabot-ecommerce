import { Customer } from "@ecommerce/commerce";

import Hyperlink from "~/components/Hyperlink";

export default function ConfirmAddressBlock({
  customer,
  content,
  productId,
}: {
  customer: Customer;
  content: { title: string; buttonText: string };
  productId: string;
}) {
  const shippingAddress = customer.shippingAddress;
  const { title, buttonText } = content;
  const returnTo = `subscription/update/confirm?productId=${productId}`;
  if (shippingAddress == null) {
    return (
      <div className="border-brown w-full rounded-lg border-2 p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-3 font-semibold text-red">No shipping address</p>

            <p className="mb-3">
              Please edit your shipping address before updating subscription
            </p>
          </div>

          <a
            href={`/account/shipping-address?returnTo=${encodeURIComponent(
              returnTo,
            )}`}
            className="underline"
          >
            Edit
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-14 w-full flex-col">
      <h5 className="mb-3">{title}</h5>
      <div className="w-full rounded-xl border-2 bg-white p-8">
        <div className="items-center md:flex md:justify-between">
          <div>
            <p>{shippingAddress.addressLine1}</p>
            <p>{shippingAddress.addressLine2}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.state}{" "}
              {shippingAddress.postalCode}
            </p>
            <p>{shippingAddress.countryCode}</p>
          </div>
          <div className="h-full">
            <Hyperlink
              text={buttonText}
              url={`/account/shipping-address?returnTo=${encodeURIComponent(
                returnTo,
              )}`}
              variant="outline"
              className="mt-8 flex h-auto w-auto items-center justify-center py-4 md:mt-0 md:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
