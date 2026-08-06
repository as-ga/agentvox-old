import { AxiosError, isAxiosError } from "axios";

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface NormalizedApiError {
  message: string;
  statusCode: number | null;
  fieldErrors: ApiFieldError[];
  code: string | null;
}

interface ApiErrorBody {
  message?: string;
  detail?: string | Array<{ loc?: Array<string | number>; msg?: string }>;
  code?: string;
  errors?: Record<string, string[] | string>;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }

  return null;
}

function normalizeFieldErrors(body: ApiErrorBody | null): ApiFieldError[] {
  if (!body) {
    return [];
  }

  const fieldErrors: ApiFieldError[] = [];

  if (body.errors) {
    for (const [field, messages] of Object.entries(body.errors)) {
      if (Array.isArray(messages)) {
        for (const message of messages) {
          fieldErrors.push({ field, message });
        }
      } else {
        fieldErrors.push({ field, message: messages });
      }
    }
  }

  if (Array.isArray(body.detail)) {
    for (const item of body.detail) {
      const field = item.loc?.filter((part) => typeof part === "string").at(-1);
      if (field && item.msg) {
        fieldErrors.push({ field, message: item.msg });
      }
    }
  }

  return fieldErrors;
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;
    const body = asRecord(axiosError.response?.data) as ApiErrorBody | null;
    const fieldErrors = normalizeFieldErrors(body);
    const detailMessage =
      typeof body?.detail === "string" ? body.detail : undefined;

    return {
      message:
        body?.message ??
        detailMessage ??
        axiosError.message ??
        "Something went wrong. Please try again.",
      statusCode: axiosError.response?.status ?? null,
      fieldErrors,
      code: body?.code ?? null,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: null,
      fieldErrors: [],
      code: null,
    };
  }

  return {
    message: "Something went wrong. Please try again.",
    statusCode: null,
    fieldErrors: [],
    code: null,
  };
}
