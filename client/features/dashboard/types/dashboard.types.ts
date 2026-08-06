export type InterviewStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled";

export type RecommendationLabel =
  | "Strong Hire"
  | "Hire"
  | "Hold"
  | "No Hire"
  | "Practice";

export type NotificationKind =
  | "activity"
  | "suggestion"
  | "reminder";

export interface DashboardCandidate {
  id: string;
  fullName: string;
  currentRole: string;
  preferredRole: string;
  experienceLevel: string;
  avatarInitials: string;
  greeting: string;
  aiAssistantStatus: "online" | "analyzing" | "idle";
  resumeScore: number;
  readinessScore: number;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  delta: number;
  icon: "interviews" | "score" | "success" | "time";
}

export interface PerformancePoint {
  label: string;
  interviews: number;
  averageScore: number;
}

export interface WeeklyProgressPoint {
  day: string;
  minutes: number;
  score: number;
}

export interface SkillImprovementPoint {
  skill: string;
  previous: number;
  current: number;
}

export interface UpcomingInterview {
  id: string;
  company: string;
  position: string;
  date: string;
  time: string;
  status: InterviewStatus;
}

export interface RecentInterview {
  id: string;
  name: string;
  company: string;
  score: number;
  recommendation: RecommendationLabel;
  completedAt: string;
  reportId: string;
}

export interface InterviewHistoryItem {
  id: string;
  title: string;
  date: string;
  score: number;
  durationMinutes: number;
  status: InterviewStatus;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: string;
}

export interface AchievementBadge {
  id: string;
  label: string;
  description: string;
}

export interface Achievements {
  highestScore: number;
  streakDays: number;
  certifications: ReadonlyArray<string>;
  badges: ReadonlyArray<AchievementBadge>;
}

export interface DashboardNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  timestamp: string;
}

export interface QuickAction {
  id: string;
  label: string;
  href: string;
  description: string;
}

export interface CandidateDashboard {
  candidate: DashboardCandidate;
  metrics: ReadonlyArray<DashboardMetric>;
  performanceTrend: ReadonlyArray<PerformancePoint>;
  weeklyProgress: ReadonlyArray<WeeklyProgressPoint>;
  skillImprovement: ReadonlyArray<SkillImprovementPoint>;
  upcomingInterviews: ReadonlyArray<UpcomingInterview>;
  recentInterviews: ReadonlyArray<RecentInterview>;
  interviewHistory: ReadonlyArray<InterviewHistoryItem>;
  activityTimeline: ReadonlyArray<ActivityItem>;
  achievements: Achievements;
  notifications: ReadonlyArray<DashboardNotification>;
  quickActions: ReadonlyArray<QuickAction>;
  lastSyncedAt: string;
}

export interface DashboardInterviewListItem {
  id: string;
  title: string;
  status: InterviewStatus;
  score: number | null;
  scheduledAt: string;
}

export interface DashboardReportListItem {
  id: string;
  interviewId: string;
  title: string;
  score: number;
  recommendation: RecommendationLabel;
  createdAt: string;
}
