"use client";

import { create } from "zustand";

import type {
  InterviewRoomPhase,
  InterviewRoomSession,
  LiveMetric,
  TranscriptEntry,
} from "@/features/interview/types/interview.types";

interface InterviewRoomState {
  session: InterviewRoomSession | null;
  phase: InterviewRoomPhase;
  isSocketConnected: boolean;
  hydrateSession: (session: InterviewRoomSession) => void;
  setPhase: (phase: InterviewRoomPhase) => void;
  setSocketConnected: (connected: boolean) => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  appendTranscript: (entry: TranscriptEntry) => void;
  setMetrics: (metrics: ReadonlyArray<LiveMetric>) => void;
  setAiThinking: (isThinking: boolean) => void;
  setCandidateSpeaking: (isSpeaking: boolean) => void;
  setLatency: (latencyMs: number) => void;
  endSession: () => void;
  reset: () => void;
}

const initialState = {
  session: null,
  phase: "loading" as InterviewRoomPhase,
  isSocketConnected: false,
};

export const useInterviewStore = create<InterviewRoomState>((set) => ({
  ...initialState,
  hydrateSession: (session) => {
    set({
      session,
      phase: session.phase,
    });
  },
  setPhase: (phase) => {
    set((state) => ({
      phase,
      session: state.session
        ? {
            ...state.session,
            phase,
            status: phase === "ended" ? "ended" : state.session.status,
          }
        : null,
    }));
  },
  setSocketConnected: (connected) => {
    set({ isSocketConnected: connected });
  },
  toggleMute: () => {
    set((state) => {
      if (!state.session) {
        return state;
      }

      return {
        session: {
          ...state.session,
          isMuted: !state.session.isMuted,
        },
      };
    });
  },
  toggleCamera: () => {
    set((state) => {
      if (!state.session) {
        return state;
      }

      return {
        session: {
          ...state.session,
          isCameraOn: !state.session.isCameraOn,
        },
      };
    });
  },
  appendTranscript: (entry) => {
    set((state) => {
      if (!state.session) {
        return state;
      }

      return {
        session: {
          ...state.session,
          transcript: [...state.session.transcript, entry],
        },
      };
    });
  },
  setMetrics: (metrics) => {
    set((state) => {
      if (!state.session) {
        return state;
      }

      return {
        session: {
          ...state.session,
          metrics,
        },
      };
    });
  },
  setAiThinking: (isThinking) => {
    set((state) => {
      if (!state.session) {
        return state;
      }

      return {
        session: {
          ...state.session,
          isAiThinking: isThinking,
        },
      };
    });
  },
  setCandidateSpeaking: (isSpeaking) => {
    set((state) => {
      if (!state.session) {
        return state;
      }

      return {
        session: {
          ...state.session,
          isCandidateSpeaking: isSpeaking,
        },
      };
    });
  },
  setLatency: (latencyMs) => {
    set((state) => {
      if (!state.session) {
        return state;
      }

      return {
        session: {
          ...state.session,
          latencyMs,
        },
      };
    });
  },
  endSession: () => {
    set((state) => ({
      phase: "ended",
      session: state.session
        ? {
            ...state.session,
            status: "ended",
            phase: "ended",
            isCandidateSpeaking: false,
            isAiThinking: false,
          }
        : null,
    }));
  },
  reset: () => {
    set(initialState);
  },
}));
