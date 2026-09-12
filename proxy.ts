import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, isAdmin } from "@/lib/auth";

// Routes that require authentication (any role)
const PROTECTED_ROUTES = ["/connection"];

// Routes that admins should not be redirected away from
const ADMIN_LOGIN = "/admin/login";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin routes ────────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin") && pathname !== ADMIN_LOGIN) {
    const session = getSessionFromRequest(request);
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = ADMIN_LOGIN;
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    if (!isAdmin(session)) {
      const url = request.nextUrl.clone();
      url.pathname = "/access-denied";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ── Business-user protected routes ──────────────────────────────────────────
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    const session = getSessionFromRequest(request);
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    // Admin trying to access /connection — allow (they can view as admin)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/connection/:path*",
    "/admin/:path*",
  ],
};
