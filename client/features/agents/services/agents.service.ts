"use client";

import {
  MOCK_AGENTS_LOGS_RESPONSE,
  MOCK_AGENTS_METRICS,
  MOCK_AGENTS_OVERVIEW,
  MOCK_AGENTS_STATUS,
  simulateNetworkLatency,
} from "@/features/agents/data/mock-agents";
import type {
  AgentsLogsResponse,
  AgentsMetricsResponse,
  AgentsOverview,
  AgentsStatusResponse,
} from "@/features/agents/types/agents.types";
import { apiClient } from "@/services/api/client";

const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

export const agentsService = {
  async getAgents(): Promise<AgentsOverview> {
    if (useMockApi) {
      await simulateNetworkLatency();
      return MOCK_AGENTS_OVERVIEW;
    }

    const { data } = await apiClient.get<AgentsOverview>("/agents");
    return data;
  },

  async getAgentsStatus(): Promise<AgentsStatusResponse> {
    if (useMockApi) {
      await simulateNetworkLatency(220);
      return MOCK_AGENTS_STATUS;
    }

    const { data } =
      await apiClient.get<AgentsStatusResponse>("/agents/status");
    return data;
  },

  async getAgentsLogs(): Promise<AgentsLogsResponse> {
    if (useMockApi) {
      await simulateNetworkLatency(280);
      return MOCK_AGENTS_LOGS_RESPONSE;
    }

    const { data } = await apiClient.get<AgentsLogsResponse>("/agents/logs");
    return data;
  },

  async getAgentsMetrics(): Promise<AgentsMetricsResponse> {
    if (useMockApi) {
      await simulateNetworkLatency(260);
      return MOCK_AGENTS_METRICS;
    }

    const { data } =
      await apiClient.get<AgentsMetricsResponse>("/agents/metrics");
    return data;
  },
};
