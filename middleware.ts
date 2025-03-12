import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  "dkjasdhkj32khu4khj32jnksdahf1kjdas"
);
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    console.log("Token not found in cookies");
    return NextResponse.redirect(new URL("/", req.url));
  }
  try {
    await jwtVerify(token, SECRET_KEY);
    return NextResponse.next();
  } catch (error) {
    console.error("Invalid token:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: [
    "/servicos:path*",
    "/produtos:path*",
    "/painel:path*",
    "/almoxarifado:path*",
  ],
};
