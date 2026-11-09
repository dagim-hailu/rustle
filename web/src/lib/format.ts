export function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return Array.from(parts[0]!)[0] ?? "?";
  return `${Array.from(parts[0]!)[0] ?? ""}${Array.from(parts.at(-1) ?? "")[0] ?? ""}`.toUpperCase();
}

export function formatTime(timestampMs: number, locale: string): string {
  return new Intl.DateTimeFormat(locale === "am" ? "am-ET" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: locale !== "am"
  }).format(new Date(timestampMs));
}

export function formatFullDate(timestampMs: number, locale: string): string {
  return new Intl.DateTimeFormat(locale === "am" ? "am-ET" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(timestampMs));
}

export function formatDayLabel(
  timestampMs: number,
  locale: string,
  translate: (key: string) => string
): string {
  const date = new Date(timestampMs);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const day = 86_400_000;

  if (target === today) return translate("chat.today");
  if (target === today - day) return translate("chat.yesterday");
  return formatFullDate(timestampMs, locale);
}

export function isSameDay(a: number, b: number): boolean {
  const left = new Date(a);
  const right = new Date(b);
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}
