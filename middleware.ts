/**
 * NextAuth v5 middleware — runs on the edge.
 * Uses the edge-safe auth.config.ts (no node imports).
 */
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
