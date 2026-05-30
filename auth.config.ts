/**
 * Edge-safe auth config. Imported by middleware (which cannot use node-only deps).
 */
import type { NextAuthConfig } from "next-auth";

const config: NextAuthConfig = {
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAdmin = pathname.startsWith("/admin");
      const isLogin = pathname === "/admin/login";
      const isAuthApi = pathname.startsWith("/api/auth");
      if (!isAdmin || isLogin || isAuthApi) return true;
      if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) return true;
      const allow = (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
      const email = auth?.user?.email?.toLowerCase();
      return !!email && allow.includes(email);
    },
  },
};

export default config;
