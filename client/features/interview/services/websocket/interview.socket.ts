"use client";

import {
  INTERVIEW_SOCKET_EVENTS,
  type InterviewSocketEvent,
  type InterviewSocketPayloadMap,
} from "@/features/interview/services/websocket/events";

type SocketListener<T> = (payload: T) => void;

/**
 * Architecture-ready interview socket client.
 * No real network connection is established yet; listeners are local-only.
 * Future integration: connect to `/ws/interview/{id}` and `/ws/transcript`.
 */
class InterviewSocketClient {
  private static instance: InterviewSocketClient | null = null;

  private readonly listeners = new Map<
    InterviewSocketEvent,
    Set<SocketListener<unknown>>
  >();

  private interviewId: string | null = null;
  private connected = false;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  static getInstance(): InterviewSocketClient {
    InterviewSocketClient.instance ??= new InterviewSocketClient();
    return InterviewSocketClient.instance;
  }

  isConnected(): boolean {
    return this.connected;
  }

  getInterviewId(): string | null {
    return this.interviewId;
  }

  connect(interviewId: string): void {
    this.interviewId = interviewId;
    this.connected = true;
    this.emit(INTERVIEW_SOCKET_EVENTS.connect, { at: new Date().toISOString() });
    this.emit(INTERVIEW_SOCKET_EVENTS.join, { interviewId });
    this.startHeartbeat();
  }

  disconnect(): void {
    if (this.interviewId) {
      this.emit(INTERVIEW_SOCKET_EVENTS.leave, {
        interviewId: this.interviewId,
      });
    }

    this.stopHeartbeat();
    this.connected = false;
    this.interviewId = null;
    this.emit(INTERVIEW_SOCKET_EVENTS.disconnect, {
      at: new Date().toISOString(),
    });
  }

  on<E extends keyof InterviewSocketPayloadMap>(
    event: E,
    listener: SocketListener<InterviewSocketPayloadMap[E]>
  ): () => void {
    const bucket =
      this.listeners.get(event) ?? new Set<SocketListener<unknown>>();
    bucket.add(listener as SocketListener<unknown>);
    this.listeners.set(event, bucket);

    return () => {
      bucket.delete(listener as SocketListener<unknown>);
    };
  }

  emit<E extends keyof InterviewSocketPayloadMap>(
    event: E,
    payload: InterviewSocketPayloadMap[E]
  ): void {
    const bucket = this.listeners.get(event);
    if (!bucket) {
      return;
    }

    for (const listener of bucket) {
      listener(payload);
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.emit(INTERVIEW_SOCKET_EVENTS.heartbeat, {
        at: new Date().toISOString(),
      });
    }, 15_000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}

export const interviewSocket = InterviewSocketClient.getInstance();
