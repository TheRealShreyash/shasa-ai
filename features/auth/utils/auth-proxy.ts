import { auth } from "@/lib/auth";
import { getSafeCallbackPath, SIGN_IN_PATH } from ".";
import { NextRequest, NextResponse } from "next/server";

function redirectToSignIn(req: NextRequest, pathname: string) {
  const signInUrl = new URL(SIGN_IN_PATH, req.url);

  signInUrl.searchParams.set(
    "callbackUrl",
    `$${pathname}${req.nextUrl.search}`,
  );
  return NextResponse.redirect(signInUrl);
}

function getPostAuthRedirectPath(req: NextRequest): string {
  const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");

  return getSafeCallbackPath(callbackUrl);
}

export async function handleAuthProxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (pathname === SIGN_IN_PATH) {
    if (session) {
      const redirectPath = getPostAuthRedirectPath(req);
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    return redirectToSignIn(req, pathname);
  }

  return NextResponse.next();
}
