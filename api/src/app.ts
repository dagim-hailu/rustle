import { mkdir } from "node:fs/promises";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import Fastify, { type FastifyInstance } from "fastify";
import type { Pool } from "pg";
import "./types.js";
import type { config as appConfig } from "./config.js";
import { ChannelEventBus } from "./events.js";
import { installErrorHandler } from "./http.js";
import { authRoutes } from "./routes/auth.js";
import { channelRoutes } from "./routes/channels.js";
import { communityRoutes } from "./routes/community.js";
import { guildRoutes } from "./routes/guilds.js";
import { internalRoutes } from "./routes/internal.js";
import { profileRoutes } from "./routes/profile.js";
import { uploadRoutes } from "./routes/uploads.js";
import type { ShieldClient } from "./shield.js";

export interface AppDependencies {
  config: typeof appConfig;
  pool: Pool;
  shield: ShieldClient;
}

export async function buildApp(deps: AppDependencies): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: deps.config.logLevel,
      redact: {
        paths: [
          "req.headers.authorization",
          "req.headers.cookie",
          "req.headers.x-internal-token",
          "res.headers.set-cookie"
        ],
        censor: "[redacted]"
      }
    },
    bodyLimit: 1_048_576,
    trustProxy: process.env.TRUST_PROXY === "true",
    disableRequestLogging: false
  });

  app.decorate("config", deps.config);
  app.decorate("pool", deps.pool);
  app.decorate("shield", deps.shield);
  app.decorateRequest("authUser", null);

  const events = new ChannelEventBus();
  await events.start(deps.pool);
  app.decorate("events", events);
  app.addHook("onClose", async () => {
    await events.stop();
  });

  await mkdir(deps.config.uploadDir, { recursive: true });

  await app.register(cors, {
    origin: deps.config.corsOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["authorization", "content-type"],
    maxAge: 600
  });

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        imgSrc: ["'self'", "data:"],
        frameAncestors: ["'none'"]
      }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
  });

  await app.register(rateLimit, {
    global: true,
    max: 300,
    timeWindow: "1 minute"
  });

  await app.register(multipart, {
    limits: {
      files: 1,
      fields: 4,
      fileSize: deps.config.maxUploadBytes
    }
  });

  await app.register(fastifyStatic, {
    root: deps.config.uploadDir,
    prefix: "/uploads/",
    index: false,
    cacheControl: true,
    maxAge: "1d",
    setHeaders(res) {
      res.setHeader("X-Content-Type-Options", "nosniff");
    }
  });

  installErrorHandler(app);

  app.get("/healthz", async (_request, reply) => {
    try {
      await deps.pool.query("SELECT 1");
      return { status: "ok", service: "api" };
    } catch (error) {
      app.log.error({ err: error }, "database health check failed");
      return reply.code(503).send({ status: "unavailable", service: "api" });
    }
  });

  await app.register(authRoutes);
  await app.register(guildRoutes);
  await app.register(channelRoutes);
  await app.register(communityRoutes);
  await app.register(profileRoutes);
  await app.register(uploadRoutes);
  await app.register(internalRoutes);

  return app;
}
