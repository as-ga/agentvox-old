"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import {
  DEFAULT_INTERVIEW_CONFIGURATION,
  DEFAULT_INTERVIEW_ID,
  DEFAULT_PLANNING_CANDIDATE_ID,
} from "@/features/interview/data/mock-planning";
import { interviewService } from "@/features/interview/services/interview.service";
import type {
  InterviewConfiguration,
  InterviewPlan,
} from "@/features/interview/types/interview.types";

export const interviewQueryKeys = {
  all: ["interview"] as const,
  plan: (interviewId: string, candidateId: string) =>
    [...interviewQueryKeys.all, "plan", interviewId, candidateId] as const,
  candidate: (candidateId: string) =>
    [...interviewQueryKeys.all, "candidate", candidateId] as const,
};

export function useInterviewPlanning(options?: {
  interviewId?: string;
  candidateId?: string;
}) {
  const queryClient = useQueryClient();
  const interviewId = options?.interviewId ?? DEFAULT_INTERVIEW_ID;
  const candidateId = options?.candidateId ?? DEFAULT_PLANNING_CANDIDATE_ID;

  const [configuration, setConfiguration] = useState<InterviewConfiguration>(
    DEFAULT_INTERVIEW_CONFIGURATION
  );

  const planQuery = useQuery({
    queryKey: interviewQueryKeys.plan(interviewId, candidateId),
    queryFn: () => interviewService.getInterviewPlan(interviewId, candidateId),
    staleTime: 20_000,
    retry: 1,
  });

  const candidateQuery = useQuery({
    queryKey: interviewQueryKeys.candidate(candidateId),
    queryFn: () => interviewService.getCandidate(candidateId),
    staleTime: 30_000,
    retry: 1,
  });

  const createMutation = useMutation({
    mutationKey: ["interview", "create"],
    retry: false,
    mutationFn: () =>
      interviewService.createInterview({
        candidateId,
        configuration,
      }),
  });

  const planMutation = useMutation({
    mutationKey: ["interview", "plan"],
    retry: false,
    mutationFn: async () => {
      const created =
        createMutation.data ??
        (await interviewService.createInterview({
          candidateId,
          configuration,
        }));

      return interviewService.planInterview({
        interviewId: created.interviewId,
        configuration,
      });
    },
    onSuccess: (result) => {
      queryClient.setQueryData(
        interviewQueryKeys.plan(result.plan.id, candidateId),
        result.plan
      );
    },
  });

  const plan: InterviewPlan | undefined = useMemo(() => {
    if (!planQuery.data) {
      return undefined;
    }

    return {
      ...planQuery.data,
      configuration,
      summary: {
        ...planQuery.data.summary,
        estimatedDurationMinutes: configuration.durationMinutes,
        expectedQuestionCount: configuration.questionCount,
      },
      candidate: {
        ...planQuery.data.candidate,
        selectedRole: configuration.role,
      },
    };
  }, [configuration, planQuery.data]);

  return {
    interviewId,
    candidateId,
    configuration,
    setConfiguration,
    plan,
    planQuery,
    candidateQuery,
    createMutation,
    planMutation,
    isLoading: planQuery.isLoading,
    isError: planQuery.isError,
    error: planQuery.error,
    refetch: planQuery.refetch,
  };
}
