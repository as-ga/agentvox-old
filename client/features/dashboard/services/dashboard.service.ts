"use client";

import {
  DEFAULT_DASHBOARD_CANDIDATE_ID,
  MOCK_CANDIDATE_DASHBOARD,
  MOCK_DASHBOARD_INTERVIEWS,
  MOCK_DASHBOARD_REPORTS,
  simulateNetworkLatency,
} from "@/features/dashboard/data/mock-dashboard";
import type {
  CandidateDashboard,
  DashboardCandidate,
  DashboardInterviewListItem,
  DashboardReportListItem,
} from "@/features/dashboard/types/dashboard.types";
import { apiClient } from "@/services/api/client";

const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

export const dashboardService = {
  async getDashboard(): Promise<CandidateDashboard> {
    if (useMockApi) {
      await simulateNetworkLatency();
      return MOCK_CANDIDATE_DASHBOARD;
    }

    const { data } = await apiClient.get<CandidateDashboard>("/dashboard");
    return data;
  },

  async getCandidate(id: string): Promise<DashboardCandidate> {
    if (useMockApi) {
      await simulateNetworkLatency(260);

      if (
        id !== DEFAULT_DASHBOARD_CANDIDATE_ID &&
        id !== "default"
      ) {
        throw new Error(`Candidate ${id} was not found`);
      }

      return MOCK_CANDIDATE_DASHBOARD.candidate;
    }

    const { data } = await apiClient.get<DashboardCandidate>(
      `/candidate/${id}`
    );
    return data;
  },

  async getInterviews(): Promise<ReadonlyArray<DashboardInterviewListItem>> {
    if (useMockApi) {
      await simulateNetworkLatency(300);
      return MOCK_DASHBOARD_INTERVIEWS;
    }

    const { data } =
      await apiClient.get<ReadonlyArray<DashboardInterviewListItem>>(
        "/interviews"
      );
    return data;
  },

  async getReports(): Promise<ReadonlyArray<DashboardReportListItem>> {
    if (useMockApi) {
      await simulateNetworkLatency(300);
      return MOCK_DASHBOARD_REPORTS;
    }

    const { data } =
      await apiClient.get<ReadonlyArray<DashboardReportListItem>>("/reports");
    return data;
  },
};
