import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const here = path.dirname(fileURLToPath(import.meta.url));
const chrome =
  process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const appUrl = process.env.APP_URL ?? "http://127.0.0.1:3000";
const apiUrl = process.env.API_URL ?? "http://127.0.0.1:8080";

async function api(pathname, { method = "GET", token, body } = {}) {
  const response = await fetch(`${apiUrl}${pathname}`, {
    method,
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = response.headers.get("content-type")?.includes("application/json")
    ? await response.json()
    : null;
  if (!response.ok) throw new Error(`${method} ${pathname}: ${response.status} ${JSON.stringify(data)}`);
  return data;
}

const demo = await api("/api/auth/login", {
  method: "POST",
  body: { email: "demo@rustle.local", password: "DemoPassw0rd!" }
});
const demoBootstrap = await api("/api/bootstrap", { token: demo.token });
const demoGuild = demoBootstrap.guilds.find((guild) => guild.name === "Rustle Labs");
assert.ok(demoGuild, "demo guild should exist");

const suffix = Date.now();
const email = `call-smoke-${suffix}@example.com`;
const password = "CallSmokePass!123";
const guest = await api("/api/auth/register", {
  method: "POST",
  body: { email, password, displayName: "Call Guest", locale: "en" }
});
await api(`/api/guilds/${demoGuild.id}/billing`, {
  method: "PUT",
  token: demo.token,
  body: { plan: "pro", seats: 100, status: "active" }
});
await api(`/api/guilds/${demoGuild.id}/members`, {
  method: "POST",
  token: demo.token,
  body: { email }
});

const browser = await chromium.launch({
  executablePath: chrome,
  headless: true,
  args: [
    "--disable-gpu",
    "--no-first-run",
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
    `--use-file-for-fake-audio-capture=${path.resolve(here, "fixtures", "voice.wav")}`,
    "--autoplay-policy=no-user-gesture-required"
  ]
});

const contextA = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const contextB = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await contextA.grantPermissions(["camera", "microphone"], { origin: appUrl });
await contextB.grantPermissions(["camera", "microphone"], { origin: appUrl });
const pageA = await contextA.newPage();
const pageB = await contextB.newPage();
const errors = [];
for (const [label, page] of [
  ["A", pageA],
  ["B", pageB]
]) {
  page.on("pageerror", (error) => errors.push(`${label}: ${error.message}`));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      !message.text().includes("status of 404")
    ) {
      errors.push(`${label} console: ${message.text()}`);
    }
  });
}

try {
  await pageA.goto(appUrl, { waitUntil: "networkidle" });
  await pageA.getByPlaceholder("you@example.com").fill("demo@rustle.local");
  await pageA.getByPlaceholder("Your password").fill("DemoPassw0rd!");
  await pageA.getByRole("button", { name: "Sign in", exact: true }).click();
  await pageA.getByText("Rustle Labs", { exact: true }).waitFor({ timeout: 20_000 });
  await pageA.getByRole("button", { name: /Lounge/ }).click();
  await pageA.getByRole("button", { name: "Join with video", exact: true }).click();
  await pageA.getByRole("button", { name: "Leave call", exact: true }).last().waitFor({ timeout: 20_000 });
  await pageA.getByText("1 participant", { exact: true }).waitFor({ timeout: 10_000 });

  await pageB.goto(appUrl, { waitUntil: "networkidle" });
  await pageB.getByPlaceholder("you@example.com").fill(email);
  await pageB.getByPlaceholder("Your password").fill(password);
  await pageB.getByRole("button", { name: "Sign in", exact: true }).click();
  await pageB.getByRole("button", { name: "Rustle Labs", exact: true }).waitFor({ timeout: 20_000 });
  await pageB.getByText("Connected", { exact: true }).first().waitFor({ timeout: 15_000 });
  await pageB.getByRole("button", { name: "Rustle Labs", exact: true }).click();
  await pageB.getByRole("button", { name: /Lounge/ }).click();
  await pageB.getByRole("button", { name: "Join voice", exact: true }).click();

  await pageB.getByText("2 participants", { exact: true }).waitFor({ timeout: 20_000 });
  await pageA.getByText("2 participants", { exact: true }).waitFor({ timeout: 20_000 });
  await pageB.locator("video").first().waitFor({ timeout: 20_000 });

  await pageA.screenshot({
    path: path.resolve(here, "..", "..", "docs", "screenshot-call-two.png"),
    fullPage: false
  });
  console.log("✓ two real Chrome peers joined one call across the WebRTC mesh");

  await pageB.getByRole("button", { name: "Leave call", exact: true }).last().click();
  await pageA.getByText("1 participant", { exact: true }).waitFor({ timeout: 10_000 });
  await pageA.getByRole("button", { name: "Leave call", exact: true }).last().click();

  assert.deepEqual(errors, [], errors.join(" | "));
  console.log("CALL SMOKE PASS");
} finally {
  await browser.close();
}
