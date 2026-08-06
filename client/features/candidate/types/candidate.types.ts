export interface CandidateProfile {
  id: string;
  resumeId: string;
  fullName: string;
  title: string;
  email: string;
  location: string;
  avatarInitials: string;
  summary: string;
  yearsOfExperience: number;
  targetRole: string;
}

export interface SkillItem {
  name: string;
  proficiency: number;
  category: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: ReadonlyArray<string>;
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  description: string;
  technologies: ReadonlyArray<string>;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  details: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface CompetencyScore {
  subject: string;
  candidate: number;
  required: number;
}

export interface MetricItem {
  label: string;
  score: number;
  description: string;
}

export type RoadmapDifficulty = "High" | "Med" | "Low";

export interface RoadmapQuestion {
  id: string;
  category: string;
  difficulty: RoadmapDifficulty;
  prompt: string;
}

export interface RoadmapSection {
  id: string;
  title: string;
  questions: ReadonlyArray<RoadmapQuestion>;
}

export interface InterviewRoadmap {
  durationMinutes: number;
  targetRole: string;
  complexity: string;
  readinessScore: number;
  recommendedFocus: ReadonlyArray<string>;
  sections: ReadonlyArray<RoadmapSection>;
}

export interface CandidateDossier {
  profile: CandidateProfile;
  skills: ReadonlyArray<SkillItem>;
  coreCompetencies: ReadonlyArray<string>;
  experience: ReadonlyArray<ExperienceItem>;
  projects: ReadonlyArray<ProjectItem>;
  education: ReadonlyArray<EducationItem>;
  certifications: ReadonlyArray<CertificationItem>;
  competencies: ReadonlyArray<CompetencyScore>;
  strengths: ReadonlyArray<MetricItem>;
  weaknesses: ReadonlyArray<MetricItem>;
  aiSummary: string;
  roadmap: InterviewRoadmap;
  analysisStatus: "complete" | "pending" | "failed";
}

export interface ResumeDetails {
  id: string;
  candidateId: string;
  fileName: string;
  uploadedAt: string;
  parsedSummary: string;
}

export interface AnalyzeResumeRequest {
  resumeId: string;
}

export interface AnalyzeResumeResponse {
  analysisId: string;
  status: "queued" | "processing" | "complete";
  candidateId: string;
}
