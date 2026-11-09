import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Member, PresenceStatus } from "../types";
import { ProfileCard } from "./ProfileCard";

export function MemberProfileDialog({
  member,
  presence,
  onClose
}: {
  member: Member | null;
  presence: PresenceStatus;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog.Root open={Boolean(member)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 focus:outline-none">
          <Dialog.Title className="sr-only">
            {member?.displayName ?? t("profile.profile")}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            {t("profile.memberProfile")}
          </Dialog.Description>
          <div className="relative">
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute end-2 top-2 z-10 inline-flex size-8 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur hover:bg-black/55"
                aria-label={t("common.close")}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
            {member && <ProfileCard profile={member} presence={presence} />}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
