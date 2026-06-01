import { getVerseText, webReaderUrl } from "@/lib/verses";
import { VersePopover } from "./VersePopover";

type Props = {
  /** A scripture reference, e.g. "John 8:24" or "Isaiah 45:22-23". */
  reference: string;
  /** Optional class override for the trigger text. */
  className?: string;
};

/**
 * Renders a scripture reference. When the verified WEB text is in the bundle
 * (src/data/web-verses.json), it shows a hover/tap popover with the verse.
 * Otherwise it degrades to a link that opens the full passage in a WEB
 * reader — so a reference is always at least clickable, never a dead end.
 *
 * Server component: the verse bundle is read on the server and only the
 * matched verse text is sent to the client, so the full bundle never ships
 * to the browser.
 */
export function ScriptureRef({ reference, className }: Props) {
  const entry = getVerseText(reference);
  if (!entry) {
    return (
      <a
        href={webReaderUrl(reference)}
        target="_blank"
        rel="noopener noreferrer"
        className={
          className ??
          "text-gold underline decoration-dotted decoration-1 underline-offset-2 hover:text-cream"
        }
      >
        {reference}
      </a>
    );
  }
  return (
    <VersePopover
      reference={entry.reference}
      text={entry.text}
      readerUrl={webReaderUrl(reference)}
      className={className}
    />
  );
}
