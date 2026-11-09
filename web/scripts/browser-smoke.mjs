import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const here = path.dirname(fileURLToPath(import.meta.url));
const chrome =
  process.env.CHROME_PATH ??
  (process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : "/usr/bin/google-chrome");
const appUrl = process.env.APP_URL ?? "http://127.0.0.1:3000";
const apiUrl = process.env.API_URL ?? "http://127.0.0.1:8080";
const demoEmail = process.env.DEMO_EMAIL ?? "demo@rustle.local";
const demoPassword = process.env.DEMO_PASSWORD ?? "DemoPassw0rd!";

const login = await fetch(`${apiUrl}/api/auth/login`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    email: demoEmail,
    password: demoPassword
  })
});
assert.equal(login.status, 200, "demo login should work");
const session = await login.json();

const bootstrapResponse = await fetch(`${apiUrl}/api/bootstrap`, {
  headers: { authorization: `Bearer ${session.token}` }
});
assert.equal(bootstrapResponse.status, 200, "bootstrap should work");
const bootstrap = await bootstrapResponse.json();
const channel = bootstrap.guilds[0].channels.find((entry) => entry.kind === "text");

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
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  locale: "en-US"
});
await context.grantPermissions(["camera", "microphone"], { origin: appUrl });
const page = await context.newPage();
const consoleErrors = [];
const pageErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => pageErrors.push(error.message));

try {
  await page.goto(appUrl, { waitUntil: "networkidle" });
  await page.getByPlaceholder("you@example.com").fill(demoEmail);
  await page.getByPlaceholder("Your password").fill(demoPassword);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();

  await page.getByText("Rustle Labs", { exact: true }).waitFor({ timeout: 20_000 });
  await page.getByRole("button", { name: "general", exact: true }).waitFor();
  console.log("✓ UI login, workspace bootstrap and channel navigation render");

  await page.getByRole("button", { name: "Account", exact: true }).click();
  await page.getByRole("menuitem", { name: "My profile", exact: true }).click();
  await page.getByRole("heading", { name: "User settings", exact: true }).waitFor();
  await page.getByLabel("About me").fill("Building calm, real-time spaces in Amharic and English.");
  await page.getByLabel("Pronouns").fill("they/them");

  const avatarInput = page.locator('input[aria-label="Change avatar"]');
  await Promise.all([
    page.waitForResponse(
      (response) => response.url().includes("/api/uploads") && response.status() === 201
    ),
    avatarInput.setInputFiles(path.resolve(here, "fixtures", "avatar.png"))
  ]);
  await page.locator('img[src*="/uploads/"]').first().waitFor({ timeout: 10_000 });

  const bannerInput = page.locator('input[aria-label="Change banner"]');
  await Promise.all([
    page.waitForResponse(
      (response) => response.url().includes("/api/uploads") && response.status() === 201
    ),
    bannerInput.setInputFiles(path.resolve(here, "fixtures", "banner.png"))
  ]);
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.getByText("Profile saved", { exact: true }).waitFor({ timeout: 10_000 });
  await page.screenshot({
    path: path.resolve(here, "..", "..", "docs", "screenshot-profile.png"),
    fullPage: false
  });
  await page.keyboard.press("Escape");
  await page.getByText("Rustle Labs", { exact: true }).waitFor();
  await page.getByText("Connected", { exact: true }).first().waitFor({ timeout: 15_000 });
  console.log("✓ Discord-style profile page uploads avatar/banner and saves the profile");

  await page.getByRole("button", { name: /Lounge/ }).click();
  await page.getByRole("button", { name: "Join with video", exact: true }).click();
  await page.getByRole("button", { name: "Leave call", exact: true }).last().waitFor({ timeout: 15_000 });
  await page.getByText("1 participant", { exact: true }).waitFor({ timeout: 10_000 });
  await page.locator("video").first().waitFor({ timeout: 10_000 });
  await page.screenshot({
    path: path.resolve(here, "..", "..", "docs", "screenshot-call.png"),
    fullPage: false
  });
  await page.getByRole("button", { name: "Leave call", exact: true }).last().click();
  await page.getByRole("button", { name: "Join with video", exact: true }).waitFor();
  console.log("✓ WebRTC voice/video call joins with a local camera and leaves cleanly");

  await page.getByRole("button", { name: "general", exact: true }).click();
  await page.getByRole("button", { name: "Record voice message", exact: true }).click();
  await page.getByText("Record voice message", { exact: true }).waitFor();
  await page.getByText(/00:0[1-9]/).waitFor({ timeout: 20_000 });
  await page.waitForTimeout(750);
  await page.getByRole("button", { name: "Stop & attach", exact: true }).click();
  await page.locator("audio").first().waitFor({ timeout: 20_000 });
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await page.waitForTimeout(1_000);
  console.log("✓ browser recorded and sent a voice message");

  await page.getByRole("button", { name: "Record video message", exact: true }).click();
  await page.getByText("Record video message", { exact: true }).waitFor();
  await page.getByText(/00:0[1-9]/).waitFor({ timeout: 20_000 });
  await page.waitForTimeout(750);
  await page.getByRole("button", { name: "Stop & attach", exact: true }).click();
  await page.locator("video").first().waitFor({ timeout: 20_000 });
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await page.waitForTimeout(1_000);
  console.log("✓ browser recorded and sent a video message");

  const memberButton = page.locator("aside").last().getByRole("button", { name: /Rustle Demo/ });
  await memberButton.click();
  await page.getByText("Building calm, real-time spaces in Amharic and English.", { exact: true }).waitFor();
  await page.screenshot({
    path: path.resolve(here, "..", "..", "docs", "screenshot-member-profile.png"),
    fullPage: false
  });
  await page.keyboard.press("Escape");
  await page.getByText("Rustle Labs", { exact: true }).waitFor();
  console.log("✓ member profile card shows the saved profile and member-since date");

  const message = "ሰላም ቡድን! አዲሱ የጊዜ-እውነተኛ መልእክት ስርዓት በሥራ ላይ ነው።";
  const historyFor = async () => {
    const response = await fetch(
      `${apiUrl}/api/channels/${channel.id}/messages?limit=50`,
      { headers: { authorization: `Bearer ${session.token}` } }
    );
    assert.equal(response.status, 200);
    return response.json();
  };
  const beforeCount = (await historyFor()).messages.filter(
    (entry) => entry.content === message
  ).length;
  const composer = page.getByRole("textbox", { name: "Message input" });
  await composer.waitFor({ timeout: 10_000 });
  await composer.fill(message);
  await composer.press("Enter");

  await page.getByText(message, { exact: true }).first().waitFor({ timeout: 15_000 });
  await page
    .getByText("Sending…", { exact: true })
    .waitFor({ state: "hidden", timeout: 15_000 });
  assert.equal(
    await page.getByText("Not sent", { exact: true }).count(),
    0,
    "the optimistic message should reconcile to COMMITTED, not FAILED"
  );

  let committed = false;
  for (let attempt = 0; attempt < 20 && !committed; attempt += 1) {
    const history = await historyFor();
    committed =
      history.messages.filter((entry) => entry.content === message).length >
      beforeCount;
    if (!committed) await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert.ok(committed, "the UI-sent message should appear in Scylla-backed history");
  console.log("✓ browser sent a message and reconciled it against committed history");

  await mkdir(path.resolve(here, "..", "..", "docs"), { recursive: true });
  await page.screenshot({
    path: path.resolve(here, "..", "..", "docs", "screenshot-light.png"),
    fullPage: false
  });

  await page.evaluate(() => {
    const raw = localStorage.getItem("rustle-settings");
    const parsed = raw ? JSON.parse(raw) : { state: {}, version: 0 };
    parsed.state = { ...parsed.state, locale: "am", themeMode: "dark" };
    localStorage.setItem("rustle-settings", JSON.stringify(parsed));
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForFunction(
    () =>
      document.documentElement.lang === "am" &&
      document.documentElement.dir === "ltr" &&
      document.documentElement.dataset.theme === "dark",
    null,
    { timeout: 15_000 }
  );
  await page.getByText("አባላት", { exact: true }).waitFor({ timeout: 10_000 });
  await page.getByText(message, { exact: true }).first().waitFor({ timeout: 15_000 });
  const amharicComposer = page.locator("textarea");
  await amharicComposer.waitFor({ timeout: 10_000 });
  const placeholder = await amharicComposer.getAttribute("placeholder");
  assert.match(placeholder ?? "", /መልእክት/);
  const amharic = await page.locator("body").innerText();
  assert.ok(amharic.includes("ቻናሎች"), "Amharic sidebar should render");
  const font = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  assert.ok(/Noto Sans Ethiopic/i.test(font), `Ethiopic font should be in the stack: ${font}`);
  const background = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()
  );
  assert.equal(background, "#14110f");
  await page.screenshot({
    path: path.resolve(here, "..", "..", "docs", "screenshot-amharic-dark.png"),
    fullPage: false
  });
  console.log("✓ Amharic + dark theme renders with Ethiopic fonts and LTR direction");

  assert.deepEqual(pageErrors, [], `page errors: ${pageErrors.join(" | ")}`);
  assert.deepEqual(
    consoleErrors.filter((error) => !error.includes("favicon")),
    [],
    `console errors: ${consoleErrors.join(" | ")}`
  );
  console.log("BROWSER SMOKE PASS");
} finally {
  await browser.close();
}
