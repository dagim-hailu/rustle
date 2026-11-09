import type { FastifyError, FastifyInstance, FastifyReply } from "fastify";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
  }
}

export function sendError(
  reply: FastifyReply,
  statusCode: number,
  code: string,
  message: string
): FastifyReply {
  return reply.code(statusCode).send({ code, message });
}

export function installErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error: FastifyError | HttpError | ZodError, request, reply) => {
    if (error instanceof ZodError) {
      return sendError(reply, 400, "VALIDATION_ERROR", error.issues[0]?.message ?? "Invalid input");
    }

    if (error instanceof HttpError) {
      return sendError(reply, error.statusCode, error.code, error.message);
    }

    const statusCode = "statusCode" in error && error.statusCode ? error.statusCode : 500;
    if (statusCode >= 500) {
      request.log.error({ err: error }, "request failed");
      return sendError(reply, statusCode, "INTERNAL_ERROR", "Internal server error");
    }

    return sendError(reply, statusCode, error.code ?? "REQUEST_ERROR", error.message);
  });

  app.setNotFoundHandler((_request, reply) =>
    sendError(reply, 404, "NOT_FOUND", "Route not found")
  );
}
