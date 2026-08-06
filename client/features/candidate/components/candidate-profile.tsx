"use client";

import { motion } from "framer-motion";
import { MapPin, UserRound } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { CandidateProfile as CandidateProfileData } from "@/features/candidate/types/candidate.types";

interface CandidateProfileProps {
  profile: CandidateProfileData;
  competencies: ReadonlyArray<string>;
}

export function CandidateProfile({
  profile,
  competencies,
}: CandidateProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -2 }}
    >
      <Card className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121a]/80 py-0 ring-0 backdrop-blur-xl">
        <div
          aria-hidden="true"
          className="h-24 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.35),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.25),transparent_40%),linear-gradient(135deg,#1a1030,#0d0d14)]"
        />
        <CardContent className="relative px-5 pt-0 pb-5">
          <div className="-mt-10 mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-[#1a1030] text-xl font-bold text-primary shadow-lg shadow-primary/20">
            {profile.avatarInitials}
          </div>

          <h2 className="text-xl font-semibold text-white">{profile.fullName}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{profile.title}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {profile.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
              {profile.yearsOfExperience}+ yrs
            </span>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Core Competencies
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="Core competencies">
              {competencies.map((skill) => (
                <li
                  key={skill}
                  className="rounded-lg border border-border/80 bg-[#0f1018] px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-xl border border-border/60 bg-[#0f1018]/80 p-3">
            <p className="mb-1.5 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Resume Summary
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {profile.summary}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
