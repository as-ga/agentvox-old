"use client";

import { apiClient } from "@/services/api/client";
import type {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "@/features/auth/types/auth.types";

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>("/auth/login", {
      email: payload.email,
      password: payload.password,
      rememberMe: payload.rememberMe,
    });

    return data;
  },

  async refreshToken(
    payload: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    const { data } = await apiClient.post<RefreshTokenResponse>(
      "/auth/refresh",
      payload
    );

    return data;
  },

  async logout(payload: LogoutRequest): Promise<void> {
    await apiClient.post("/auth/logout", payload);
  },
};
