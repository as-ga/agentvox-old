"use client";

import { motion } from "framer-motion";
import { Brain, Target } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AiSummaryCardProps {
  summary: string;
  readinessScore: number;
  recommendedFocus: ReadonlyArray<string>;
}

export function AiSummaryCard({
  summary,
  readinessScore,
  recommendedFocus,
}: AiSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -2 }}
    >
      <Card className="rounded-2xl border border-white/10 bg-[#12121a]/80 py-0 ring-0 backdrop-blur-xl">
        <CardContent className="space-y-5 p-5">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" aria-hidden="true" />
            <h3 className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              AI Summary
            </h3>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {summary}
          </p>

          <div className="rounded-xl border border-primary/25 bg-primary/5 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                Interview Readiness Score
              </p>
              <span className="text-sm font-bold text-white">
                {readinessScore}%
              </span>
            </div>
            <Progress value={readinessScore} className="h-2" />
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" aria-hidden="true" />
              <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Recommended Focus Areas
              </p>
            </div>
            <ul className="space-y-2">
              {recommendedFocus.map((focus) => (
                <li
                  key={focus}
                  className="rounded-lg border border-border/70 bg-[#0f1018] px-3 py-2 text-sm text-muted-foreground"
                >
                  {focus}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
