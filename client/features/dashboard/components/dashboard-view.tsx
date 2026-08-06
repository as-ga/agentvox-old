"use client";

import { AchievementsCard } from "@/features/dashboard/components/achievements-card";
import { ActivityTimeline } from "@/features/dashboard/components/activity-timeline";
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";
import { InterviewHistory } from "@/features/dashboard/components/interview-history";
import { NotificationsPanel } from "@/features/dashboard/components/notifications-panel";
import { PerformanceChart } from "@/features/dashboard/components/performance-chart";
import { ProfileSummary } from "@/features/dashboard/components/profile-summary";
import { ProgressCard } from "@/features/dashboard/components/progress-card";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { RecentInterviews } from "@/features/dashboard/components/recent-interviews";
import { StatsOverview } from "@/features/dashboard/components/stats-overview";
import { UpcomingInterviews } from "@/features/dashboard/components/upcoming-interviews";
import { WelcomeBanner } from "@/features/dashboard/components/welcome-banner";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import { EmptyState } from "@/components/feedback/empty-state";
import { QueryErrorState } from "@/components/feedback/query-error-state";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { normalizeApiError } from "@/services/api/errors";

export function DashboardView() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useDashboard();

  const successRate =
    data?.metrics.find((metric) => metric.id === "success")?.value ?? 0;

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Interview Management" },
        { label: "Active Sessions", current: true },
      ]}
    >
      {isLoading ? <DashboardSkeleton /> : null}

      {!isLoading && isError ? (
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <QueryErrorState
            title="Unable to load candidate dashboard"
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
            title="Dashboard unavailable"
            description="Upload a resume and complete a practice interview to populate your workspace."
          />
        </div>
      ) : null}

      {!isLoading && !isError && data ? (
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
          <WelcomeBanner candidate={data.candidate} />

          {isFetching ? (
            <p className="text-xs text-muted-foreground">
              Syncing dashboard data...
            </p>
          ) : null}

          <StatsOverview metrics={data.metrics} />

          <PerformanceChart
            performanceTrend={data.performanceTrend}
            weeklyProgress={data.weeklyProgress}
            skillImprovement={data.skillImprovement}
          />

          <section
            className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
            aria-label="Interviews and profile"
          >
            <RecentInterviews interviews={data.recentInterviews} />
            <div className="grid gap-4">
              <ProfileSummary candidate={data.candidate} />
              <ProgressCard
                readinessScore={data.candidate.readinessScore}
                resumeScore={data.candidate.resumeScore}
                successRate={successRate}
              />
            </div>
          </section>

          <section
            className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3"
            aria-label="Schedule, actions, and achievements"
          >
            <UpcomingInterviews interviews={data.upcomingInterviews} />
            <QuickActions actions={data.quickActions} />
            <AchievementsCard achievements={data.achievements} />
          </section>

          <section
            className="grid gap-4 lg:grid-cols-3"
            aria-label="History, activity, and notifications"
          >
            <InterviewHistory history={data.interviewHistory} />
            <ActivityTimeline activities={data.activityTimeline} />
            <NotificationsPanel notifications={data.notifications} />
          </section>

          <footer className="flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>AgentVox Candidate Workspace · Mock data mode</p>
            <p>
              Last data sync:{" "}
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(data.lastSyncedAt))}
            </p>
          </footer>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
