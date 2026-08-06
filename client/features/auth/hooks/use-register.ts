"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { RegisterFormValues } from "@/features/auth/schemas/register.schema";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  getAuthErrorMessage,
  getAuthFieldErrors,
  isDuplicateEmailError,
} from "@/features/auth/utils/auth-errors";

export function useRegister() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationKey: ["auth", "register"],
    retry: false,
    mutationFn: async (values: RegisterFormValues) => {
      return authService.register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        acceptTerms: values.acceptTerms,
        receiveUpdates: values.receiveUpdates,
      });
    },
    onSuccess: (data) => {
      login(
        {
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
        false
      );
      router.replace("/dashboard");
    },
  });
}

export function getRegisterErrorMessage(error: unknown): string {
  if (isDuplicateEmailError(error)) {
    return "An account with this email already exists. Try signing in instead.";
  }

  return getAuthErrorMessage(error);
}

export function getRegisterFieldErrors(
  error: unknown
): Record<string, string> {
  const fieldErrors = getAuthFieldErrors(error);

  if (isDuplicateEmailError(error) && !fieldErrors.email) {
    return {
      ...fieldErrors,
      email: "This email is already registered",
    };
  }

  return fieldErrors;
}
