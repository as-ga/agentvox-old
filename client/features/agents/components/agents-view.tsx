"use client";

import { useQueryClient } from "@tanstack/react-query";

import { EmptyState } from "@/components/feedback/empty-state";
import { QueryErrorState } from "@/components/feedback/query-error-state";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AgentMetrics } from "@/features/agents/components/agent-metrics";
import { AgentStatusList } from "@/features/agents/components/agent-status-list";
import { AgentsOverview } from "@/features/agents/components/agents-overview";
import { AgentsSkeleton } from "@/features/agents/components/agents-skeleton";
import { CpuUsageCard } from "@/features/agents/components/cpu-usage-card";
import { ExecutionTimeline } from "@/features/agents/components/execution-timeline";
import { LatencyCard } from "@/features/agents/components/latency-card";
import { LogsPanel } from "@/features/agents/components/logs-panel";
import { MemoryUsageCard } from "@/features/agents/components/memory-usage-card";
import { NetworkCard } from "@/features/agents/components/network-card";
import { ResourceSaturation } from "@/features/agents/components/resource-saturation";
import { SystemHealth } from "@/features/agents/components/system-health";
import { WorkflowGraph } from "@/features/agents/components/workflow-graph";
import {
  agentsQueryKeys,
  useAgents,
  useAgentsLogs,
} from "@/features/agents/hooks/use-agents";
import { normalizeApiError } from "@/services/api/errors";

export function AgentsView() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch, isFetching } = useAgents();
  const logsQuery = useAgentsLogs();

  const logs = logsQuery.data?.logs ?? [];

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Interview Management" },
        { label: "Active Sessions", current: true },
      ]}
    >
      {isLoading ? <AgentsSkeleton /> : null}

      {!isLoading && isError ? (
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <QueryErrorState
            title="Unable to load agent monitoring"
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
            title="No agent telemetry available"
            description="Start an interview orchestration session to begin multi-agent monitoring."
          />
        </div>
      ) : null}

      {!isLoading && !isError && data ? (
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
          <AgentsOverview
            data={data}
            onResetMetrics={() => {
              void queryClient.invalidateQueries({
                queryKey: agentsQueryKeys.all,
              });
            }}
          />

          {isFetching ? (
            <p className="text-xs text-muted-foreground">
              Syncing agent telemetry...
            </p>
          ) : null}

          <section
            className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]"
            aria-label="Workflow and side metrics"
          >
            <div className="space-y-4">
              <WorkflowGraph
                nodes={data.workflow}
                activeNodeId={data.activeNodeId}
                logsPreview={[
                  "[SYSTEM] Node: Resume Completed",
                  "[SYSTEM] Node: Planner Started",
                  "[SYSTEM] Edge: Planner -> Technical",
                  "[SYSTEM] Waiting: Behavior / Fact Checker",
                ]}
              />
              <ExecutionTimeline lanes={data.timeline} />
            </div>

            <div className="space-y-4">
              <LatencyCard
                series={data.latencySeries}
                avgLatencyMs={data.avgLatencyMs}
                p99LatencyMs={data.p99LatencyMs}
              />
              <NetworkCard
                series={data.resourceSeries}
                networkGbps={data.resources.networkGbps}
                communication={data.communication}
                clusterNodes={data.clusterNodes}
                shard={data.shard}
                optimizationHint={data.optimizationHint}
              />
            </div>
          </section>

          <section
            className="grid gap-4 lg:grid-cols-3"
            aria-label="Resource charts and agent status"
          >
            <CpuUsageCard
              series={data.resourceSeries}
              cpuPercent={data.resources.cpuPercent}
            />
            <MemoryUsageCard
              series={data.resourceSeries}
              memoryPercent={data.resources.memoryPercent}
            />
            <AgentStatusList
              agents={data.agents}
              activeNodeId={data.activeNodeId}
            />
          </section>

          <AgentMetrics
            agents={data.agents}
            resourceSeries={data.resourceSeries}
          />

          <section
            className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]"
            aria-label="Logs, resources, and system health"
          >
            <LogsPanel logs={logs} />
            <div className="space-y-4">
              <ResourceSaturation
                resources={data.resources}
                session={data.session}
              />
              <SystemHealth services={data.systemHealth} />
            </div>
          </section>

          <footer className="flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p>{data.engineVersion}</p>
            <p>{data.infrastructure}</p>
            <p>{data.region}</p>
            <p>
              Last sync:{" "}
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
