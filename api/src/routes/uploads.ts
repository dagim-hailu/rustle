import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { requireAuth } from "../auth.js";
import { HttpError } from "../http.js";

type UploadKind = "image" | "audio" | "video";

export interface Detected {
  family: "image" | "container" | "audio";
  extension: string;
  mime: string;
}

const IMAGE_EXTENSIONS: Record<string, Detected> = {
  png: { family: "image", extension: "png", mime: "image/png" },
  jpg: { family: "image", extension: "jpg", mime: "image/jpeg" },
  gif: { family: "image", extension: "gif", mime: "image/gif" },
  webp: { family: "image", extension: "webp", mime: "image/webp" }
};

const CONTEXT = "?kind=image|audio|video";
const uploadQuerySchema = z.object({
  kind: z.enum(["image", "audio", "video"]).default("image")
});

export function detect(buffer: Buffer): Detected | null {
  const magic = buffer.subarray(0, 4).toString("hex");

  if (magic.startsWith("89504e47")) return IMAGE_EXTENSIONS.png!;
  if (magic.startsWith("ffd8ff")) return IMAGE_EXTENSIONS.jpg!;
  if (magic.startsWith("47494638")) return IMAGE_EXTENSIONS.gif!;
  if (
    magic === "52494646" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return IMAGE_EXTENSIONS.webp!;
  }

  // MediaRecorder in Chromium emits WebM for both audio and video. The
  // requested kind decides the extension/MIME served by the static handler.
  if (magic === "1a45dfa3") {
    return { family: "container", extension: "webm", mime: "video/webm" };
  }

  // ISO base media (MP4/M4A/QuickTime) exposes an ftyp box at offset 4.
  if (buffer.subarray(4, 8).toString("ascii") === "ftyp") {
    return { family: "container", extension: "mp4", mime: "video/mp4" };
  }

  if (magic === "4f676753") {
    return { family: "container", extension: "ogg", mime: "audio/ogg" };
  }

  if (
    magic === "52494646" &&
    buffer.subarray(8, 12).toString("ascii") === "WAVE"
  ) {
    return { family: "audio", extension: "wav", mime: "audio/wav" };
  }

  if (magic.startsWith("494433") || magic.startsWith("fffb") || magic.startsWith("fff3")) {
    return { family: "audio", extension: "mp3", mime: "audio/mpeg" };
  }

  return null;
}

export function extensionFor(detected: Detected, kind: UploadKind): { ext: string; mime: string } {
  if (detected.family === "image") {
    if (kind !== "image") {
      throw new HttpError(415, "UPLOAD_TYPE", "That file is an image, not audio or video");
    }
    return { ext: detected.extension, mime: detected.mime };
  }

  if (detected.family === "audio") {
    if (kind !== "audio") throw new HttpError(415, "UPLOAD_TYPE", "That file is audio, not video");
    return { ext: detected.extension, mime: detected.mime };
  }

  if (kind === "audio" && detected.extension === "webm") {
    return { ext: "weba", mime: "audio/webm" };
  }
  if (kind === "audio" && detected.extension === "mp4") {
    return { ext: "m4a", mime: "audio/mp4" };
  }
  if (kind === "audio" && detected.extension === "ogg") {
    return { ext: "oga", mime: "audio/ogg" };
  }
  if (kind === "video" && detected.extension === "ogg") {
    return { ext: "ogv", mime: "video/ogg" };
  }
  if (kind === "video") {
    return { ext: detected.extension, mime: detected.mime };
  }

  throw new HttpError(415, "UPLOAD_TYPE", "Unsupported or mismatched media type");
}

export const uploadRoutes: FastifyPluginAsync = async (app) => {
  await mkdir(app.config.uploadDir, { recursive: true });

  app.post("/api/uploads", { preHandler: requireAuth }, async (request, reply) => {
    const { kind } = uploadQuerySchema.parse(request.query ?? {});
    let file;
    try {
      file = await request.file();
    } catch {
      throw new HttpError(400, "UPLOAD_INVALID", "Expected one multipart file field");
    }

    if (!file) throw new HttpError(400, "UPLOAD_MISSING", "No file was uploaded");

    let buffer: Buffer;
    try {
      buffer = await file.toBuffer();
    } catch (error) {
      if ((error as { code?: string }).code === "FST_REQ_FILE_TOO_LARGE") {
        throw new HttpError(413, "UPLOAD_TOO_LARGE", "Media exceeds the upload size limit");
      }
      throw error;
    }

    if (buffer.length === 0) throw new HttpError(400, "UPLOAD_EMPTY", "Uploaded file is empty");
    if (buffer.length > app.config.maxUploadBytes) {
      throw new HttpError(413, "UPLOAD_TOO_LARGE", "Media exceeds the upload size limit");
    }

    const detected = detect(buffer);
    if (!detected) {
      throw new HttpError(
        415,
        "UPLOAD_TYPE",
        `Only images, audio and video are accepted; pass ${CONTEXT}`
      );
    }

    if (kind === "image" && detected.family !== "image") {
      throw new HttpError(415, "UPLOAD_TYPE", "Expected an image upload");
    }
    if (kind === "audio" && detected.family === "image") {
      throw new HttpError(415, "UPLOAD_TYPE", "Expected an audio upload");
    }
    if (kind === "video" && detected.family === "image") {
      throw new HttpError(415, "UPLOAD_TYPE", "Expected a video upload");
    }

    const target = extensionFor(detected, kind);
    const fileName = `${randomUUID()}.${target.ext}`;
    await writeFile(path.join(app.config.uploadDir, fileName), buffer, { mode: 0o644 });

    reply.code(201);
    return {
      url: `/uploads/${fileName}`,
      mimeType: target.mime,
      kind,
      size: buffer.length
    };
  });
};
