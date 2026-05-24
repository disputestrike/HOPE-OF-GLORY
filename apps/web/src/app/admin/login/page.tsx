import { signIn, auth } from "../../../../auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");

  return (
    <section className="section--hero">
      <div className="container-prose" style={{ maxWidth: "32rem" }}>
        <p className="eyebrow">Admin</p>
        <h1 className="mx-auto" style={{ maxWidth: "20ch" }}>
          Sign in to the workshop.
        </h1>
        <p className="text-muted mt-6 mx-auto max-w-readable">
          Admin access is by Google sign-in, restricted to allow-listed addresses.
          If you're a visitor, return to the{" "}
          <a href="/" className="text-gold">
            ministry home
          </a>
          .
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
          className="mt-12"
        >
          <button type="submit" className="btn btn--primary">
            Continue with Google
          </button>
        </form>
      </div>
    </section>
  );
}
