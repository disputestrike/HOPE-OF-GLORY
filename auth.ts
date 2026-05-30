/**
 * NextAuth v5 main config. Used in API routes and server actions.
 *
 * JWT session strategy (no DB adapter) for Phase 1 simplicity.
 * Admin access is gated on ADMIN_EMAILS env var (comma-separated allow-list).
 */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import authConfig from "./auth.config";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 }, // 8h
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      const allow = adminEmails();
      if (allow.length === 0) {
        console.warn(
          "[auth] ADMIN_EMAILS is empty — no one can sign in. Set it in your environment."
        );
        return false;
      }
      const email = user.email?.toLowerCase();
      const ok = !!email && allow.includes(email);
      if (!ok) {
        console.warn(`[auth] sign-in denied for ${email}`);
      }
      return ok;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = "admin";
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.email) session.user.email = token.email as string;
      // attach role
      (session.user as typeof session.user & { role?: string }).role =
        (token?.role as string) ?? "viewer";
      return session;
    },
  },
});
