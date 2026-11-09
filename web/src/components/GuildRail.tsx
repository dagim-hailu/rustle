import * as Tooltip from "@radix-ui/react-tooltip";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Guild } from "../types";
import { BrandMark } from "./Brand";

interface Props {
  guilds: Guild[];
  activeGuildId: string | null;
  onSelect: (guildId: string) => void;
  onCreate: () => void;
}

export function GuildRail({ guilds, activeGuildId, onSelect, onCreate }: Props) {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t("nav.servers")}
      className="flex w-[70px] shrink-0 flex-col items-center gap-2 border-e border-black/20 bg-rail px-2 py-3 text-rail-text"
    >
      <div className="mb-1 flex size-12 items-center justify-center" aria-hidden="true">
        <BrandMark className="size-11" />
      </div>

      <div className="h-px w-8 bg-white/10" aria-hidden="true" />

      <div className="flex flex-1 flex-col items-center gap-2 overflow-y-auto no-scrollbar py-1">
        {guilds.map((guild) => {
          const active = guild.id === activeGuildId;

          return (
            <Tooltip.Root key={guild.id}>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  aria-label={guild.name}
                  aria-pressed={active}
                  onClick={() => onSelect(guild.id)}
                  className={`group relative flex size-12 items-center justify-center rounded-2xl text-sm font-bold text-white transition-all duration-150 hover:rounded-xl ${
                    active ? "rounded-xl shadow-md" : "opacity-85 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: guild.iconColor }}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute start-[-10px] w-1 rounded-e-full bg-white transition-all ${
                      active ? "h-8" : "h-0 group-hover:h-4"
                    }`}
                  />
                  {Array.from(guild.name.trim())[0]?.toUpperCase() ?? "?"}
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  sideOffset={8}
                  className="z-50 rounded-lg bg-rail px-2.5 py-1.5 text-xs font-semibold text-rail-text shadow-panel"
                >
                  {guild.name}
                  <Tooltip.Arrow className="fill-[var(--rail)]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          );
        })}

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              onClick={onCreate}
              className="flex size-12 items-center justify-center rounded-2xl border border-dashed border-white/25 text-rail-muted transition-all hover:rounded-xl hover:border-white/50 hover:bg-white/10 hover:text-white"
              aria-label={t("nav.addServer")}
            >
              <Plus className="size-5" aria-hidden="true" />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="right"
              sideOffset={8}
              className="z-50 rounded-lg bg-rail px-2.5 py-1.5 text-xs font-semibold text-rail-text shadow-panel"
            >
              {t("nav.addServer")}
              <Tooltip.Arrow className="fill-[var(--rail)]" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
    </nav>
  );
}
