import { attachmentUrl } from "../lib/api";
import { initials } from "../lib/format";
import type { PresenceStatus } from "../types";

const SIZES = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-xl"
} as const;

export function PresenceDot({
  status,
  className = ""
}: {
  status: PresenceStatus;
  className?: string;
}) {
  const color = {
    online: "bg-online",
    idle: "bg-idle",
    dnd: "bg-dnd",
    offline: "bg-offline"
  }[status];

  return (
    <span
      className={`inline-block size-2.5 shrink-0 rounded-full ring-2 ring-surface ${color} ${className}`}
      aria-hidden="true"
    />
  );
}

export function Avatar({
  name,
  color,
  src,
  size = "md",
  presence,
  className = ""
}: {
  name: string;
  color: string;
  src?: string | null;
  size?: keyof typeof SIZES;
  presence?: PresenceStatus;
  className?: string;
}) {
  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img
          src={attachmentUrl(src)}
          alt=""
          loading="lazy"
          decoding="async"
          className={`rounded-full object-cover shadow-sm ${SIZES[size]}`}
          aria-hidden="true"
        />
      ) : (
        <span
          className={`inline-flex items-center justify-center rounded-full font-bold text-white shadow-sm ${SIZES[size]}`}
          style={{ backgroundColor: color }}
          aria-hidden="true"
        >
          {initials(name)}
        </span>
      )}
      {presence && (
        <PresenceDot
          status={presence}
          className="absolute -bottom-0.5 -end-0.5 ring-surface"
        />
      )}
    </span>
  );
}
