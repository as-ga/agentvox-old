"use client";

import { candidateService } from "@/features/candidate/services/candidate.service";
import type { CandidateDossier } from "@/features/candidate/types/candidate.types";
import {
  DEFAULT_ROOM_INTERVIEW_ID,
  MOCK_INTERVIEW_ROOM_SESSION,
  simulateRoomLatency,
} from "@/features/interview/data/mock-interview-room";
import {
  DEFAULT_INTERVIEW_ID,
  DEFAULT_PLANNING_CANDIDATE_ID,
  MOCK_INTERVIEW_PLAN,
  simulatePlanningLatency,
} from "@/features/interview/data/mock-planning";
import type {
  CreateInterviewRequest,
  CreateInterviewResponse,
  EndInterviewRequest,
  EndInterviewResponse,
  InterviewConfiguration,
  InterviewPlan,
  InterviewRoomSession,
  PlanInterviewRequest,
  PlanInterviewResponse,
  StartInterviewRequest,
  StartInterviewResponse,
} from "@/features/interview/types/interview.types";
import { apiClient } from "@/services/api/client";

const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

function applyConfiguration(
  plan: InterviewPlan,
  configuration: InterviewConfiguration
): InterviewPlan {
  return {
    ...plan,
    configuration,
    summary: {
      ...plan.summary,
      estimatedDurationMinutes: configuration.durationMinutes,
      expectedQuestionCount: configuration.questionCount,
    },
    candidate: {
      ...plan.candidate,
      selectedRole: configuration.role,
    },
  };
}

export const interviewService = {
  async getCandidate(id: string): Promise<CandidateDossier> {
    return candidateService.getCandidate(id);
  },

  async getInterviewPlan(
    interviewId: string,
    candidateId: string = DEFAULT_PLANNING_CANDIDATE_ID
  ): Promise<InterviewPlan> {
    if (useMockApi) {
      await simulatePlanningLatency();

      if (
        interviewId !== DEFAULT_INTERVIEW_ID &&
        interviewId !== "default"
      ) {
        throw new Error(`Interview plan ${interviewId} was not found`);
      }

      return {
        ...MOCK_INTERVIEW_PLAN,
        candidate: {
          ...MOCK_INTERVIEW_PLAN.candidate,
          id: candidateId,
        },
      };
    }

    const { data } = await apiClient.get<InterviewPlan>(
      `/interview/${interviewId}/plan`
    );
    return data;
  },

  async createInterview(
    payload: CreateInterviewRequest
  ): Promise<CreateInterviewResponse> {
    if (useMockApi) {
      await simulatePlanningLatency(350);

      return {
        interviewId: DEFAULT_INTERVIEW_ID,
        status: "created",
      };
    }

    const { data } = await apiClient.post<CreateInterviewResponse>(
      "/interview/create",
      payload
    );
    return data;
  },

  async planInterview(
    payload: PlanInterviewRequest
  ): Promise<PlanInterviewResponse> {
    if (useMockApi) {
      await simulatePlanningLatency(500);

      return {
        plan: applyConfiguration(MOCK_INTERVIEW_PLAN, payload.configuration),
      };
    }

    const { data } = await apiClient.post<PlanInterviewResponse>(
      "/interview/plan",
      payload
    );
    return data;
  },

  async getInterview(id: string): Promise<InterviewRoomSession> {
    if (useMockApi) {
      await simulateRoomLatency();

      if (id !== DEFAULT_ROOM_INTERVIEW_ID && id !== DEFAULT_INTERVIEW_ID) {
        throw new Error(`Interview ${id} was not found`);
      }

      return {
        ...MOCK_INTERVIEW_ROOM_SESSION,
        id,
      };
    }

    const { data } = await apiClient.get<InterviewRoomSession>(
      `/interview/${id}`
    );
    return data;
  },

  async startInterview(
    payload: StartInterviewRequest
  ): Promise<StartInterviewResponse> {
    if (useMockApi) {
      await simulateRoomLatency(300);

      return {
        session: {
          ...MOCK_INTERVIEW_ROOM_SESSION,
          id: payload.interviewId,
          status: "live",
          phase: "live",
        },
      };
    }

    const { data } = await apiClient.post<StartInterviewResponse>(
      "/interview/start",
      payload
    );
    return data;
  },

  async endInterview(
    payload: EndInterviewRequest
  ): Promise<EndInterviewResponse> {
    if (useMockApi) {
      await simulateRoomLatency(250);

      return {
        interviewId: payload.interviewId,
        status: "ended",
        endedAt: new Date().toISOString(),
      };
    }

    const { data } = await apiClient.post<EndInterviewResponse>(
      "/interview/end",
      payload
    );
    return data;
  },
};
