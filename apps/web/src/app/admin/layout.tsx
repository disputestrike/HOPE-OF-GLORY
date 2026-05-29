import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "../../../auth";

export const metadata: Metadata = {
  title: "Admin - Hope of Glory",
  robots: { index: false, follow: false },
};

const adminNav = [
  {
    group: "Operations",
    items: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/calendar", label: "Calendar" },
      { href: "/admin/sermons", label: "Sermons" },
      { href: "/admin/social", label: "Social Queue" },
      { href: "/admin/email", label: "Email" },
      { href: "/admin/media", label: "Media" },
      { href: "/admin/live", label: "Live" },
    ],
  },
  {
    group: "Care",
    items: [
      { href: "/admin/questions", label: "Ask Hope" },
      { href: "/admin/prayers", label: "Prayer" },
      { href: "/admin/calls", label: "Hope Line" },
      { href: "/admin/handoff", label: "Human Handoff" },
    ],
  },
  {
    group: "Governance",
    items: [
      { href: "/admin/donations", label: "Donations" },
      { href: "/admin/corrections", label: "Corrections" },
      { href: "/admin/doctrine", label: "Doctrine" },
      { href: "/admin/models", label: "Models" },
      { href: "/admin/research", label: "Research" },
    ],
  },
] as const;

function authIsConfigured() {
  return Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET);
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const hasAuth = authIsConfigured();
  const session = hasAuth ? await auth().catch(() => null) : null;

  if (hasAuth && !session?.user) redirect("/admin/login");

  const adminName = session?.user?.email ?? "Administrator";

  return (
    <div className="admin-shell flex">
      <aside className="admin-sidebar px-5 py-6">
        <Link href="/admin" className="wordmark mb-8">
          <span className="wordmark__title">Hope of Glory</span>
          <span className="wordmark__sub">Admin</span>
        </Link>

        <nav className="flex flex-col gap-6" aria-label="Admin">
          {adminNav.map((section) => (
            <div key={section.group}>
              <p className="mb-2 px-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[rgba(226,232,240,0.45)]">
                {section.group}
              </p>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <Link key={item.href} href={item.href} className="admin-nav-link">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-8 border-t border-[rgba(226,232,240,0.14)] pt-5">
          <p className="m-0 text-xs font-semibold text-white">{adminName}</p>
          <p className="m-0 mt-1 text-xs text-[rgba(226,232,240,0.58)]">
            {hasAuth ? "Authenticated admin" : "Local admin mode"}
          </p>
          {hasAuth && session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
              className="mt-4"
            >
              <button type="submit" className="btn btn--ghost w-full">
                Sign out
              </button>
            </form>
          ) : null}
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-content flex items-center justify-between py-4">
            <div>
              <p className="m-0 text-sm font-semibold text-warm">Hope of Glory Operations</p>
              <p className="m-0 text-xs text-muted">
                Calendar, publishing, care, stewardship, and review.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="btn btn--secondary">
                View Site
              </Link>
              <Link href="/admin/calendar" className="btn btn--primary">
                Open Calendar
              </Link>
            </div>
          </div>
        </div>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}

