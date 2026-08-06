import type {
  LiveMetric,
  TranscriptEntry,
} from "@/features/interview/types/interview.types";

export const INTERVIEW_SOCKET_EVENTS = {
  connect: "interview:connect",
  disconnect: "interview:disconnect",
  join: "interview:join",
  leave: "interview:leave",
  transcript: "interview:transcript",
  metrics: "interview:metrics",
  thinking: "interview:thinking",
  speaking: "interview:speaking",
  question: "interview:question",
  heartbeat: "interview:heartbeat",
  error: "interview:error",
} as const;

export type InterviewSocketEvent =
  (typeof INTERVIEW_SOCKET_EVENTS)[keyof typeof INTERVIEW_SOCKET_EVENTS];

export interface InterviewJoinPayload {
  interviewId: string;
}

export interface InterviewTranscriptPayload {
  entry: TranscriptEntry;
}

export interface InterviewMetricsPayload {
  metrics: ReadonlyArray<LiveMetric>;
  latencyMs: number;
}

export interface InterviewThinkingPayload {
  isThinking: boolean;
}

export interface InterviewSpeakingPayload {
  isSpeaking: boolean;
}

export type InterviewSocketPayloadMap = {
  [INTERVIEW_SOCKET_EVENTS.connect]: { at: string };
  [INTERVIEW_SOCKET_EVENTS.disconnect]: { at: string };
  [INTERVIEW_SOCKET_EVENTS.join]: InterviewJoinPayload;
  [INTERVIEW_SOCKET_EVENTS.leave]: InterviewJoinPayload;
  [INTERVIEW_SOCKET_EVENTS.transcript]: InterviewTranscriptPayload;
  [INTERVIEW_SOCKET_EVENTS.metrics]: InterviewMetricsPayload;
  [INTERVIEW_SOCKET_EVENTS.thinking]: InterviewThinkingPayload;
  [INTERVIEW_SOCKET_EVENTS.speaking]: InterviewSpeakingPayload;
  [INTERVIEW_SOCKET_EVENTS.heartbeat]: { at: string };
  [INTERVIEW_SOCKET_EVENTS.error]: { message: string };
};
