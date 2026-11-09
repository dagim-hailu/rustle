import { useState } from "react";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import type { ChatMessageView, ReactionGroup } from "../types";

export function ReactionBar({ message }: { message: ChatMessageView }) {
  const token = useAuthStore((state) => state.token);
  const currentUserId = useChatStore((state) => state.currentUserId);
  const applyChannelEvent = useChatStore((state) => state.applyChannelEvent);
  const [busy, setBusy] = useState(false);

  const reactions = message.reactions ?? [];
  if (reactions.length === 0) return null;

  async function toggle(group: ReactionGroup) {
    if (!token || busy) return;
    setBusy(true);
    try {
      const result = group.mine
        ? await api.unreact(token, message.channelId, message.id, group.emoji)
        : await api.react(token, message.channelId, message.id, group.emoji);
      applyChannelEvent({
        type: "reaction",
        channelId: message.channelId,
        messageId: message.id,
        emoji: group.emoji,
        count: result.count,
        userId: currentUserId ?? "",
        added: result.mine
      });
    } catch {
      // Leave the optimistic state untouched; the SSE stream will reconcile.
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {reactions.map((group) => (
        <button
          key={group.emoji}
          type="button"
          disabled={busy}
          onClick={() => void toggle(group)}
          aria-pressed={group.mine}
          title={group.emoji}
          className={`reaction-chip ${group.mine ? "reaction-chip-active" : ""}`}
        >
          <span aria-hidden="true">{group.emoji}</span>
          <span className="font-semibold tabular-nums">{group.count}</span>
        </button>
      ))}
    </div>
  );
}
