import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { JOBS, APPLICATIONS, CONVERSATIONS } from '../data/mockData';
import type {
  Application,
  Conversation,
  CandidateStage,
  ChatMessage,
  ActiveView,
  Assessment,
} from './types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function isoNow(): string {
  return new Date().toISOString();
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** The three default assessments auto-created when a role reaches 'assessment'. */
function buildDefaultAssessments(jobId: string): Assessment[] {
  // IDs are stable per job so re-hydration doesn't duplicate them.
  return [
    {
      id: `asmnt-${jobId}-cognitive`,
      type: 'cognitive',
      label: 'Cognitive Reasoning',
      completed: false,
      duration: 25,
    },
    {
      id: `asmnt-${jobId}-personality`,
      type: 'personality',
      label: 'Personality Profile',
      completed: false,
      duration: 20,
    },
    {
      id: `asmnt-${jobId}-technical`,
      type: 'technical',
      label: 'Technical Aptitude',
      completed: false,
      duration: 40,
    },
  ];
}

/** Derive recruiterStatus from a CandidateStage. */
function recruiterStatusForStage(stage: CandidateStage): Application['recruiterStatus'] {
  switch (stage) {
    case 'draft':
      return 'waiting-candidate';
    case 'applied':
    case 'in-review':
      return 'in-progress';
    case 'assessment':
      return 'waiting-candidate';
    case 'assessment-complete':
      return 'waiting-recruiter';
    case 'interview':
      return 'in-progress';
    case 'decision':
      return 'waiting-recruiter';
    case 'accepted':
    case 'rejected':
      return 'resolved';
  }
}

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

interface StoreState {
  // ── View ──────────────────────────────────────────────────────────────────
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  // ── Jobs (read-only reference data) ───────────────────────────────────────
  jobs: typeof JOBS;

  // ── Applications (persisted, mutable) ─────────────────────────────────────
  applications: Application[];
  getApplication: (id: string) => Application | undefined;
  advanceStage: (applicationId: string, newStage: CandidateStage) => void;
  completeAssessment: (applicationId: string, assessmentId: string, score?: number) => void;
  unlockInsight: (applicationId: string) => void;
  submitApplication: (jobId: string) => Application;
  extendDeadline: (applicationId: string, newDate: string) => void;

  // ── Conversations (persisted) ─────────────────────────────────────────────
  conversations: Conversation[];
  addMessage: (conversationId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  getConversationByApplication: (applicationId: string) => Conversation | undefined;
  createConversation: (applicationId: string, jobTitle: string, company: string) => Conversation;

  // ── Chat overlay (global open/close) ─────────────────────────────────────
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;

  // ── Reset (for demo) ──────────────────────────────────────────────────────
  resetToInitial: () => void;
}

// ---------------------------------------------------------------------------
// Store implementation
// ---------------------------------------------------------------------------

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ── View ────────────────────────────────────────────────────────────────
      activeView: 'candidate',
      setActiveView: (view) => set({ activeView: view }),

      // ── Chat overlay ─────────────────────────────────────────────────────────
      chatOpen: false,
      setChatOpen: (open) => set({ chatOpen: open }),

      // ── Jobs ────────────────────────────────────────────────────────────────
      jobs: JOBS,

      // ── Applications ────────────────────────────────────────────────────────
      applications: APPLICATIONS,

      getApplication: (id) => get().applications.find((a) => a.id === id),

      advanceStage: (applicationId, newStage) =>
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id !== applicationId) return app;

            // Validate the transition follows the legal path
            const legalNext: Partial<Record<CandidateStage, CandidateStage[]>> = {
              draft: ['applied'],
              applied: ['in-review'],
              'in-review': ['assessment'],
              assessment: ['assessment-complete'],
              'assessment-complete': ['interview'],
              interview: ['decision'],
              decision: ['accepted', 'rejected'],
            };
            const allowed = legalNext[app.stage] ?? [];
            if (!allowed.includes(newStage)) {
              console.warn(
                `[useStore] advanceStage: illegal transition ${app.stage} → ${newStage} for ${applicationId}`,
              );
              return app;
            }

            const updated: Application = {
              ...app,
              stage: newStage,
              recruiterStatus: recruiterStatusForStage(newStage),
              lastActivityAt: isoNow(),
            };

            // Auto-create assessments when entering 'assessment' stage
            if (newStage === 'assessment' && app.assessments.length === 0) {
              updated.assessments = buildDefaultAssessments(app.jobId);
              updated.assessmentProgress = 0;
            }

            // Insight becomes available once assessment-complete AND window is closed
            if (newStage === 'assessment-complete') {
              updated.insightUnlocked = app.applicationWindowClosed;
              updated.hasInsightReport = true;
            }

            return updated;
          }),
        })),

      completeAssessment: (applicationId, assessmentId, score) =>
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id !== applicationId) return app;
            const updatedAssessments = app.assessments.map((a) =>
              a.id !== assessmentId ? a : { ...a, completed: true, ...(score !== undefined ? { score } : {}) },
            );
            const completedCount = updatedAssessments.filter((a) => a.completed).length;
            const progress = updatedAssessments.length > 0
              ? Math.round((completedCount / updatedAssessments.length) * 100)
              : 0;
            const allDone = completedCount === updatedAssessments.length && updatedAssessments.length > 0;
            return {
              ...app,
              assessments: updatedAssessments,
              assessmentProgress: progress,
              stage: allDone && app.stage === 'assessment' ? ('assessment-complete' as CandidateStage) : app.stage,
              recruiterStatus: allDone && app.stage === 'assessment' ? recruiterStatusForStage('assessment-complete') : app.recruiterStatus,
              insightUnlocked: allDone ? app.applicationWindowClosed : app.insightUnlocked,
              hasInsightReport: allDone ? true : app.hasInsightReport,
              lastActivityAt: isoNow(),
            };
          }),
        })),

      unlockInsight: (applicationId) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === applicationId
              ? {
                  ...app,
                  insightUnlocked: true,
                  applicationWindowClosed: true,
                  lastActivityAt: isoNow(),
                }
              : app,
          ),
        })),

      submitApplication: (jobId) => {
        const job = get().jobs.find((j) => j.id === jobId);
        if (!job) throw new Error(`[useStore] submitApplication: job ${jobId} not found`);

        // Prevent duplicate applications for the same job
        const existing = get().applications.find(
          (a) => a.jobId === jobId && a.candidateId === 'c-ahmad-azza',
        );
        if (existing) return existing;

        const today = new Date().toISOString().slice(0, 10);
        const newApp: Application = {
          id: generateId('app'),
          jobId,
          candidateId: 'c-ahmad-azza',
          stage: 'applied',
          recruiterStatus: 'in-progress',
          appliedAt: today,
          expectedDecisionDate: addDays(today, job.processingDays),
          assessments: [],
          assessmentProgress: 0,
          insightUnlocked: false,
          applicationWindowClosed: false,
          deadline: addDays(today, 30),
          extensionsUsed: 0,
          hasInsightReport: false,
          lastActivityAt: isoNow(),
        };

        set((state) => ({ applications: [...state.applications, newApp] }));
        return newApp;
      },

      extendDeadline: (applicationId, newDate) =>
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id !== applicationId) return app;
            if (app.extensionsUsed >= 1) {
              // Second miss → auto-advance to 'decision'
              return {
                ...app,
                stage: 'decision' as CandidateStage,
                recruiterStatus: recruiterStatusForStage('decision'),
                lastActivityAt: isoNow(),
              };
            }
            return {
              ...app,
              deadline: newDate,
              extensionsUsed: 1,
              lastActivityAt: isoNow(),
            };
          }),
        })),

      // ── Conversations ────────────────────────────────────────────────────────
      conversations: CONVERSATIONS,

      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id !== conversationId
              ? conv
              : {
                  ...conv,
                  messages: [
                    ...conv.messages,
                    {
                      ...message,
                      id: generateId('msg'),
                      timestamp: isoNow(),
                    },
                  ],
                  lastMessageAt: isoNow(),
                  unread: message.role === 'ai',
                },
          ),
        })),

      getConversationByApplication: (applicationId) =>
        get().conversations.find((c) => c.applicationId === applicationId),

      createConversation: (applicationId, jobTitle, company) => {
        const existing = get().getConversationByApplication(applicationId);
        if (existing) return existing;

        const newConv: Conversation = {
          id: generateId('conv'),
          applicationId,
          jobTitle,
          company,
          messages: [],
          lastMessageAt: isoNow(),
          unread: false,
        };

        set((state) => ({ conversations: [...state.conversations, newConv] }));
        return newConv;
      },

      // ── Reset ────────────────────────────────────────────────────────────────
      resetToInitial: () =>
        set({
          activeView: 'candidate',
          jobs: JOBS,
          applications: APPLICATIONS,
          conversations: CONVERSATIONS,
        }),
    }),
    {
      name: 'claro-store-v2',
      // Only persist mutable state; jobs are always re-hydrated from mock data
      partialize: (state) => ({
        activeView: state.activeView,
        applications: state.applications,
        conversations: state.conversations,
      }),
    },
  ),
);

// ---------------------------------------------------------------------------
// Derived selectors (convenience hooks)
// ---------------------------------------------------------------------------

/** Returns all applications for the current candidate (Ahmad Azza). */
export const useApplications = () =>
  useStore(useShallow((s) => s.applications.filter((a) => a.candidateId === 'c-ahmad-azza')));

/** Returns all jobs, enriched with the candidate's application stage if applied. */
export const useJobsWithStatus = () => {
  const jobs = useStore((s) => s.jobs);
  const applications = useStore((s) => s.applications);
  return jobs.map((job) => ({
    ...job,
    application: applications.find(
      (a) => a.jobId === job.id && a.candidateId === 'c-ahmad-azza',
    ),
  }));
};
