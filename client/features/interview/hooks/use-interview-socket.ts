"use client";

import { useEffect, useRef } from "react";

import { INTERVIEW_SOCKET_EVENTS } from "@/features/interview/services/websocket/events";
import { interviewSocket } from "@/features/interview/services/websocket/interview.socket";
import { useInterviewStore } from "@/features/interview/store/interview.store";

export function useInterviewSocket(interviewId: string | undefined) {
  const intentionalDisconnectRef = useRef(false);
  const setSocketConnected = useInterviewStore(
    (state) => state.setSocketConnected
  );
  const appendTranscript = useInterviewStore((state) => state.appendTranscript);
  const setMetrics = useInterviewStore((state) => state.setMetrics);
  const setAiThinking = useInterviewStore((state) => state.setAiThinking);
  const setCandidateSpeaking = useInterviewStore(
    (state) => state.setCandidateSpeaking
  );
  const setLatency = useInterviewStore((state) => state.setLatency);
  const setPhase = useInterviewStore((state) => state.setPhase);
  const isConnected = useInterviewStore((state) => state.isSocketConnected);

  useEffect(() => {
    if (!interviewId) {
      return;
    }

    intentionalDisconnectRef.current = false;
    interviewSocket.connect(interviewId);
    setSocketConnected(true);

    const unsubscribeConnect = interviewSocket.on(
      INTERVIEW_SOCKET_EVENTS.connect,
      () => {
        setSocketConnected(true);
      }
    );

    const unsubscribeDisconnect = interviewSocket.on(
      INTERVIEW_SOCKET_EVENTS.disconnect,
      () => {
        setSocketConnected(false);
        if (!intentionalDisconnectRef.current) {
          setPhase("connection_lost");
        }
      }
    );

    const unsubscribeTranscript = interviewSocket.on(
      INTERVIEW_SOCKET_EVENTS.transcript,
      (payload) => {
        appendTranscript(payload.entry);
      }
    );

    const unsubscribeMetrics = interviewSocket.on(
      INTERVIEW_SOCKET_EVENTS.metrics,
      (payload) => {
        setMetrics(payload.metrics);
        setLatency(payload.latencyMs);
      }
    );

    const unsubscribeThinking = interviewSocket.on(
      INTERVIEW_SOCKET_EVENTS.thinking,
      (payload) => {
        setAiThinking(payload.isThinking);
      }
    );

    const unsubscribeSpeaking = interviewSocket.on(
      INTERVIEW_SOCKET_EVENTS.speaking,
      (payload) => {
        setCandidateSpeaking(payload.isSpeaking);
      }
    );

    return () => {
      intentionalDisconnectRef.current = true;
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeTranscript();
      unsubscribeMetrics();
      unsubscribeThinking();
      unsubscribeSpeaking();
      interviewSocket.disconnect();
      setSocketConnected(false);
    };
  }, [
    appendTranscript,
    interviewId,
    setAiThinking,
    setCandidateSpeaking,
    setLatency,
    setMetrics,
    setPhase,
    setSocketConnected,
  ]);

  return {
    isConnected,
    socket: interviewSocket,
  };
}
