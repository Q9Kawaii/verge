import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  const role = req.cookies.get("role")?.value;

  // Public routes (always allowed)
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/onboarding")
  ) {
    return NextResponse.next();
  }

  // If not logged in (no role cookie)
  if (!role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based route protection
  if (pathname.startsWith("/generator") && role !== "generator") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/anchor") && role !== "anchor") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/msme") && role !== "msme") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/intelligence") && role === "msme") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/generator/:path*",
    "/anchor/:path*",
    "/msme/:path*",
    "/intelligence/:path*",
  ],
};
