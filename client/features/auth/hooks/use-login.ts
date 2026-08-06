"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { LoginFormValues } from "@/features/auth/schemas/login.schema";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  getAuthErrorMessage,
  getAuthFieldErrors,
} from "@/features/auth/utils/auth-errors";

export function useLogin() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationKey: ["auth", "login"],
    retry: false,
    mutationFn: async (values: LoginFormValues) => {
      return authService.login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });
    },
    onSuccess: (data, variables) => {
      login(
        {
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
        variables.rememberMe
      );
      router.replace("/dashboard");
    },
  });
}

export function getLoginErrorMessage(error: unknown): string {
  return getAuthErrorMessage(error);
}

export function getLoginFieldErrors(error: unknown): Record<string, string> {
  return getAuthFieldErrors(error);
}
