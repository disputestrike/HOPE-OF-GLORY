import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { auth } from "../../auth";

export type AdminPermission =
  | "view"
  | "publish"
  | "finance"
  | "care"
  | "settings";

const PERMISSIONS_BY_ROLE: Record<string, AdminPermission[]> = {
  owner: ["view", "publish", "finance", "care", "settings"],
  admin: ["view", "publish", "finance", "care", "settings"],
  editor: ["view", "publish"],
  care: ["view", "care"],
  finance: ["view", "finance"],
  viewer: ["view"],
};
const OWNER_PERMISSIONS: AdminPermission[] = ["view", "publish", "finance", "care", "settings"];
const VIEWER_PERMISSIONS: AdminPermission[] = ["view"];

export function authIsConfigured(): boolean {
  return Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET);
}

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function roleForEmail(email: string | null | undefined): string {
  if (!email) return "viewer";
  const lowered = email.toLowerCase();
  if ((process.env.OWNER_EMAILS ?? "").toLowerCase().split(",").map((s) => s.trim()).includes(lowered)) {
    return "owner";
  }
  if (adminEmails().includes(lowered)) return "admin";
  return "viewer";
}

export async function getAdminSession() {
  if (!authIsConfigured()) {
    return {
      email: "local-admin@hopeofglory.local",
      role: "owner",
      permissions: OWNER_PERMISSIONS,
      localMode: true,
    };
  }

  const session = await auth().catch(() => null);
  const email = session?.user?.email?.toLowerCase() ?? null;
  const role = roleForEmail(email);
  const permissions = PERMISSIONS_BY_ROLE[role] ?? VIEWER_PERMISSIONS;
  return { email, role, permissions, localMode: false };
}

export async function requireAdminPage(permission: AdminPermission = "view") {
  const session = await getAdminSession();
  if (!session.email) redirect("/admin/login");
  if (!session.permissions.includes(permission)) redirect("/admin");
  return session;
}

export async function requireAdminApi(permission: AdminPermission = "view") {
  const session = await getAdminSession();
  if (!session.email) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!session.permissions.includes(permission)) {
    return { ok: false as const, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true as const, session };
}
