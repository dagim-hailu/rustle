import { mkdir } from "node:fs/promises";
import { buildApp } from "./app.js";
import { config } from "./config.js";
import { createPool, migrate } from "./db.js";
import { seedDemo } from "./seed.js";
import { ShieldClient } from "./shield.js";

const pool = createPool(config.databaseUrl);

async function waitForDatabase(attempts = 20): Promise<void> {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await pool.query("SELECT 1");
      return;
    } catch (error) {
      if (attempt === attempts) throw error;
      console.log(`database not ready (attempt ${attempt}/${attempts})`);
      await new Promise((resolve) => setTimeout(resolve, 2_000));
    }
  }
}

await waitForDatabase();
const applied = await migrate(pool, config.migrationsDir);
if (applied.length > 0) console.log(`Applied migrations: ${applied.join(", ")}`);

if (config.seedDemo) {
  const seeded = await seedDemo(pool, config.demoEmail, config.demoPassword);
  if (seeded.created) console.log(`Seeded demo account ${config.demoEmail}`);
}

await mkdir(config.uploadDir, { recursive: true });

const shield = new ShieldClient(config.shieldAddress, config.shieldProtoPath);
const app = await buildApp({ config, pool, shield });

let shuttingDown = false;
async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  app.log.info({ signal }, "shutting down");
  await app.close();
  shield.close();
  await pool.end();
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

try {
  await app.listen({ host: config.host, port: config.port });
  app.log.info({ shield: config.shieldAddress }, "api ready");
} catch (error) {
  app.log.error(error);
  shield.close();
  await pool.end();
  process.exit(1);
}
