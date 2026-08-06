"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DEFAULT_CANDIDATE_ID } from "@/features/candidate/data/mock-candidate";
import { candidateService } from "@/features/candidate/services/candidate.service";
import type { AnalyzeResumeRequest } from "@/features/candidate/types/candidate.types";

export const candidateQueryKeys = {
  all: ["candidate"] as const,
  detail: (id: string) => [...candidateQueryKeys.all, "detail", id] as const,
  resume: (id: string) => [...candidateQueryKeys.all, "resume", id] as const,
};

export function useCandidate(candidateId: string = DEFAULT_CANDIDATE_ID) {
  return useQuery({
    queryKey: candidateQueryKeys.detail(candidateId),
    queryFn: () => candidateService.getCandidate(candidateId),
    enabled: candidateId.length > 0,
    retry: 1,
    staleTime: 30_000,
  });
}

export function useResume(resumeId: string | undefined) {
  return useQuery({
    queryKey: candidateQueryKeys.resume(resumeId ?? "unknown"),
    queryFn: () => {
      if (!resumeId) {
        throw new Error("Resume id is required");
      }
      return candidateService.getResume(resumeId);
    },
    enabled: Boolean(resumeId),
    retry: 1,
    staleTime: 30_000,
  });
}

export function useAnalyzeResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["resume", "analyze"],
    retry: false,
    mutationFn: (payload: AnalyzeResumeRequest) =>
      candidateService.analyzeResume(payload),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: candidateQueryKeys.detail(result.candidateId),
      });
    },
  });
}
