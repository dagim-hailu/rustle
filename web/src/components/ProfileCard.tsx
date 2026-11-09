import { useTranslation } from "react-i18next";
import { attachmentUrl } from "../lib/api";
import type { Member, PresenceStatus, User } from "../types";
import { Avatar } from "./Avatar";

type ProfileLike = (User | Member) & {
  userId?: string;
  role?: "owner" | "admin" | "member";
};

export function ProfileCard({
  profile,
  presence,
  compact = false
}: {
  profile: ProfileLike;
  presence?: PresenceStatus;
  compact?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const displayName = profile.displayName;
  const bannerStyle = profile.bannerUrl
    ? {
        backgroundImage: `url(${attachmentUrl(profile.bannerUrl)})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }
    : { backgroundColor: profile.bannerColor };

  const role = profile.role;
  const createdAt = profile.createdAt
    ? new Intl.DateTimeFormat(i18n.language === "am" ? "am-ET" : "en-GB", {
        month: "long",
        year: "numeric"
      }).format(new Date(profile.createdAt))
    : null;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-panel">
      <div className={`relative ${compact ? "h-20" : "h-28"}`} style={bannerStyle}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
        {role && (
          <span className="absolute end-12 top-3 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
            {t(`guild.role${role === "owner" ? "Owner" : role === "admin" ? "Admin" : "Member"}`)}
          </span>
        )}
      </div>

      <div className={`relative px-5 ${compact ? "pb-4" : "pb-5"}`}>
        <div className="-mt-9 flex items-end justify-between">
          <Avatar
            name={displayName}
            color={profile.avatarColor}
            src={profile.avatarUrl}
            size={compact ? "lg" : "xl"}
            presence={presence}
            className="[&>img]:ring-4 [&>span]:ring-4 [&>img]:ring-surface [&>span]:ring-surface"
          />
          {presence && (
            <span className="mb-1 text-[11px] font-medium text-muted">
              {t(`presence.${presence}`)}
            </span>
          )}
        </div>

        <h2 className="mt-2 text-xl font-bold text-text">
          {displayName}
          {profile.pronouns && (
            <span className="ms-2 text-xs font-medium text-muted">{profile.pronouns}</span>
          )}
        </h2>
        <div className="mt-4 border-t border-border pt-3">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted">
            {t("profile.aboutMe")}
          </h3>
          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-text" dir="auto">
            {profile.bio || t("profile.noBio")}
          </p>
        </div>

        {createdAt && (
          <div className="mt-4 border-t border-border pt-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted">
              {t("profile.memberSince")}
            </h3>
            <p className="mt-1 text-sm text-text">{createdAt}</p>
          </div>
        )}
      </div>
    </article>
  );
}
