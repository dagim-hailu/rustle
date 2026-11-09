import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./themes.css", import.meta.url), "utf8");

function tokens(theme: "light" | "dark"): Record<string, string> {
  const pattern = new RegExp(`\\[data-theme="${theme}"\\][^\\{]*\\{([\\s\\S]*?)\\n\\}`, "m");
  const block = css.match(pattern)?.[1];
  if (!block) throw new Error(`missing ${theme} theme`);
  const values: Record<string, string> = {};
  for (const match of block.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{6});/g)) {
    values[match[1]!.slice(2)] = match[2]!;
  }
  return values;
}

function luminance(hex: string): number {
  const channels = hex
    .replace("#", "")
    .match(/../g)!
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    );
  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
}

function contrast(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

const PAIRS = [
  ["text", "bg"],
  ["text", "surface"],
  ["text", "surface-2"],
  ["text", "surface-3"],
  ["text-muted", "bg"],
  ["text-muted", "surface"],
  ["text-muted", "surface-2"],
  ["primary", "surface"],
  ["on-primary", "primary"],
  ["on-primary", "primary-hover"],
  ["accent", "surface"],
  ["on-accent", "accent"],
  ["success", "surface"],
  ["warning", "surface"],
  ["danger", "surface"],
  ["danger", "danger-soft"],
  ["warning", "warning-soft"],
  ["success", "success-soft"],
  ["online", "surface"],
  ["idle", "surface"],
  ["dnd", "surface"],
  ["offline", "surface"],
  ["rail-text", "rail"],
  ["rail-muted", "rail"]
] as const;

for (const theme of ["light", "dark"] as const) {
  describe(`${theme} theme`, () => {
    const palette = tokens(theme);

    it("defines every semantic token exactly once", () => {
      for (const [name] of PAIRS) {
        expect(palette[name], `${theme} missing ${name}`).toMatch(/^#[0-9a-f]{6}$/i);
      }
    });

    it("meets WCAG AA (4.5:1) for normal-size text pairs", () => {
      for (const [foreground, background] of PAIRS) {
        const ratio = contrast(palette[foreground]!, palette[background]!);
        expect(ratio, `${theme}: ${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5);
      }
    });
  });
}
