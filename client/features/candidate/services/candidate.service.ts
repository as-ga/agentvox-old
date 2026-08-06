"use client";

import {
  DEFAULT_CANDIDATE_ID,
  MOCK_CANDIDATE_DOSSIER,
  MOCK_RESUME_DETAILS,
  simulateNetworkLatency,
} from "@/features/candidate/data/mock-candidate";
import type {
  AnalyzeResumeRequest,
  AnalyzeResumeResponse,
  CandidateDossier,
  ResumeDetails,
} from "@/features/candidate/types/candidate.types";
import { apiClient } from "@/services/api/client";

const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

export const candidateService = {
  async getCandidate(id: string): Promise<CandidateDossier> {
    if (useMockApi) {
      await simulateNetworkLatency();

      if (id !== DEFAULT_CANDIDATE_ID && id !== "default") {
        throw new Error(`Candidate ${id} was not found`);
      }

      return MOCK_CANDIDATE_DOSSIER;
    }

    const { data } = await apiClient.get<CandidateDossier>(`/candidate/${id}`);
    return data;
  },

  async getResume(id: string): Promise<ResumeDetails> {
    if (useMockApi) {
      await simulateNetworkLatency(300);

      if (id !== MOCK_RESUME_DETAILS.id) {
        throw new Error(`Resume ${id} was not found`);
      }

      return MOCK_RESUME_DETAILS;
    }

    const { data } = await apiClient.get<ResumeDetails>(`/resume/${id}`);
    return data;
  },

  async analyzeResume(
    payload: AnalyzeResumeRequest
  ): Promise<AnalyzeResumeResponse> {
    if (useMockApi) {
      await simulateNetworkLatency(500);

      return {
        analysisId: `ANL-${payload.resumeId}`,
        status: "complete",
        candidateId: DEFAULT_CANDIDATE_ID,
      };
    }

    const { data } = await apiClient.post<AnalyzeResumeResponse>(
      "/resume/analyze",
      payload
    );
    return data;
  },
};
