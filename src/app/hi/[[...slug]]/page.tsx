import { redirect } from "next/navigation";

type Params = Promise<{ slug?: string[] }>;

export default async function HindiLocaleRedirect({ params }: { params: Params }) {
  const { slug = [] } = await params;
  redirect(slug.length > 0 ? `/${slug.join("/")}` : "/");
}
