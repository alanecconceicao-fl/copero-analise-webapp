import { NextRequest, NextResponse } from "next/server";
import { isRealMobilePhone, isSocialCrawler } from "./shared/device";

const NOTICE_PATH = "/mobile-only";

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent");
  if (isRealMobilePhone(userAgent) || isSocialCrawler(userAgent)) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname === NOTICE_PATH) {
    return NextResponse.next();
  }
  return NextResponse.rewrite(new URL(NOTICE_PATH, request.url));
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|.*\\.(?:png|jpg|svg|ico|webp|txt|xml)$).*)"],
};
