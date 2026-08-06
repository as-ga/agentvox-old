import { normalizeApiError } from "@/services/api/errors";

export function getAuthErrorMessage(error: unknown): string {
  return normalizeApiError(error).message;
}

export function getAuthFieldErrors(error: unknown): Record<string, string> {
  const normalized = normalizeApiError(error);

  return normalized.fieldErrors.reduce<Record<string, string>>(
    (accumulator, fieldError) => {
      if (!accumulator[fieldError.field]) {
        accumulator[fieldError.field] = fieldError.message;
      }
      return accumulator;
    },
    {}
  );
}

export function isDuplicateEmailError(error: unknown): boolean {
  const normalized = normalizeApiError(error);
  if (normalized.statusCode === 409) {
    return true;
  }

  if (normalized.code?.toLowerCase().includes("duplicate")) {
    return true;
  }

  return /already (exists|registered)|duplicate email/i.test(
    normalized.message
  );
}
