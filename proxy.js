import { NextResponse } from "next/server";

export function proxy(req) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  const authPages = ["/login", "/signup"];

  if (!accessToken && pathname === "/profile") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (accessToken && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/login", "/signup"],
};
