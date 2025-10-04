import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/profile", "/payouts", "/booking", "/partner", "/pro", "/settings"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const protectedPath = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  if (!protectedPath) return NextResponse.next();

  const token = req.cookies.get("sb-access-token")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/signup";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api/trpc|api/stripe/webhook|.*\..*).*)"],
};
