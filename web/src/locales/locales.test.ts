import { describe, expect, it } from "vitest";
import en from "./en.json";
import am from "./am.json";

function flatten(value: unknown, prefix = ""): Map<string, string> {
  const result = new Map<string, string>();

  if (typeof value === "string") {
    result.set(prefix, value);
    return result;
  }

  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      for (const [childKey, childValue] of flatten(child, prefix ? `${prefix}.${key}` : key)) {
        result.set(childKey, childValue);
      }
    }
  }

  return result;
}

function placeholders(value: string): string[] {
  return [...value.matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1]!).sort();
}

const english = flatten(en);
const amharic = flatten(am);

describe("Amharic and English translation catalogs", () => {
  it("have exactly the same keys", () => {
    expect([...amharic.keys()].sort()).toEqual([...english.keys()].sort());
  });

  it("have no empty strings", () => {
    for (const [key, value] of [...english, ...amharic]) {
      expect(value.trim(), key).not.toBe("");
    }
  });

  it("preserve interpolation placeholders in every language", () => {
    for (const [key, value] of english) {
      expect(placeholders(amharic.get(key) ?? ""), key).toEqual(placeholders(value));
    }
  });

  it("use Ethiopic script for the Amharic catalog", () => {
    const joined = [...amharic.values()].join(" ");
    expect(/[\u1200-\u137F]/.test(joined)).toBe(true);
    expect(amharic.get("presence.online")).toBe("መስመር ላይ");
  });
});
