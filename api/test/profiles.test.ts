import { describe, expect, it } from "vitest";
import { HttpError } from "../src/http.js";
import { profileUpdateSchema, publicProfile } from "../src/profiles.js";
import { detect, extensionFor } from "../src/routes/uploads.js";
import type { BootstrapUser } from "../src/queries.js";

function imageBytes(): Buffer {
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    Buffer.alloc(16)
  ]);
}

describe("profile validation", () => {
  it("accepts a complete editable profile", () => {
    const parsed = profileUpdateSchema.parse({
      displayName: "Selam",
      pronouns: "she/her",
      bio: "Building calm software.",
      avatarColor: "#B7410E",
      bannerColor: "#0F4C5C",
      avatarUrl: "/uploads/11111111-1111-4111-8111-111111111111.png",
      bannerUrl: null,
      locale: "am"
    });

    expect(parsed.displayName).toBe("Selam");
    expect(parsed.avatarUrl).toContain("/uploads/");
  });

  it("rejects unsafe URLs, colors and unknown fields", () => {
    expect(() =>
      profileUpdateSchema.parse({ avatarUrl: "https://evil.example/avatar.png" })
    ).toThrow();
    expect(() => profileUpdateSchema.parse({ avatarColor: "red" })).toThrow();
    expect(() => profileUpdateSchema.parse({ isAdmin: true })).toThrow();
    expect(() => profileUpdateSchema.parse({})).toThrow();
  });

  it("accepts a status line and quiet hours", () => {
    const parsed = profileUpdateSchema.parse({
      statusText: "Deep work until noon",
      quietHoursEnabled: true,
      quietHoursStart: 22,
      quietHoursEnd: 7
    });

    expect(parsed.statusText).toBe("Deep work until noon");
    expect(parsed.quietHoursStart).toBe(22);
    expect(parsed.quietHoursEnd).toBe(7);
  });

  it("rejects out-of-range quiet hours and an over-long status", () => {
    expect(() => profileUpdateSchema.parse({ quietHoursStart: 24 })).toThrow();
    expect(() => profileUpdateSchema.parse({ quietHoursEnd: -1 })).toThrow();
    expect(() => profileUpdateSchema.parse({ statusText: "x".repeat(129) })).toThrow();
  });

  it("does not expose email in a public profile", () => {
    const user: BootstrapUser = {
      id: "11111111-1111-4111-8111-111111111111",
      email: "private@example.com",
      displayName: "Selam",
      avatarColor: "#B7410E",
      avatarUrl: null,
      bannerUrl: null,
      bannerColor: "#0F4C5C",
      bio: "Hello",
      pronouns: "",
      statusText: "Shipping Rustle",
      locale: "en",
      quietHoursEnabled: false,
      quietHoursStart: 22,
      quietHoursEnd: 7,
      createdAt: new Date("2026-01-01T00:00:00Z").toISOString()
    };

    const profile = publicProfile(user) as Record<string, unknown>;
    expect(profile.email).toBeUndefined();
    expect(profile.displayName).toBe("Selam");
    expect(profile.statusText).toBe("Shipping Rustle");
  });
});

describe("media detection", () => {
  it("detects images and WebM/MP4 containers", () => {
    expect(detect(imageBytes())?.mime).toBe("image/png");
    expect(detect(Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0, 0]))?.extension).toBe("webm");

    const mp4 = Buffer.alloc(16);
    mp4.write("ftyp", 4, "ascii");
    expect(detect(mp4)?.extension).toBe("mp4");

    const mp3 = Buffer.concat([Buffer.from("ID3"), Buffer.alloc(16)]);
    expect(detect(mp3)?.mime).toBe("audio/mpeg");
  });

  it("uses a distinct extension for audio and video WebM", () => {
    const webm = { family: "container" as const, extension: "webm", mime: "video/webm" };
    expect(extensionFor(webm, "audio")).toEqual({ ext: "weba", mime: "audio/webm" });
    expect(extensionFor(webm, "video")).toEqual({ ext: "webm", mime: "video/webm" });
  });

  it("rejects mismatched image/media kinds", () => {
    const image = { family: "image" as const, extension: "png", mime: "image/png" };
    const mp3 = { family: "audio" as const, extension: "mp3", mime: "audio/mpeg" };
    expect(() => extensionFor(image, "video")).toThrow(HttpError);
    expect(() => extensionFor(mp3, "video")).toThrow(HttpError);
  });
});
