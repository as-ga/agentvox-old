"use client";

import { useQuery } from "@tanstack/react-query";

import { DEFAULT_PRESENTATION_CANDIDATE_ID } from "@/features/presentation/data/mock-presentation";
import { presentationService } from "@/features/presentation/services/presentation.service";

export const presentationQueryKeys = {
  all: ["presentation"] as const,
  detail: (candidateId: string) =>
    [...presentationQueryKeys.all, "detail", candidateId] as const,
  report: (id: string) =>
    [...presentationQueryKeys.all, "report", id] as const,
  candidate: (id: string) =>
    [...presentationQueryKeys.all, "candidate", id] as const,
};

export function usePresentation(
  candidateId: string = DEFAULT_PRESENTATION_CANDIDATE_ID
) {
  return useQuery({
    queryKey: presentationQueryKeys.detail(candidateId),
    queryFn: () => presentationService.getPresentation(candidateId),
    enabled: candidateId.length > 0,
    retry: 1,
    staleTime: 30_000,
  });
}

export function usePresentationReport(reportId: string | undefined) {
  return useQuery({
    queryKey: presentationQueryKeys.report(reportId ?? "unknown"),
    queryFn: () => {
      if (!reportId) {
        throw new Error("Report id is required");
      }
      return presentationService.getReport(reportId);
    },
    enabled: Boolean(reportId),
    retry: 1,
    staleTime: 30_000,
  });
}

export function usePresentationCandidate(candidateId: string | undefined) {
  return useQuery({
    queryKey: presentationQueryKeys.candidate(candidateId ?? "unknown"),
    queryFn: () => {
      if (!candidateId) {
        throw new Error("Candidate id is required");
      }
      return presentationService.getCandidate(candidateId);
    },
    enabled: Boolean(candidateId),
    retry: 1,
    staleTime: 30_000,
  });
}
