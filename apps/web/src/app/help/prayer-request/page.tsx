import { redirect } from "next/navigation";

/**
 * /help/prayer-request — alias of /prayer.
 * Keeps the Help nav consistent and reduces decision fatigue in crisis flows.
 */
export default function HelpPrayerRequestRedirect() {
  redirect("/prayer");
}
