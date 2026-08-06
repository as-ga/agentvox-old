export type InterviewType = "technical" | "behavioral" | "mixed";
export type InterviewDifficulty = "easy" | "medium" | "hard" | "extreme";
export type AgentStatus = "idle" | "running" | "ready" | "blocked";
export type WorkflowStepStatus = "completed" | "active" | "pending";

export interface PlanningCandidate {
  id: string;
  fullName: string;
  title: string;
  level: string;
  percentileLabel: string;
  avatarInitials: string;
  resumeScore: number;
  readinessScore: number;
  selectedRole: string;
}

export interface InterviewConfiguration {
  role: string;
  difficulty: InterviewDifficulty;
  durationMinutes: number;
  questionCount: number;
  interviewType: InterviewType;
}

export interface InterviewAgent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  progress: number;
  ready: boolean;
}

export interface WorkflowStep {
  id: string;
  step: string;
  title: string;
  status: WorkflowStepStatus;
  icon: "resume" | "planning" | "questions" | "difficulty" | "graph" | "ready";
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface MetricBar {
  label: string;
  value: number;
}

export interface CoveragePoint {
  label: string;
  coverage: number;
}

export interface PlanningInsight {
  suggestions: ReadonlyArray<string>;
  strengths: ReadonlyArray<MetricBar>;
  gaps: ReadonlyArray<MetricBar>;
  strategy: string;
  recommendation: string;
}

export interface PlanningSummary {
  estimatedDurationMinutes: number;
  expectedQuestionCount: number;
  skillCoverage: number;
  confidenceScore: number;
  planningProgress: number;
  engineStatus: string;
}

export interface InterviewPlan {
  id: string;
  candidate: PlanningCandidate;
  configuration: InterviewConfiguration;
  agents: ReadonlyArray<InterviewAgent>;
  workflow: ReadonlyArray<WorkflowStep>;
  checklist: ReadonlyArray<ChecklistItem>;
  summary: PlanningSummary;
  skillDistribution: ReadonlyArray<MetricBar>;
  interviewCoverage: ReadonlyArray<CoveragePoint>;
  insights: PlanningInsight;
}

export interface CreateInterviewRequest {
  candidateId: string;
  configuration: InterviewConfiguration;
}

export interface CreateInterviewResponse {
  interviewId: string;
  status: "created" | "queued";
}

export interface PlanInterviewRequest {
  interviewId: string;
  configuration: InterviewConfiguration;
}

export interface PlanInterviewResponse {
  plan: InterviewPlan;
}
