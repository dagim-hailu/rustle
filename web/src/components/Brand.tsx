import { useTranslation } from "react-i18next";

export function BrandMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="40" height="40" rx="12" fill="var(--primary)" />
      <path
        d="M11 13.5C11 12.1193 12.1193 11 13.5 11H26.5C27.8807 11 29 12.1193 29 13.5V23.5C29 24.8807 27.8807 26 26.5 26H18L13.2 30V26H13.5C12.1193 26 11 24.8807 11 23.5V13.5Z"
        fill="var(--on-primary)"
      />
      <path
        d="M16 17H24M16 21H21"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BrandWordmark({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2.5">
      <BrandMark />
      {!compact && (
        <span className="text-[17px] font-bold tracking-tight text-text">
          {t("app.name")}
        </span>
      )}
    </div>
  );
}
