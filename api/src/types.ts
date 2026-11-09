import type { Pool } from "pg";
import type { AuthUser } from "./auth.js";
import type { ChannelEventBus } from "./events.js";
import type { ShieldClient } from "./shield.js";
import type { config as appConfig } from "./config.js";

declare module "fastify" {
  interface FastifyInstance {
    config: typeof appConfig;
    pool: Pool;
    shield: ShieldClient;
    events: ChannelEventBus;
  }

  interface FastifyRequest {
    authUser: AuthUser | null;
  }
}

export {};
