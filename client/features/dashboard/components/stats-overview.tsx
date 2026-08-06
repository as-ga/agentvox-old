"use client";

import { MetricCard } from "@/features/dashboard/components/metric-card";
import type { DashboardMetric } from "@/features/dashboard/types/dashboard.types";

interface StatsOverviewProps {
  metrics: ReadonlyArray<DashboardMetric>;
}

export function StatsOverview({ metrics }: StatsOverviewProps) {
  return (
    <section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Dashboard statistics"
    >
      {metrics.map((metric, index) => (
        <MetricCard key={metric.id} metric={metric} index={index} />
      ))}
    </section>
  );
}
