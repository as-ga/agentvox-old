"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { DEFAULT_ROOM_INTERVIEW_ID } from "@/features/interview/data/mock-interview-room";
import { useInterviewSocket } from "@/features/interview/hooks/use-interview-socket";
import { interviewService } from "@/features/interview/services/interview.service";
import { useInterviewStore } from "@/features/interview/store/interview.store";

export const interviewRoomQueryKeys = {
  all: ["interview-room"] as const,
  detail: (id: string) => [...interviewRoomQueryKeys.all, "detail", id] as const,
};

export function useInterview(interviewId: string = DEFAULT_ROOM_INTERVIEW_ID) {
  const hydrateSession = useInterviewStore((state) => state.hydrateSession);
  const endSession = useInterviewStore((state) => state.endSession);
  const setPhase = useInterviewStore((state) => state.setPhase);
  const reset = useInterviewStore((state) => state.reset);
  const session = useInterviewStore((state) => state.session);
  const phase = useInterviewStore((state) => state.phase);
  const toggleMute = useInterviewStore((state) => state.toggleMute);
  const toggleCamera = useInterviewStore((state) => state.toggleCamera);

  const sessionQuery = useQuery({
    queryKey: interviewRoomQueryKeys.detail(interviewId),
    queryFn: () => interviewService.getInterview(interviewId),
    staleTime: 10_000,
    retry: 1,
  });

  useEffect(() => {
    if (sessionQuery.data) {
      hydrateSession(sessionQuery.data);
    }
  }, [hydrateSession, sessionQuery.data]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const socket = useInterviewSocket(
    sessionQuery.data || session ? interviewId : undefined
  );

  const startMutation = useMutation({
    mutationKey: ["interview", "start", interviewId],
    retry: false,
    mutationFn: () =>
      interviewService.startInterview({
        interviewId,
      }),
    onSuccess: (result) => {
      hydrateSession(result.session);
    },
  });

  const endMutation = useMutation({
    mutationKey: ["interview", "end", interviewId],
    retry: false,
    mutationFn: () =>
      interviewService.endInterview({
        interviewId,
        reason: "manual",
      }),
    onSuccess: () => {
      endSession();
    },
  });

  return {
    interviewId,
    session,
    phase,
    socket,
    sessionQuery,
    startMutation,
    endMutation,
    toggleMute,
    toggleCamera,
    setPhase,
    isLoading: sessionQuery.isLoading,
    isError: sessionQuery.isError,
    error: sessionQuery.error,
    refetch: sessionQuery.refetch,
  };
}
