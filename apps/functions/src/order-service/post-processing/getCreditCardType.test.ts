import { PaymentMethod } from "@ecommerce/finance";

import getCreditCardType from "./getCreditCardType";

describe("getCreditCardType", () => {
  const cases: [PaymentMethod, string][] = [
    [{ brand: "VISA", type: "CREDIT_CARD" } as PaymentMethod, "VISA"],
    [{ brand: "MASTERCARD", type: "CREDIT_CARD" } as PaymentMethod, "MC"],
    [{ brand: "PAYPAL", type: "PAYPAL" } as PaymentMethod, "PAYP"],
    [{ brand: "APPLE_PAY", type: "APPLE_PAY" } as PaymentMethod, "APPL"],
  ];

  test.each(cases)(
    "%s brand gets credit card type %s",
    (paymentBrand, creditCardType) => {
      expect(getCreditCardType(paymentBrand)).toEqual(creditCardType);
    },
  );
});
