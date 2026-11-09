import { config } from "./config.js";
import { createPool, migrate } from "./db.js";

const pool = createPool(config.databaseUrl);

try {
  const applied = await migrate(pool, config.migrationsDir);
  console.log(
    applied.length > 0 ? `Applied migrations: ${applied.join(", ")}` : "No pending migrations."
  );
} finally {
  await pool.end();
}
