"use client";

import { useMutation } from "@tanstack/react-query";

import type { ForgotPasswordFormValues } from "@/features/auth/schemas/forgot-password.schema";
import { authService } from "@/features/auth/services/auth.service";
import {
  getAuthErrorMessage,
  getAuthFieldErrors,
} from "@/features/auth/utils/auth-errors";

export function useForgotPassword() {
  return useMutation({
    mutationKey: ["auth", "forgot-password"],
    retry: false,
    mutationFn: async (values: ForgotPasswordFormValues) => {
      return authService.forgotPassword({
        email: values.email,
      });
    },
  });
}

export function getForgotPasswordErrorMessage(error: unknown): string {
  return getAuthErrorMessage(error);
}

export function getForgotPasswordFieldErrors(
  error: unknown
): Record<string, string> {
  return getAuthFieldErrors(error);
}
