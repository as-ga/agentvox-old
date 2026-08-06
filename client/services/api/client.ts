"use client";

import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/config/env";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { RefreshTokenResponse } from "@/features/auth/types/auth.types";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(client: AxiosInstance): Promise<string | null> {
  const { refreshToken, setTokens, clearAuth } = useAuthStore.getState();

  if (!refreshToken) {
    clearAuth();
    return null;
  }

  try {
    const { data } = await client.post<RefreshTokenResponse>("/auth/refresh", {
      refreshToken,
    });

    setTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    return data.accessToken;
  } catch {
    clearAuth();
    return null;
  }
}

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: 30_000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  client.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryConfig | undefined;

      if (
        !originalRequest ||
        error.response?.status !== 401 ||
        originalRequest._retry ||
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/refresh")
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      refreshPromise ??= refreshAccessToken(client).finally(() => {
        refreshPromise = null;
      });

      const accessToken = await refreshPromise;

      if (!accessToken) {
        return Promise.reject(error);
      }

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return client(originalRequest);
    }
  );

  return client;
}

export const apiClient = createApiClient();
