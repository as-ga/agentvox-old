"use client";

import {
  MOCK_ADMIN_ANALYTICS,
  MOCK_ADMIN_DASHBOARD,
  MOCK_ADMIN_INTERVIEWS,
  MOCK_ADMIN_SYSTEM,
  MOCK_ADMIN_USERS,
  simulateNetworkLatency,
} from "@/features/admin/data/mock-admin";
import type {
  AdminAnalytics,
  AdminDashboard,
  AdminInterviewsResponse,
  AdminSystemResponse,
  AdminUsersResponse,
} from "@/features/admin/types/admin.types";
import { apiClient } from "@/services/api/client";

const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

export const adminService = {
  async getDashboard(): Promise<AdminDashboard> {
    if (useMockApi) {
      await simulateNetworkLatency();
      return MOCK_ADMIN_DASHBOARD;
    }

    const { data } = await apiClient.get<AdminDashboard>("/admin/dashboard");
    return data;
  },

  async getAnalytics(): Promise<AdminAnalytics> {
    if (useMockApi) {
      await simulateNetworkLatency(280);
      return MOCK_ADMIN_ANALYTICS;
    }

    const { data } = await apiClient.get<AdminAnalytics>("/admin/analytics");
    return data;
  },

  async getUsers(): Promise<AdminUsersResponse> {
    if (useMockApi) {
      await simulateNetworkLatency(260);
      return MOCK_ADMIN_USERS;
    }

    const { data } = await apiClient.get<AdminUsersResponse>("/admin/users");
    return data;
  },

  async getInterviews(): Promise<AdminInterviewsResponse> {
    if (useMockApi) {
      await simulateNetworkLatency(260);
      return MOCK_ADMIN_INTERVIEWS;
    }

    const { data } =
      await apiClient.get<AdminInterviewsResponse>("/admin/interviews");
    return data;
  },

  async getSystem(): Promise<AdminSystemResponse> {
    if (useMockApi) {
      await simulateNetworkLatency(240);
      return MOCK_ADMIN_SYSTEM;
    }

    const { data } = await apiClient.get<AdminSystemResponse>("/admin/system");
    return data;
  },
};
