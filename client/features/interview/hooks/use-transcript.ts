"use client";

import { useMemo } from "react";

import { useInterviewStore } from "@/features/interview/store/interview.store";
import type { TranscriptEntry } from "@/features/interview/types/interview.types";

export function useTranscript() {
  const transcript = useInterviewStore(
    (state) => state.session?.transcript ?? []
  );
  const appendTranscript = useInterviewStore((state) => state.appendTranscript);

  const latestEntry = useMemo<TranscriptEntry | null>(() => {
    if (transcript.length === 0) {
      return null;
    }

    return transcript[transcript.length - 1] ?? null;
  }, [transcript]);

  return {
    transcript,
    latestEntry,
    appendTranscript,
  };
}
