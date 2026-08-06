"use client";

import { useQuery } from "@tanstack/react-query";

import { DEFAULT_DASHBOARD_CANDIDATE_ID } from "@/features/dashboard/data/mock-dashboard";
import { dashboardService } from "@/features/dashboard/services/dashboard.service";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  root: () => [...dashboardQueryKeys.all, "root"] as const,
  candidate: (id: string) =>
    [...dashboardQueryKeys.all, "candidate", id] as const,
  interviews: () => [...dashboardQueryKeys.all, "interviews"] as const,
  reports: () => [...dashboardQueryKeys.all, "reports"] as const,
};

export function useDashboard() {
  return useQuery({
    queryKey: dashboardQueryKeys.root(),
    queryFn: () => dashboardService.getDashboard(),
    retry: 1,
    staleTime: 30_000,
  });
}

export function useDashboardCandidate(
  candidateId: string = DEFAULT_DASHBOARD_CANDIDATE_ID
) {
  return useQuery({
    queryKey: dashboardQueryKeys.candidate(candidateId),
    queryFn: () => dashboardService.getCandidate(candidateId),
    enabled: candidateId.length > 0,
    retry: 1,
    staleTime: 30_000,
  });
}

export function useDashboardInterviews() {
  return useQuery({
    queryKey: dashboardQueryKeys.interviews(),
    queryFn: () => dashboardService.getInterviews(),
    retry: 1,
    staleTime: 30_000,
  });
}

export function useDashboardReports() {
  return useQuery({
    queryKey: dashboardQueryKeys.reports(),
    queryFn: () => dashboardService.getReports(),
    retry: 1,
    staleTime: 30_000,
  });
}
