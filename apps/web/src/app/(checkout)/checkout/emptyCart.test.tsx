import { render, screen } from "@testing-library/react";

import EmptyCart from "~/app/(checkout)/checkout/emptyCart";

describe("EmptyCart", () => {
  it("can successfully display empty cart", () => {
    render(<EmptyCart />);

    expect(screen.getByText("Empty Cart"));
    expect(screen.getByRole("link", { name: "Shop Lingo" }));
  });
});
