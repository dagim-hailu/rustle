import jwt from "jsonwebtoken";
import type { FastifyReply, FastifyRequest } from "fastify";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  locale: "en" | "am";
}

interface TokenClaims {
  sub: string;
  email: string;
  name: string;
  locale: "en" | "am";
  iat: number;
  exp: number;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function signToken(user: AuthUser, secret: string, ttlSeconds: number): string {
  return jwt.sign(
    { email: user.email, name: user.displayName, locale: user.locale },
    secret,
    {
      algorithm: "HS256",
      subject: user.id,
      expiresIn: ttlSeconds,
      issuer: "rustle-api",
      audience: "rustle-client"
    }
  );
}

export function verifyToken(token: string, secret: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
      issuer: "rustle-api",
      audience: "rustle-client"
    });

    if (typeof decoded !== "object" || decoded === null) return null;
    const claims = decoded as Partial<TokenClaims>;
    if (
      typeof claims.sub !== "string" ||
      !UUID_RE.test(claims.sub) ||
      typeof claims.email !== "string" ||
      typeof claims.name !== "string" ||
      (claims.locale !== "en" && claims.locale !== "am")
    ) {
      return null;
    }

    return {
      id: claims.sub,
      email: claims.email,
      displayName: claims.name,
      locale: claims.locale
    };
  } catch {
    return null;
  }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    await reply.code(401).send({ code: "UNAUTHORIZED", message: "Missing bearer token" });
    return;
  }

  const user = verifyToken(header.slice(7), request.server.config.jwtSecret);
  if (!user) {
    await reply.code(401).send({ code: "UNAUTHORIZED", message: "Invalid or expired token" });
    return;
  }

  request.authUser = user;
}

export function currentUser(request: FastifyRequest): AuthUser {
  if (!request.authUser) throw new Error("authenticated route without authUser");
  return request.authUser;
}
