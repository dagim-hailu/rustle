import { Fragment, type ReactNode } from "react";

// Mentions span Latin, digits, underscores, dots, dashes and the Ethiopic
// block so "@selam_ተ" highlights the same way "@selam" does.
const MENTION_RE = /(@[A-Za-z0-9_\u1200-\u137F][A-Za-z0-9_.\-\u1200-\u137F]*)/g;

export function MessageContent({ content }: { content: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  MENTION_RE.lastIndex = 0;
  while ((match = MENTION_RE.exec(content)) !== null) {
    const token = match[1]!;
    if (match.index > last) parts.push(content.slice(last, match.index));
    const broadcast = token === "@everyone" || token === "@here";
    parts.push(
      <span
        key={`${match.index}-${token}`}
        className={broadcast ? "mention mention-broadcast" : "mention"}
      >
        {token}
      </span>
    );
    last = match.index + token.length;
  }

  if (last < content.length) parts.push(content.slice(last));

  return (
    <p
      dir="auto"
      className="whitespace-pre-wrap break-words text-[14.5px] leading-[1.6] text-text"
    >
      {parts.map((part, index) => (
        <Fragment key={index}>{part}</Fragment>
      ))}
    </p>
  );
}
