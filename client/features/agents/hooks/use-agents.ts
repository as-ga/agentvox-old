"use client";

import { useQuery } from "@tanstack/react-query";

import { agentsService } from "@/features/agents/services/agents.service";

export const agentsQueryKeys = {
  all: ["agents"] as const,
  overview: () => [...agentsQueryKeys.all, "overview"] as const,
  status: () => [...agentsQueryKeys.all, "status"] as const,
  logs: () => [...agentsQueryKeys.all, "logs"] as const,
  metrics: () => [...agentsQueryKeys.all, "metrics"] as const,
};

export function useAgents() {
  return useQuery({
    queryKey: agentsQueryKeys.overview(),
    queryFn: () => agentsService.getAgents(),
    retry: 1,
    staleTime: 15_000,
  });
}

export function useAgentsStatus() {
  return useQuery({
    queryKey: agentsQueryKeys.status(),
    queryFn: () => agentsService.getAgentsStatus(),
    retry: 1,
    staleTime: 10_000,
  });
}

export function useAgentsLogs() {
  return useQuery({
    queryKey: agentsQueryKeys.logs(),
    queryFn: () => agentsService.getAgentsLogs(),
    retry: 1,
    staleTime: 10_000,
  });
}

export function useAgentsMetrics() {
  return useQuery({
    queryKey: agentsQueryKeys.metrics(),
    queryFn: () => agentsService.getAgentsMetrics(),
    retry: 1,
    staleTime: 10_000,
  });
}
