import path from "node:path";

function intEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) throw new Error(`${name} must be an integer`);
  return parsed;
}

function listEnv(name: string, fallback: string): string[] {
  return (process.env[name] ?? fallback)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

const defaultMigrationsDir = path.resolve(process.cwd(), "..", "db", "postgres", "migrations");

export const config = {
  host: process.env.API_HOST ?? "0.0.0.0",
  port: intEnv("API_PORT", 8080),
  databaseUrl:
    process.env.DATABASE_URL ??
    "postgres://rustle:rustle_dev_password@localhost:5432/rustle",
  jwtSecret:
    process.env.JWT_SECRET ??
    "dev-only-rustle-jwt-secret-change-me-0123456789abcdef",
  jwtTtlSeconds: intEnv("JWT_TTL_SECONDS", 86_400),
  internalToken:
    process.env.INTERNAL_API_TOKEN ?? "dev-only-internal-token-change-me",
  shieldAddress: process.env.SHIELD_ADDRESS ?? "localhost:50051",
  shieldProtoPath:
    process.env.SHIELD_PROTO_PATH ?? path.resolve(process.cwd(), "..", "proto", "shield.proto"),
  migrationsDir: process.env.MIGRATIONS_DIR ?? defaultMigrationsDir,
  corsOrigins: listEnv("CORS_ORIGINS", "http://localhost:3000"),
  uploadDir: process.env.UPLOAD_DIR ?? path.resolve(process.cwd(), "uploads"),
  maxUploadBytes: intEnv("MAX_UPLOAD_BYTES", 25 * 1024 * 1024),
  seedDemo: process.env.SEED_DEMO === "true",
  demoEmail: process.env.DEMO_EMAIL ?? "demo@rustle.local",
  demoPassword: process.env.DEMO_PASSWORD ?? "DemoPassw0rd!",
  logLevel: process.env.LOG_LEVEL ?? "info",
  publicOrigin: process.env.PUBLIC_API_ORIGIN ?? ""
};
