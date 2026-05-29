export type CandidateStage =
  | 'draft'
  | 'applied'
  | 'in-review'
  | 'assessment'
  | 'assessment-complete'
  | 'interview'
  | 'decision'
  | 'accepted'
  | 'rejected';

export type RecruiterStatus =
  | 'waiting-recruiter'
  | 'waiting-candidate'
  | 'in-progress'
  | 'resolved';

export type AssessmentType = 'cognitive' | 'personality' | 'technical' | 'interview';

export interface Assessment {
  id: string;
  type: AssessmentType;
  label: string;
  completed: boolean;
  score?: number; // only for cognitive + technical
  duration: number; // minutes
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  stage: CandidateStage;
  recruiterStatus: RecruiterStatus;
  appliedAt: string; // ISO date
  expectedDecisionDate: string; // ISO date
  assessments: Assessment[];
  assessmentProgress: number; // 0-100
  insightUnlocked: boolean;
  applicationWindowClosed: boolean;
  deadline: string; // ISO date
  extensionsUsed: number; // 0 or 1 (max 1 extension allowed)
  offerDetails?: {
    salary: string;
    startDate: string;
    position: string;
    company: string;
  };
  rejectionReason?: string; // if recruiter chose to share
  hasInsightReport: boolean;
  lastActivityAt: string;
  /** Only set when stage === 'draft'. Tracks the application form step. */
  draftStep?: number;
  draftTotalSteps?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogoInitials: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  location: string;
  workMode: 'On-site' | 'Remote' | 'Hybrid';
  salaryRange: string;
  processingDays: number;
  positions: number;
  includes: AssessmentType[];
  closingDate: string; // ISO date
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  stage: string; // e.g. "Assessment"
  industry: string;
  experienceLevel: string;
  isOpen: boolean;
  postedAt: string;
}

export interface Conversation {
  id: string;
  applicationId: string;
  jobTitle: string;
  company: string;
  messages: ChatMessage[];
  lastMessageAt: string;
  unread: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  isEscalation?: boolean;
}

export type ActiveView = 'candidate' | 'recruiter';
