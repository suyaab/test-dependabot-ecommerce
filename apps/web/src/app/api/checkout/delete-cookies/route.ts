import { NextResponse } from "next/server";

import { deleteCheckoutSessionIdCookie } from "~/app/actions/checkout/checkoutSession";
import { deleteCartIdCookie } from "~/app/actions/checkout/getCart";
import { deleteCartSampleIdCookie } from "~/app/actions/promotional/getPromoCart";

export async function GET() {
  await deleteCartSampleIdCookie(); // currently just reusing this api for samples (maybe there is a better way to do this)
  await deleteCartIdCookie();
  await deleteCheckoutSessionIdCookie();

  return NextResponse.json({ status: "success" });
}
