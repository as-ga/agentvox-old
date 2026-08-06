"use client";

import {
  DEFAULT_REPORT_ID,
  DEFAULT_REPORT_INTERVIEW_ID,
  MOCK_GENERATE_REPORT_RESPONSE,
  MOCK_INTERVIEW_LOOKUP,
  MOCK_INTERVIEW_REPORT,
  simulateNetworkLatency,
} from "@/features/report/data/mock-report";
import type {
  GenerateReportRequest,
  GenerateReportResponse,
  InterviewLookup,
  InterviewReport,
} from "@/features/report/types/report.types";
import { apiClient } from "@/services/api/client";

const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

function isKnownReportId(id: string): boolean {
  return (
    id === DEFAULT_REPORT_ID ||
    id === DEFAULT_REPORT_INTERVIEW_ID ||
    id === "default"
  );
}

export const reportService = {
  async getReport(id: string): Promise<InterviewReport> {
    if (useMockApi) {
      await simulateNetworkLatency();

      if (!isKnownReportId(id)) {
        throw new Error(`Report ${id} was not found`);
      }

      return MOCK_INTERVIEW_REPORT;
    }

    const { data } = await apiClient.get<InterviewReport>(`/report/${id}`);
    return data;
  },

  async generateReport(
    payload: GenerateReportRequest
  ): Promise<GenerateReportResponse> {
    if (useMockApi) {
      await simulateNetworkLatency(520);

      if (
        payload.interviewId !== DEFAULT_REPORT_INTERVIEW_ID &&
        payload.interviewId !== "default"
      ) {
        throw new Error(
          `Interview ${payload.interviewId} is not available for report generation`
        );
      }

      return MOCK_GENERATE_REPORT_RESPONSE;
    }

    const { data } = await apiClient.post<GenerateReportResponse>(
      "/report/generate",
      payload
    );
    return data;
  },

  async getInterview(id: string): Promise<InterviewLookup> {
    if (useMockApi) {
      await simulateNetworkLatency(280);

      if (
        id !== DEFAULT_REPORT_INTERVIEW_ID &&
        id !== DEFAULT_REPORT_ID &&
        id !== "default"
      ) {
        throw new Error(`Interview ${id} was not found`);
      }

      return MOCK_INTERVIEW_LOOKUP;
    }

    const { data } = await apiClient.get<InterviewLookup>(`/interview/${id}`);
    return data;
  },
};
