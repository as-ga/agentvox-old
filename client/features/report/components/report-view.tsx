"use client";

import { useSearchParams } from "next/navigation";
import { useRef } from "react";

import { EmptyState } from "@/components/feedback/empty-state";
import { QueryErrorState } from "@/components/feedback/query-error-state";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ImprovementCard } from "@/features/report/components/improvement-card";
import { InterviewSummary } from "@/features/report/components/interview-summary";
import { OverallScoreCard } from "@/features/report/components/overall-score-card";
import { ReportActions } from "@/features/report/components/report-actions";
import { ReportHeader } from "@/features/report/components/report-header";
import { ReportRadarChart } from "@/features/report/components/radar-chart";
import { ReportSkeleton } from "@/features/report/components/report-skeleton";
import { ScoreBreakdownCard } from "@/features/report/components/score-breakdown-card";
import { StrengthsCard } from "@/features/report/components/strengths-card";
import { TimelineCard } from "@/features/report/components/timeline-card";
import { TranscriptSummary } from "@/features/report/components/transcript-summary";
import { DEFAULT_REPORT_ID } from "@/features/report/data/mock-report";
import { useReport } from "@/features/report/hooks/use-report";
import { normalizeApiError } from "@/services/api/errors";

export function ReportView() {
  const searchParams = useSearchParams();
  const reportId =
    searchParams.get("id")?.trim() ||
    searchParams.get("interviewId")?.trim() ||
    DEFAULT_REPORT_ID;

  const transcriptRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useReport(reportId);

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Interview Management" },
        { label: "Active Sessions", current: true },
      ]}
    >
      {isLoading ? <ReportSkeleton /> : null}

      {!isLoading && isError ? (
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <QueryErrorState
            title="Unable to load interview report"
            message={normalizeApiError(error).message}
            onRetry={() => {
              void refetch();
            }}
          />
        </div>
      ) : null}

      {!isLoading && !isError && !data ? (
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <EmptyState
            title="No interview report found"
            description="Complete an interview session to generate an AI evaluation report."
          />
        </div>
      ) : null}

      {!isLoading && !isError && data ? (
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
          <ReportHeader report={data} />

          {isFetching ? (
            <p className="text-xs text-muted-foreground">Refreshing report...</p>
          ) : null}

          <section
            className="grid gap-4 xl:grid-cols-3"
            aria-label="Candidate overview and core metrics"
          >
            <OverallScoreCard report={data} />
            <ReportRadarChart data={data.competencyMatrix} />
            <ScoreBreakdownCard scores={data.scores} />
          </section>

          <section
            className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]"
            aria-label="Performance timeline and AI summary"
          >
            <TimelineCard
              pulse={data.interviewPulse}
              events={data.timeline}
              durationMinutes={data.durationMinutes}
            />
            <InterviewSummary summary={data.summary} />
          </section>

          <section
            className="grid gap-4 lg:grid-cols-2"
            aria-label="Strengths and improvement areas"
          >
            <StrengthsCard strengths={data.strengths} />
            <ImprovementCard improvements={data.improvements} />
          </section>

          <div
            ref={transcriptRef}
            tabIndex={-1}
            className="outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
          >
            <TranscriptSummary highlights={data.transcriptHighlights} />
          </div>

          <ReportActions
            reportId={data.id}
            interviewId={data.interviewId}
            onViewTranscript={() => {
              transcriptRef.current?.focus();
              transcriptRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          />
        </div>
      ) : null}
    </DashboardLayout>
  );
}
