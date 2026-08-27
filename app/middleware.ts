import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host");

  if (
    hostname === "dream3.carsceneapparel.com" &&
    request.nextUrl.pathname === "/"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dream3";

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}