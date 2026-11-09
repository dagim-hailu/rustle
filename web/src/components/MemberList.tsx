import { ShieldCheck, Crown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { presenceFor, useChatStore } from "../store/chatStore";
import type { Guild, Member, PresenceStatus, User } from "../types";
import { Avatar } from "./Avatar";

const GROUPS: PresenceStatus[] = ["online", "idle", "dnd", "offline"];

export function MemberList({
  guild,
  user,
  onSelectMember
}: {
  guild: Guild | null;
  user: User;
  onSelectMember: (member: Member) => void;
}) {
  const { t } = useTranslation();
  const presences = useChatStore((state) => state.presences);
  const selfStatus = useChatStore((state) => state.selfStatus);
  const socketStatus = useChatStore((state) => state.socketStatus);

  if (!guild) {
    return <aside className="hidden w-60 shrink-0 border-s border-border bg-surface-2 xl:block" />;
  }

  const effectiveSelf = socketStatus === "connected" ? selfStatus : "offline";
  const withPresence = guild.members.map((member) => ({
    member,
    presence:
      member.userId === user.id
        ? effectiveSelf
        : presenceFor(presences, guild.id, member.userId)
  }));

  return (
    <aside
      className="hidden w-60 shrink-0 flex-col overflow-y-auto scrollbar-thin border-s border-border bg-surface-2 xl:flex"
      aria-label={t("nav.members")}
    >
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
        <h2 className="text-sm font-bold text-text">{t("nav.members")}</h2>
        <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted">
          {guild.members.length}
        </span>
      </header>

      <div className="flex-1 px-2 py-3">
        {GROUPS.map((status) => {
          const members = withPresence
            .filter((entry) => entry.presence === status)
            .map((entry) => entry.member);

          if (members.length === 0) return null;

          return (
            <section key={status} className="mb-5">
              <h3 className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
                {t(`presence.${status}`)} — {members.length}
              </h3>
              <ul className="space-y-0.5">
                {members.map((member) => (
                  <MemberRow
                    key={member.userId}
                    member={member}
                    presence={status}
                    isCurrent={member.userId === user.id}
                    onSelect={() => onSelectMember(member)}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </aside>
  );
}

function MemberRow({
  member,
  presence,
  isCurrent,
  onSelect
}: {
  member: Member;
  presence: PresenceStatus;
  isCurrent: boolean;
  onSelect: () => void;
}) {
  const { t } = useTranslation();
  const offline = presence === "offline";

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-start transition-colors hover:bg-surface-3 ${
          offline ? "opacity-65" : ""
        }`}
      >
        <Avatar
          name={member.displayName}
          color={member.avatarColor}
          src={member.avatarUrl}
          size="sm"
          presence={presence}
        />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium text-text">
              {member.displayName}
            </span>
            {isCurrent && (
              <span className="rounded bg-surface px-1 py-0.5 text-[9px] font-semibold text-muted">
                {t("common.you")}
              </span>
            )}
          </span>
        </span>
        {member.role === "owner" && (
          <Crown className="size-3.5 text-warning" aria-label={t("guild.roleOwner")} />
        )}
        {member.role === "admin" && (
          <ShieldCheck className="size-3.5 text-accent" aria-label={t("guild.roleAdmin")} />
        )}
      </button>
    </li>
  );
}
