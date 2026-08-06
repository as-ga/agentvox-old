"use client";

import {
  DEFAULT_PRESENTATION_CANDIDATE_ID,
  DEFAULT_PRESENTATION_ID,
  DEFAULT_PRESENTATION_REPORT_ID,
  MOCK_PRESENTATION,
  MOCK_PRESENTATION_CANDIDATE,
  MOCK_PRESENTATION_REPORT,
  simulateNetworkLatency,
} from "@/features/presentation/data/mock-presentation";
import type {
  PresentationCandidateLookup,
  PresentationDashboard,
  PresentationReportLookup,
} from "@/features/presentation/types/presentation.types";
import { apiClient } from "@/services/api/client";

const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

function isKnownCandidateId(id: string): boolean {
  return (
    id === DEFAULT_PRESENTATION_CANDIDATE_ID ||
    id === DEFAULT_PRESENTATION_ID ||
    id === "default"
  );
}

export const presentationService = {
  async getPresentation(candidateId: string): Promise<PresentationDashboard> {
    if (useMockApi) {
      await simulateNetworkLatency();

      if (!isKnownCandidateId(candidateId)) {
        throw new Error(`Presentation for candidate ${candidateId} was not found`);
      }

      return MOCK_PRESENTATION;
    }

    const { data } = await apiClient.get<PresentationDashboard>(
      `/presentation/${candidateId}`
    );
    return data;
  },

  async getReport(id: string): Promise<PresentationReportLookup> {
    if (useMockApi) {
      await simulateNetworkLatency(260);

      if (
        id !== DEFAULT_PRESENTATION_REPORT_ID &&
        id !== DEFAULT_PRESENTATION_ID &&
        id !== "default"
      ) {
        throw new Error(`Report ${id} was not found`);
      }

      return MOCK_PRESENTATION_REPORT;
    }

    const { data } = await apiClient.get<PresentationReportLookup>(
      `/report/${id}`
    );
    return data;
  },

  async getCandidate(id: string): Promise<PresentationCandidateLookup> {
    if (useMockApi) {
      await simulateNetworkLatency(240);

      if (
        id !== DEFAULT_PRESENTATION_CANDIDATE_ID &&
        id !== "default"
      ) {
        throw new Error(`Candidate ${id} was not found`);
      }

      return MOCK_PRESENTATION_CANDIDATE;
    }

    const { data } = await apiClient.get<PresentationCandidateLookup>(
      `/candidate/${id}`
    );
    return data;
  },
};
