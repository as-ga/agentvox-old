"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Play } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { EmptyState } from "@/components/feedback/empty-state";
import { QueryErrorState } from "@/components/feedback/query-error-state";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { AiAgentsPanel } from "@/features/interview/components/ai-agents-panel";
import { EstimatedDuration } from "@/features/interview/components/estimated-duration";
import { InterviewChecklist } from "@/features/interview/components/interview-checklist";
import { InterviewConfiguration } from "@/features/interview/components/interview-configuration";
import { InterviewOverview } from "@/features/interview/components/interview-overview";
import { InterviewSummary } from "@/features/interview/components/interview-summary";
import { PlanningCharts } from "@/features/interview/components/planning-charts";
import { PlanningHeader } from "@/features/interview/components/planning-header";
import { PlanningInsights } from "@/features/interview/components/planning-insights";
import { PlanningSkeleton } from "@/features/interview/components/planning-skeleton";
import { ReadinessCard } from "@/features/interview/components/readiness-card";
import { WorkflowTimeline } from "@/features/interview/components/workflow-timeline";
import {
  DEFAULT_INTERVIEW_ID,
  DEFAULT_PLANNING_CANDIDATE_ID,
} from "@/features/interview/data/mock-planning";
import { useInterviewPlanning } from "@/features/interview/hooks/use-interview-planning";
import { normalizeApiError } from "@/services/api/errors";
import { cn } from "@/lib/utils";

export function PlanningView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId =
    searchParams.get("candidateId")?.trim() || DEFAULT_PLANNING_CANDIDATE_ID;
  const interviewId =
    searchParams.get("interviewId")?.trim() || DEFAULT_INTERVIEW_ID;

  const {
    plan,
    configuration,
    setConfiguration,
    isLoading,
    isError,
    error,
    refetch,
    planMutation,
  } = useInterviewPlanning({ candidateId, interviewId });

  const checklistReady =
    plan?.checklist.every((item) => item.completed) ?? false;
  const isStarting = planMutation.isPending;

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Interview Management" },
        { label: "Active Sessions", current: true },
      ]}
    >
      {isLoading ? <PlanningSkeleton /> : null}

      {!isLoading && isError ? (
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <QueryErrorState
            title="Unable to load interview planning"
            message={normalizeApiError(error).message}
            onRetry={() => {
              void refetch();
            }}
          />
        </div>
      ) : null}

      {!isLoading && !isError && !plan ? (
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <EmptyState
            title="No interview plan available"
            description="Create an interview plan for this candidate to begin orchestration."
          />
        </div>
      ) : null}

      {!isLoading && !isError && plan ? (
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
          <PlanningHeader
            candidateName={plan.candidate.fullName}
            engineStatus={plan.summary.engineStatus}
            planningProgress={plan.summary.planningProgress}
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-4">
              <InterviewOverview candidate={plan.candidate} />
              <WorkflowTimeline steps={plan.workflow} />
              <InterviewConfiguration
                value={configuration}
                disabled={isStarting}
                onChange={setConfiguration}
              />
              <AiAgentsPanel agents={plan.agents} />
              <PlanningCharts
                skillDistribution={plan.skillDistribution}
                interviewCoverage={plan.interviewCoverage}
                readinessScore={plan.candidate.readinessScore}
              />
            </div>

            <div className="space-y-4">
              <ReadinessCard
                score={plan.candidate.readinessScore}
                candidateName={plan.candidate.fullName}
              />
              <EstimatedDuration
                minutes={plan.summary.estimatedDurationMinutes}
                questionCount={plan.summary.expectedQuestionCount}
              />
              <InterviewSummary summary={plan.summary} />
              <InterviewChecklist items={plan.checklist} />
              <PlanningInsights
                candidate={plan.candidate}
                insights={plan.insights}
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-border/70 bg-[#0f1018]/95 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm text-muted-foreground">
              {checklistReady
                ? "All pre-flight checks passed. You can start the interview."
                : "Complete remaining checklist items before starting the interview."}
            </p>

            <div className="flex items-center gap-2">
              <Link
                href="/candidates/dossier"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11"
                )}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </Link>

              <motion.div
                whileHover={{ scale: isStarting ? 1 : 1.01 }}
                whileTap={{ scale: isStarting ? 1 : 0.99 }}
              >
                <Button
                  type="button"
                  className="h-11 glow-purple"
                  disabled={isStarting}
                  aria-busy={isStarting}
                  onClick={async () => {
                    try {
                      const result = await planMutation.mutateAsync();
                      router.push(
                        `/interviews/room?interviewId=${result.plan.id}&candidateId=${candidateId}`
                      );
                    } catch {
                      // Error surface can be extended with toast infrastructure.
                    }
                  }}
                >
                  {isStarting ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" aria-hidden="true" />
                      Start Interview
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
