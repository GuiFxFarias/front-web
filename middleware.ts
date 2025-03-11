import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Use jose instead of jsonwebtoken

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_secret_key"
); // Convert to Uint8Array

export async function middleware(req: NextRequest) {
  // ✅ Extract token from cookies
  const token = req.cookies.get("token")?.value;

  if (!token) {
    console.warn("Token not found in cookies");
    return NextResponse.redirect(new URL("/", req.url)); // Redirect if no token
  }

  try {
    // ✅ Verify JWT using jose (Edge-compatible)
    await jwtVerify(token, SECRET_KEY);

    return NextResponse.next(); // Allow request to continue
  } catch (error) {
    console.error("Invalid token:", error);
    return NextResponse.redirect(new URL("/", req.url)); // Redirect on invalid token
  }
}

// ✅ Define protected routes
export const config = {
  matcher: [
    "/servicos:path*",
    "/produtos:path*",
    "/painel:path*",
    "/almoxarifado:path*",
  ],
};
