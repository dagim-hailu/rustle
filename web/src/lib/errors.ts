import { ApiError } from "./api";

const CODE_KEYS: Record<string, string> = {
  EMAIL_TAKEN: "errors.emailTaken",
  INVALID_CREDENTIALS: "errors.invalidCredentials",
  UNAUTHORIZED: "errors.sessionExpired",
  FORBIDDEN: "errors.notAllowed",
  CHANNEL_EXISTS: "errors.channelExists",
  USER_NOT_FOUND: "errors.userNotFound",
  ALREADY_MEMBER: "errors.alreadyMember",
  SEAT_LIMIT: "errors.seatLimit",
  NETWORK: "errors.network",
  RATE_LIMITED: "errors.rateLimited",
  VALIDATION_ERROR: "errors.required"
};

export function apiErrorKey(error: unknown, fallback = "errors.generic"): string {
  if (error instanceof ApiError) return CODE_KEYS[error.code] ?? fallback;
  return fallback;
}

export function chatErrorKey(code: string | null): string {
  if (!code) return "errors.generic";

  switch (code) {
    case "HISTORY_FAILED":
      return "errors.history";
    case "UPLOAD_FAILED":
      return "errors.upload";
    case "SEND_FAILED":
    case "SEND_TIMEOUT":
      return "errors.send";
    case "RATE_LIMITED":
      return "errors.rateLimited";
    case "NETWORK":
      return "errors.network";
    default:
      return CODE_KEYS[code] ?? "errors.generic";
  }
}
