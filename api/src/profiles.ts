import { z } from "zod";
import type { BootstrapUser } from "./queries.js";

export const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;
export const LOCAL_IMAGE_URL = /^\/uploads\/[0-9a-f-]{36}\.(png|jpg|jpeg|gif|webp)$/;

export const profileUpdateSchema = z
  .object({
    displayName: z.string().trim().min(2, "Display name is too short").max(48).optional(),
    pronouns: z.string().trim().max(40).optional(),
    bio: z.string().trim().max(190).optional(),
    avatarColor: z.string().regex(HEX_COLOR, "Avatar color must be a hex color").optional(),
    bannerColor: z.string().regex(HEX_COLOR, "Banner color must be a hex color").optional(),
    avatarUrl: z.string().regex(LOCAL_IMAGE_URL).nullable().optional(),
    bannerUrl: z.string().regex(LOCAL_IMAGE_URL).nullable().optional(),
    locale: z.enum(["en", "am"]).optional(),
    statusText: z.string().trim().max(128).optional(),
    quietHoursEnabled: z.boolean().optional(),
    quietHoursStart: z.number().int().min(0).max(23).optional(),
    quietHoursEnd: z.number().int().min(0).max(23).optional()
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, "No profile fields supplied");

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1).max(128),
    newPassword: z.string().min(10, "Password must be at least 10 characters").max(128)
  })
  .strict();

export function publicProfile(user: BootstrapUser) {
  return {
    id: user.id,
    displayName: user.displayName,
    avatarColor: user.avatarColor,
    avatarUrl: user.avatarUrl,
    bannerUrl: user.bannerUrl,
    bannerColor: user.bannerColor,
    bio: user.bio,
    pronouns: user.pronouns,
    statusText: user.statusText,
    locale: user.locale,
    createdAt: user.createdAt
  };
}
