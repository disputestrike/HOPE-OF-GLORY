import type { Metadata } from "next";
import Link from "next/link";
import { auth, signOut } from "../../../auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin · Hope of Glory",
  robots: { index: false, follow: false },
};

const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/sermons", label: "Sermons" },
  { href: "/admin/calendar", label: "Calendar" },
  { href: "/admin/questions", label: "Q&A" },
  { href: "/admin/prayers", label: "Prayers" },
  { href: "/admin/calls", label: "Calls" },
  { href: "/admin/live", label: "Live" },
  { href: "/admin/social", label: "Social" },
  { href: "/admin/email", label: "Email" },
  { href: "/admin/donations", label: "Donations" },
  { href: "/admin/corrections", label: "Corrections" },
  { href: "/admin/handoff", label: "Human Handoff" },
  { href: "/admin/doctrine", label: "Doctrine" },
  { href: "/admin/models", label: "Models" },
  { href: "/admin/research", label: "Research" },
] as const;

export default async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="min-h-screen flex bg-deep">
      <aside className="w-64 border-r border-[var(--border-soft)] bg-navy py-8 px-6 sticky top-0 h-screen overflow-y-auto">
        <Link href="/admin" className="wordmark items-start mb-10">
          <span className="wordmark__title">Hope of Glory</span>
          <span className="wordmark__sub">Admin</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link block py-2 px-3 rounded hover:bg-[var(--accent-soft)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
          className="mt-10 pt-6 border-t border-[var(--border-soft)]"
        >
          <p className="text-xs text-muted mb-2">
            Signed in as <strong>{session.user.email}</strong>
          </p>
          <button type="submit" className="btn btn--ghost w-full">
            Sign out
          </button>
        </form>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
