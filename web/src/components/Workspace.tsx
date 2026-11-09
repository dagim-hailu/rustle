import * as Dialog from "@radix-ui/react-dialog";
import { Hash, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/authStore";
import { presenceFor, useChatStore } from "../store/chatStore";
import { BrandMark } from "./Brand";
import { ChannelSettingsDialog } from "./ChannelSettingsDialog";
import { ChannelSidebar } from "./ChannelSidebar";
import { ChatView } from "./ChatView";
import { ConnectionBanner } from "./ConnectionBanner";
import { CreateChannelDialog } from "./CreateChannelDialog";
import { CreateGuildDialog } from "./CreateGuildDialog";
import { DigestPanel } from "./DigestPanel";
import { GuildRail } from "./GuildRail";
import { GuildSettingsDialog } from "./GuildSettingsDialog";
import { InviteDialog } from "./InviteDialog";
import { MemberProfileDialog } from "./MemberProfileDialog";
import { PinnedPanel } from "./PinnedPanel";
import { SavedPanel } from "./SavedPanel";
import { MemberList } from "./MemberList";
import { ProfileSettingsDialog } from "./ProfileSettingsDialog";
import { TopBar } from "./TopBar";
import type { Member } from "../types";

export function Workspace() {
  const { t } = useTranslation();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const guilds = useChatStore((state) => state.guilds);
  const activeGuildId = useChatStore((state) => state.activeGuildId);
  const activeChannelId = useChatStore((state) => state.activeChannelId);
  const setActiveGuild = useChatStore((state) => state.setActiveGuild);
  const setActiveChannel = useChatStore((state) => state.setActiveChannel);
  const presences = useChatStore((state) => state.presences);
  const selfStatus = useChatStore((state) => state.selfStatus);
  const socketStatus = useChatStore((state) => state.socketStatus);

  const [mobileChannels, setMobileChannels] = useState(false);
  const [createGuildOpen, setCreateGuildOpen] = useState(false);
  const [createChannelOpen, setCreateChannelOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [pinsOpen, setPinsOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [digestOpen, setDigestOpen] = useState(false);
  const [channelSettingsOpen, setChannelSettingsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  if (!token || !user) return null;

  const guild = guilds.find((entry) => entry.id === activeGuildId) ?? null;
  const channel = guild?.channels.find((entry) => entry.id === activeChannelId) ?? null;
  const canManage = guild?.role === "owner" || guild?.role === "admin";

  const selectChannel = (channelId: string) => {
    setActiveChannel(channelId);
    setMobileChannels(false);
  };

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-bg text-text">
      <GuildRail
        guilds={guilds}
        activeGuildId={activeGuildId}
        onSelect={setActiveGuild}
        onCreate={() => setCreateGuildOpen(true)}
      />

      <aside className="hidden w-64 shrink-0 border-e border-border md:block">
        <ChannelSidebar
          guild={guild}
          user={user}
          activeChannelId={activeChannelId}
          onSelectChannel={selectChannel}
          onCreateChannel={() => setCreateChannelOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenInvite={() => setInviteOpen(true)}
          onOpenProfile={() => setProfileOpen(true)}
        />
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar
          guild={guild}
          channel={channel}
          canManage={Boolean(canManage)}
          onOpenChannels={() => setMobileChannels(true)}
          onOpenPins={() => setPinsOpen(true)}
          onOpenSaved={() => setSavedOpen(true)}
          onOpenDigest={() => setDigestOpen(true)}
          onOpenChannelSettings={() => setChannelSettingsOpen(true)}
        />
        <ConnectionBanner />

        {channel ? (
          <ChatView key={channel.id} channel={channel} />
        ) : (
          <EmptyWorkspace
            hasGuild={Boolean(guild)}
            canManage={Boolean(canManage)}
            onCreateGuild={() => setCreateGuildOpen(true)}
            onCreateChannel={() => setCreateChannelOpen(true)}
          />
        )}
      </main>

      <MemberList guild={guild} user={user} onSelectMember={setSelectedMember} />

      <Dialog.Root open={mobileChannels} onOpenChange={setMobileChannels}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay md:hidden" />
          <Dialog.Content className="fixed inset-y-0 start-0 z-50 w-[86vw] max-w-[20rem] border-e border-border bg-surface-2 p-0 shadow-panel focus:outline-none md:hidden">
            <Dialog.Title className="sr-only">{t("nav.channels")}</Dialog.Title>
            <Dialog.Description className="sr-only">
              {t("nav.openChannels")}
            </Dialog.Description>
            <ChannelSidebar
              guild={guild}
              user={user}
              activeChannelId={activeChannelId}
              onSelectChannel={selectChannel}
              onCreateChannel={() => {
                setMobileChannels(false);
                setCreateChannelOpen(true);
              }}
              onOpenSettings={() => {
                setMobileChannels(false);
                setSettingsOpen(true);
              }}
              onOpenInvite={() => {
                setMobileChannels(false);
                setInviteOpen(true);
              }}
              onOpenProfile={() => {
                setMobileChannels(false);
                setProfileOpen(true);
              }}
              onClose={() => setMobileChannels(false)}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <CreateGuildDialog
        open={createGuildOpen}
        onOpenChange={setCreateGuildOpen}
        onCreated={() => setCreateGuildOpen(false)}
      />

      <CreateChannelDialog
        guildId={activeGuildId}
        open={createChannelOpen}
        onOpenChange={setCreateChannelOpen}
      />

      <GuildSettingsDialog
        guild={guild}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

      <ProfileSettingsDialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
        user={user}
      />

      <InviteDialog
        guild={guild}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />

      {channel && (
        <PinnedPanel
          channel={channel}
          canManage={Boolean(canManage)}
          open={pinsOpen}
          onOpenChange={setPinsOpen}
        />
      )}

      <SavedPanel open={savedOpen} onOpenChange={setSavedOpen} />

      <DigestPanel open={digestOpen} onOpenChange={setDigestOpen} />

      <ChannelSettingsDialog
        channel={channel}
        open={channelSettingsOpen}
        onOpenChange={setChannelSettingsOpen}
      />

      <MemberProfileDialog
        member={selectedMember}
        presence={
          selectedMember
            ? selectedMember.userId === user.id
              ? socketStatus === "connected"
                ? selfStatus
                : "offline"
              : presenceFor(presences, guild?.id ?? null, selectedMember.userId)
            : "offline"
        }
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}

function EmptyWorkspace({
  hasGuild,
  canManage,
  onCreateGuild,
  onCreateChannel
}: {
  hasGuild: boolean;
  canManage: boolean;
  onCreateGuild: () => void;
  onCreateChannel: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-surface p-6">
      <div
        className="pointer-events-none absolute -end-32 -top-32 size-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "var(--primary)" }}
        aria-hidden="true"
      />
      <div className="relative max-w-md text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-border bg-surface-2">
          {hasGuild ? (
            <Hash className="size-7 text-primary" aria-hidden="true" />
          ) : (
            <BrandMark className="size-11" />
          )}
        </div>
        <h2 className="mt-5 text-2xl font-bold">
          {hasGuild ? t("channel.createTitle") : t("guild.createTitle")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          {hasGuild ? t("channel.createBody") : t("guild.createBody")}
        </p>
        {(canManage || !hasGuild) && (
          <button
            type="button"
            className="btn-primary mt-6"
            onClick={hasGuild ? onCreateChannel : onCreateGuild}
          >
            <Plus className="size-4" aria-hidden="true" />
            {hasGuild ? t("channel.create") : t("guild.create")}
          </button>
        )}
      </div>
    </div>
  );
}
