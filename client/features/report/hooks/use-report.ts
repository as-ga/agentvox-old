"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DEFAULT_REPORT_ID } from "@/features/report/data/mock-report";
import { reportService } from "@/features/report/services/report.service";
import type { GenerateReportRequest } from "@/features/report/types/report.types";

export const reportQueryKeys = {
  all: ["report"] as const,
  detail: (id: string) => [...reportQueryKeys.all, "detail", id] as const,
  interview: (id: string) =>
    [...reportQueryKeys.all, "interview", id] as const,
};

export function useReport(reportId: string = DEFAULT_REPORT_ID) {
  return useQuery({
    queryKey: reportQueryKeys.detail(reportId),
    queryFn: () => reportService.getReport(reportId),
    enabled: reportId.length > 0,
    retry: 1,
    staleTime: 30_000,
  });
}

export function useReportInterview(interviewId: string | undefined) {
  return useQuery({
    queryKey: reportQueryKeys.interview(interviewId ?? "unknown"),
    queryFn: () => {
      if (!interviewId) {
        throw new Error("Interview id is required");
      }
      return reportService.getInterview(interviewId);
    },
    enabled: Boolean(interviewId),
    retry: 1,
    staleTime: 30_000,
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["report", "generate"],
    retry: false,
    mutationFn: (payload: GenerateReportRequest) =>
      reportService.generateReport(payload),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: reportQueryKeys.detail(result.reportId),
      });
    },
  });
}
