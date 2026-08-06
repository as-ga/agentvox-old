"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type {
  PerformancePoint,
  SkillImprovementPoint,
  WeeklyProgressPoint,
} from "@/features/dashboard/types/dashboard.types";
import { cn } from "@/lib/utils";

type RangeKey = "1W" | "1M" | "ALL";

interface PerformanceChartProps {
  performanceTrend: ReadonlyArray<PerformancePoint>;
  weeklyProgress: ReadonlyArray<WeeklyProgressPoint>;
  skillImprovement: ReadonlyArray<SkillImprovementPoint>;
}

export function PerformanceChart({
  performanceTrend,
  weeklyProgress,
  skillImprovement,
}: PerformanceChartProps) {
  const [range, setRange] = useState<RangeKey>("ALL");

  const trendData =
    range === "1W"
      ? performanceTrend.slice(-2)
      : range === "1M"
        ? performanceTrend.slice(-4)
        : performanceTrend;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -2 }}
      >
        <Card className="rounded-2xl border border-white/10 bg-[#12121a]/80 py-0 ring-0 backdrop-blur-xl">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Interview Performance Trend
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Volume and average score over time
                </p>
              </div>
              <div
                className="flex items-center gap-1 rounded-xl border border-white/10 p-1"
                role="group"
                aria-label="Performance range"
              >
                {(["1W", "1M", "ALL"] as const).map((key) => (
                  <Button
                    key={key}
                    type="button"
                    size="sm"
                    variant={range === key ? "default" : "ghost"}
                    className={cn(
                      "h-8 px-3",
                      range === key ? "glow-purple" : "text-muted-foreground"
                    )}
                    aria-pressed={range === key}
                    onClick={() => setRange(key)}
                  >
                    {key}
                  </Button>
                ))}
              </div>
            </div>

            <div
              className="h-[280px] w-full"
              role="img"
              aria-label="Interview performance trend chart"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={[...trendData]}>
                  <CartesianGrid
                    stroke="rgba(148,163,184,0.12)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#12121a",
                      border: "1px solid rgba(30,41,59,0.9)",
                      borderRadius: 12,
                      color: "#fff",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
                  <Bar
                    yAxisId="left"
                    dataKey="interviews"
                    name="Interviews"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive
                    animationDuration={900}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="averageScore"
                    name="Avg Score"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#38bdf8" }}
                    isAnimationActive
                    animationDuration={1000}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06 }}
        whileHover={{ y: -2 }}
        className="space-y-4"
      >
        <Card className="rounded-2xl border border-white/10 bg-[#12121a]/80 py-0 ring-0 backdrop-blur-xl">
          <CardContent className="p-5">
            <h2 className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Weekly Progress
            </h2>
            <div
              className="mt-3 h-[140px]"
              role="img"
              aria-label="Weekly practice progress chart"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={[...weeklyProgress]}>
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: "#12121a",
                      border: "1px solid rgba(30,41,59,0.9)",
                      borderRadius: 12,
                      color: "#fff",
                    }}
                  />
                  <Bar
                    dataKey="minutes"
                    name="Minutes"
                    fill="#8b5cf6"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="Score"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-[#12121a]/80 py-0 ring-0 backdrop-blur-xl">
          <CardContent className="p-5">
            <h2 className="mb-4 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Skill Improvement
            </h2>
            <ul className="space-y-3" aria-label="Skill improvement">
              {skillImprovement.map((item) => (
                <li key={item.skill} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white">{item.skill}</span>
                    <span className="text-muted-foreground">
                      {item.previous}% → {item.current}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className="h-2 rounded-full bg-primary/25"
                      aria-hidden="true"
                    >
                      <div
                        className="h-2 rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${item.previous}%` }}
                      />
                    </div>
                    <div
                      className="h-2 rounded-full bg-sky-500/20"
                      aria-hidden="true"
                    >
                      <div
                        className="h-2 rounded-full bg-sky-400 transition-all duration-700"
                        style={{ width: `${item.current}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                    <span>Previous</span>
                    <span>Current</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
