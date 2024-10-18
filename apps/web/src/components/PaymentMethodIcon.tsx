import Image from "next/image";

import { PaymentMethodBrand } from "@ecommerce/finance";

export default function PaymentMethodIcon({
  brand,
}: {
  brand: PaymentMethodBrand;
}) {
  return (
    <span className="mr-3 inline-block rounded bg-white p-1">
      <Image
        src={`/icons/${brand}.svg`}
        width={47}
        height={12}
        alt="payment method icon"
      />
    </span>
  );
}
