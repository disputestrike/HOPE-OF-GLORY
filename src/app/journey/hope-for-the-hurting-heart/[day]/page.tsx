import { redirect } from "next/navigation";

export default async function HopeForTheHurtingHeartDayRedirect({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day } = await params;
  redirect(`/journey/30-day/${day}`);
}

