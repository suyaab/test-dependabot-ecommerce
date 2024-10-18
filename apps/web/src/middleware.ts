import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { CookieKey } from "./app/actions/constants/CookieKey";
import { HttpHeaderKey } from "./app/actions/constants/HttpHeaderKey";

export function middleware(req: NextRequest) {
  const response = NextResponse.next();

  const correlationHeader = req.headers.get("X-Correlation-Id");
  if (correlationHeader == null) {
    const correlationCookie = req.cookies.get(CookieKey.X_CORRELATION_ID);
    let correlationId = correlationCookie?.value;
    if (correlationId == null) {
      correlationId = crypto.randomUUID();
      response.cookies.set(CookieKey.X_CORRELATION_ID, correlationId, {
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }
    response.headers.set("X-Correlation-Id", correlationId);
  }

  const xGeoCountry = req.headers.get(HttpHeaderKey.X_GEO_COUNTRY) ?? "";
  response.cookies.set(CookieKey.X_GEO_COUNTRY, xGeoCountry, {
    path: "/",
    secure: true,
    sameSite: "strict",
  });
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
    },
  ],
};
