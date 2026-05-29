import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  IconSparkles,
  IconX,
  IconArrowUp,
  IconHeartHandshake,
} from '@tabler/icons-react';
import { useStore } from '../../store/useStore';
import { JOBS } from '../../data/mockData';
import type { Application, CandidateStage } from '../../store/types';
import styles from './AIChatOverlay.module.css';

// ── Constants ───────────────────────────────────────────────────

/** Standard daily limit — per account, not per application. */
const DAILY_LIMIT = 20;

/**
 * Empathy window: rejected candidates get a higher limit so they can
 * ask follow-up questions without hitting a wall right after bad news.
 */
const POST_REJECTION_LIMIT = 30;

// ── Types ──────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  isEscalation?: boolean;
}

// ── Application context (resolved from the current route) ──────

interface AppContext {
  appId: string | null;
  stage: CandidateStage | null;
  expectedDecisionDate: string | null;
  insightUnlocked: boolean;
  applicationWindowClosed: boolean;
  hasInsightReport: boolean;
  rejectionReason: string | null;
  pendingAssessments: number;
  totalAssessments: number;
  completedAssessments: number;
  assessmentLabels: string[];
}

const EMPTY_CTX: AppContext = {
  appId: null,
  stage: null,
  expectedDecisionDate: null,
  insightUnlocked: false,
  applicationWindowClosed: false,
  hasInsightReport: false,
  rejectionReason: null,
  pendingAssessments: 0,
  totalAssessments: 0,
  completedAssessments: 0,
  assessmentLabels: [],
};

function getAppContext(
  pathname: string,
  applications: Application[],
): AppContext {
  const appMatch = pathname.match(/\/applications\/([^/]+)/);
  if (!appMatch) return EMPTY_CTX;
  const app = applications.find((a) => a.id === appMatch[1]);
  if (!app) return EMPTY_CTX;

  const pending = app.assessments.filter((a) => !a.completed);
  const completed = app.assessments.filter((a) => a.completed);

  return {
    appId: app.id,
    stage: app.stage,
    expectedDecisionDate: app.expectedDecisionDate ?? null,
    insightUnlocked: app.insightUnlocked,
    applicationWindowClosed: app.applicationWindowClosed,
    hasInsightReport: app.hasInsightReport,
    rejectionReason: app.rejectionReason ?? null,
    pendingAssessments: pending.length,
    totalAssessments: app.assessments.length,
    completedAssessments: completed.length,
    assessmentLabels: pending.map((a) => a.label),
  };
}

// ── Stage label map ─────────────────────────────────────────────

const STAGE_LABELS: Record<CandidateStage, string> = {
  draft: 'Draft',
  applied: 'Applied',
  'in-review': 'Under Review',
  assessment: 'Assessment Pending',
  'assessment-complete': 'Assessment Complete',
  interview: 'Interview',
  decision: 'Final Decision',
  accepted: 'Accepted',
  rejected: 'Application Closed',
};

// ── Forbidden patterns (asymmetry + no-prediction rules) ────────
//
// These are checked BEFORE any canned response is chosen.
// The chatbot NEVER:
//   - Ranks or compares the candidate to others
//   - Reveals raw scores or cutoff thresholds
//   - Predicts hiring outcomes

const FORBIDDEN_PATTERNS: { regex: RegExp; response: string }[] = [
  {
    regex:
      /rank(ing)?|how do i compare|where do i stand|am i ahead|better than other|other candidates?|other applicants?|how many (applied|candidates|applicants)|competition/i,
    response:
      "I can't compare you to other candidates or share rankings — that information stays private to protect everyone in the process. What I can do is tell you about your own application, what each stage means, and what to expect next.",
  },
  {
    regex:
      /raw score|exact score|cutoff|passing score|threshold|what score did i (get|receive)|my (exact )?score|numeric score|number(ic)? result/i,
    response:
      "I don't share raw scores or cutoff thresholds — that's by design. Your Insight Report gives you a meaningful breakdown of your performance without reducing it to a single number. It'll be available once the application window closes.",
  },
  {
    regex:
      /will i (get|be|pass|succeed|make it|get selected|get hired|get the job|get an offer|receive an offer)|am i going to (get|be|pass)|chance(s)? of (getting|being|passing|success)|do i have a (good )?chance|will they (hire|select|pick|choose) me|predict.*outcome|my (odds|probability|likelihood)/i,
    response:
      "I'm not able to predict hiring outcomes — that wouldn't be honest or fair to you. Every application is reviewed on its own merits by the recruiter. What I can tell you is where you stand in the process and what happens next.",
  },
];

function checkForbidden(input: string): string | null {
  for (const { regex, response } of FORBIDDEN_PATTERNS) {
    if (regex.test(input)) return response;
  }
  return null;
}

// ── ID + timestamp helpers ──────────────────────────────────────

let _seq = 0;
function uid(): string {
  return `msg-${Date.now()}-${++_seq}`;
}

function nowTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// ── Context-aware subtitle ──────────────────────────────────────

function getContextSubtitle(
  pathname: string,
  applications: Application[],
): string {
  const appMatch = pathname.match(/\/applications\/([^/]+)/);
  if (appMatch) {
    const app = applications.find((a) => a.id === appMatch[1]);
    if (app) {
      const job = JOBS.find((j) => j.id === app.jobId);
      if (job) return `${job.title} at ${job.company}`;
    }
  }
  if (/\/jobs\/[^/]+\/apply/.test(pathname)) return 'Application Form · Claro AI';
  if (/\/jobs\/[^/]+/.test(pathname))        return 'Job Detail · Claro AI';
  if (/\/jobs/.test(pathname))               return 'Browse Jobs · Claro AI';
  if (/\/profile/.test(pathname))            return 'My Profile · Claro AI';
  return 'AI-powered candidate support';
}

// ── Context-aware initial greeting ─────────────────────────────
//
// Where we have real data, we reference it. Where we don't, we stay
// factual and forward-looking without fabricating anything.

function getInitialGreeting(pathname: string, ctx: AppContext): string {
  if (/\/applications\/[^/]+\/assessment/.test(pathname)) {
    if (ctx.totalAssessments > 0) {
      const rem = ctx.pendingAssessments;
      if (rem === 0) {
        return "Hi! You've completed all your assessments. I can answer questions about what happens next, or explain what your Insight Report will contain once the window closes. What would you like to know?";
      }
      return `Hi! I can see you're on the Assessment screen. You have ${rem} assessment${rem > 1 ? 's' : ''} remaining. I can answer questions about how they work, timing, and what to expect. What would you like to know?`;
    }
    return "Hi! I can see you're on the Assessment screen. I can answer questions about how it works, timing, and what to expect. What would you like to know?";
  }

  if (/\/applications\/[^/]+\/insight/.test(pathname)) {
    if (ctx.insightUnlocked) {
      return "Hi! Your Insight Report is available. Ask me what your scores mean, how sections are weighted, or what to focus on for future applications.";
    }
    return "Hi! I can see you're viewing the Insight Report area. Ask me what scores mean, how they're calculated, or when your report will be available.";
  }

  if (/\/applications\/[^/]+\/closed/.test(pathname)) {
    const extra = ctx.rejectionReason
      ? " The recruiter has shared a note about your outcome."
      : "";
    return `Hi! I can see your application has closed.${extra} I can explain what this means, walk you through your Insight Report, and help you think about next steps. What would you like to know?`;
  }

  if (/\/applications\/[^/]+/.test(pathname)) {
    if (ctx.stage) {
      const label = STAGE_LABELS[ctx.stage];
      return `Hi! Your application is currently at the "${label}" stage. I can share information about what this means, what to expect next, and answer any questions about the process. What would you like to know?`;
    }
    return "Hi! I can see you're on your application. I can share information about your status, what each stage means, and what to expect next. What would you like to know?";
  }

  if (/\/jobs\/[^/]+\/apply/.test(pathname)) {
    return "Hi! I can see you're filling out an application. I'm here to answer questions about the process. What would you like to know?";
  }

  if (/\/jobs\/[^/]+/.test(pathname)) {
    return "Hi! I can see you're viewing this job. I can answer questions about the role, the hiring process, or what applying involves. What would you like to know?";
  }

  return "Hi! I'm Claro AI — I'm here to help with your application journey. Ask me anything about your application status, assessments, or what to expect next.";
}

// ── Data-bound canned responses ─────────────────────────────────
//
// Rules:
//   1. Pull factual data from AppContext — never invent values.
//   2. When data is unavailable, say so honestly. Never guess.
//   3. Forbidden patterns are already caught before this function runs.

function getCannedResponse(input: string, _pathname: string, ctx: AppContext): string {
  const text = input.toLowerCase();

  // ── Stage / status ──────────────────────────────────────────
  if (/stage|status/.test(text)) {
    if (ctx.stage) {
      const label = STAGE_LABELS[ctx.stage];
      const detail: Record<CandidateStage, string> = {
        draft: 'Your draft is saved — finish and submit when you\'re ready.',
        applied: 'Your application has been received and is queued for recruiter review.',
        'in-review': 'The recruiter is actively evaluating your profile and assessment results. No action needed from you.',
        assessment: `You have ${ctx.pendingAssessments} assessment${ctx.pendingAssessments !== 1 ? 's' : ''} to complete. Finishing them is your most important next step.`,
        'assessment-complete': 'All assessments are complete and under recruiter review. Your Insight Report will be available once the window closes.',
        interview: 'You\'re at the interview stage. Check your application page for any instructions from the recruiter.',
        decision: 'The recruiter is making a final decision. You\'ll be notified as soon as it\'s ready.',
        accepted: 'Congratulations — your application has been accepted! Check your application for next steps.',
        rejected: ctx.rejectionReason
          ? `The recruiter has moved forward with other candidates. They shared this note: "${ctx.rejectionReason}" Your Insight Report shows how you performed.`
          : 'The recruiter has moved forward with other candidates. Your Insight Report shows exactly how you performed — it\'s worth reviewing for future applications.',
      };
      return `Your application is at the "${label}" stage. ${detail[ctx.stage]}`;
    }
    return "I don't have your application status loaded right now. Head to your application page for the most accurate view of where you stand.";
  }

  // ── Assessment questions ────────────────────────────────────
  if (/assessment|test|quiz/.test(text)) {
    if (ctx.totalAssessments > 0) {
      if (ctx.completedAssessments === ctx.totalAssessments) {
        return `You've completed all ${ctx.totalAssessments} assessments. Results are under review — your Insight Report will be available once the application window closes.`;
      }
      const labels = ctx.assessmentLabels.join(', ');
      return `You have ${ctx.pendingAssessments} assessment${ctx.pendingAssessments > 1 ? 's' : ''} remaining: ${labels}. Each one is timed — make sure you're in a quiet place before starting. Your results are always shared with you regardless of outcome.`;
    }
    return "Assessments are timed exercises that help the recruiter understand your strengths. Your results are always shared with you — whether or not you're selected.";
  }

  // ── Insight / scores ────────────────────────────────────────
  if (/score|result|insight|report/.test(text)) {
    if (ctx.insightUnlocked && ctx.hasInsightReport) {
      return "Your Insight Report is ready — you can view it from your application page. It includes a full breakdown: cognitive, personality, and technical (where applicable). I can explain what each section means if you'd like.";
    }
    if (ctx.hasInsightReport && !ctx.insightUnlocked) {
      return "Your Insight Report exists but becomes accessible once the application window officially closes. You'll be notified when it's viewable. It includes cognitive, personality, and technical results.";
    }
    if (ctx.stage === 'assessment' || ctx.stage === 'assessment-complete') {
      return "Your Insight Report will be generated once the application window closes. It'll show your full assessment breakdown — cognitive, personality, and technical (where applicable).";
    }
    return "Your Insight Report becomes available once you've completed your assessments and the application window closes. It shows your full performance breakdown.";
  }

  // ── Rejection / closed ──────────────────────────────────────
  if (/reject|closed|not selected|didn't get|did not get/.test(text)) {
    if (ctx.stage === 'rejected') {
      const extra = ctx.rejectionReason
        ? ` The recruiter shared this note: "${ctx.rejectionReason}".`
        : '';
      return `Your application has closed.${extra} Your Insight Report shows exactly how you performed across every section — it's worth reviewing so you can build on your strengths for future applications.`;
    }
    return "An 'Application Closed' outcome means the recruiter has moved forward with other candidates. Your Insight Report shows exactly how you performed — it's one of the most useful things Claro provides.";
  }

  // ── Timeline / decision date ─────────────────────────────────
  if (/timeline|deadline|when|decision|hear back|how long/.test(text)) {
    if (ctx.expectedDecisionDate) {
      const formatted = formatDate(ctx.expectedDecisionDate);
      return `Based on your application, decisions are expected by ${formatted}. If you haven't heard anything by then, your dashboard will reflect any update — or feel free to ask me again.`;
    }
    return "I don't have a specific decision date on file for your application right now. Check your application detail page — the expected timeline is shown there. I'm happy to explain what each stage means while you wait.";
  }

  // ── Salary / offer ──────────────────────────────────────────
  if (/salary|pay|compensation|offer/.test(text)) {
    return "Salary details are confirmed in the offer letter if you're selected. The recruiter typically negotiates after a verbal offer is extended — you'll have the opportunity to discuss at that point.";
  }

  // ── Interview ───────────────────────────────────────────────
  if (/interview/.test(text)) {
    return "AI Interviews are conversational and text-based. There are no surprise questions — you'll see them one at a time and can take your time to respond. Your answers are recorded and reviewed by the recruiter alongside your assessment results.";
  }

  // ── Improvement / future prep ───────────────────────────────
  if (/improve|better|next time|prepare|preparation/.test(text)) {
    if (ctx.insightUnlocked && ctx.hasInsightReport) {
      return "Your Insight Report has detailed per-section breakdowns — focus on any areas that are flagged. I can help you interpret what each section is measuring if you'd like to go deeper.";
    }
    return "Once your Insight Report is available, it'll give you a clear picture of where to focus. In the meantime, for future applications, strong performance usually comes from taking each assessment in a calm, uninterrupted setting.";
  }

  // ── What's next ─────────────────────────────────────────────
  if (/what.*next|do next|do now|next step/.test(text)) {
    if (ctx.stage === 'rejected') {
      return "Your next step is to review your Insight Report when it becomes available — it shows you exactly where you stood and what to focus on for future applications. You can also explore other open roles on the jobs board.";
    }
    if (ctx.stage === 'assessment' && ctx.pendingAssessments > 0) {
      return `Your next step is to complete your ${ctx.pendingAssessments} remaining assessment${ctx.pendingAssessments > 1 ? 's' : ''}. Head to your application page and start when you're in a quiet, uninterrupted environment.`;
    }
    if (ctx.stage === 'applied' || ctx.stage === 'in-review') {
      return "Right now, you don't need to do anything. The recruiter is reviewing applications — you'll be notified if your next step is an assessment or interview.";
    }
    return "Check your application page for the next required action. If there's an assessment pending, completing it is always the best next step.";
  }

  // ── Under review ────────────────────────────────────────────
  if (/under review|review mean/.test(text)) {
    return '"Under review" means the recruiter is actively evaluating your profile and assessment results alongside the role requirements. No action is needed from you at this stage — you\'ll be notified of any update.';
  }

  // ── Honest fallback ─────────────────────────────────────────
  return "I'm here to help with your application process, but I want to be honest — I can only share what's in your application record. Ask me about your status, assessments, timelines, or what each stage means and I'll tell you exactly what I know.";
}

// ── Context-aware suggestion chips ─────────────────────────────

function getSuggestions(pathname: string, ctx: AppContext): string[] {
  if (/\/applications\/[^/]+\/assessment/.test(pathname)) {
    if (ctx.pendingAssessments > 0) {
      return ['How long does the assessment take?', 'What if I lose connection?', 'Is there anything I need to do next?'];
    }
    return ['When will my Insight Report be ready?', 'What does each section measure?', 'Is there anything I need to do next?'];
  }
  if (/\/applications\/[^/]+\/insight/.test(pathname))
    return ['What do my scores mean?', 'How is the overall score calculated?', 'Is there anything I need to do next?'];
  if (/\/applications\/[^/]+\/closed/.test(pathname))
    return ['What should I do next?', 'How can I improve for future applications?'];
  if (/\/applications\/[^/]+/.test(pathname)) {
    const chips: string[] = [];
    if (ctx.expectedDecisionDate) {
      chips.push('When can I expect a decision?');
    } else {
      chips.push('When can I expect a decision?');
    }
    chips.push('What does my current stage mean?');
    if (ctx.pendingAssessments > 0) chips.push('How many assessments do I have left?');
    else chips.push('Is there anything I need to do next?');
    return chips;
  }
  if (/\/jobs\/[^/]+\/apply/.test(pathname))
    return ['What info does the company see?', 'Can I edit my application after submitting?'];
  if (/\/jobs\/[^/]+/.test(pathname))
    return ['What should I include in my application?', 'What does this assessment process involve?'];
  if (/\/jobs/.test(pathname))
    return ['What makes a strong application?', 'How does transparent hiring work?'];
  return ['How does Claro work?', 'What can you help me with?'];
}

// ── Typing indicator bubble ─────────────────────────────────────

function TypingBubble() {
  return (
    <div className={styles.bubbleRow}>
      <div className={styles.aiAvatar}>
        <IconSparkles size={14} />
      </div>
      <div className={styles.bubbleGroup}>
        <div className={`${styles.aiBubble} ${styles.aiBubbleTyping}`}>
          <div className={styles.typingDots}>
            <span className={styles.typingDot} />
            <span className={styles.typingDot} />
            <span className={styles.typingDot} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────

export default function AIChatOverlay() {
  const { pathname } = useLocation();
  const applications = useStore((s) => s.applications) as Application[];
  const chatOpen    = useStore((s) => s.chatOpen);
  const setChatOpen = useStore((s) => s.setChatOpen);

  const isOpen    = chatOpen;
  const setIsOpen = setChatOpen;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Resolve real application data from the current route
  const appCtx = getAppContext(pathname, applications);

  // Post-rejection empathy window: higher limit so rejected candidates
  // aren't cut off exactly when they need support most.
  const effectiveLimit =
    appCtx.stage === 'rejected' ? POST_REJECTION_LIMIT : DAILY_LIMIT;

  const isLimited = sentCount >= effectiveLimit;
  const hasUserMessages = messages.some((m) => m.role === 'user');
  const showSuggestions = !isTyping && !isLimited && !hasUserMessages && messages.length > 0;

  // Scroll to bottom on new content
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isTyping]);

  // Seed initial AI greeting the first time the panel opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: uid(),
          role: 'ai',
          content: getInitialGreeting(pathname, appCtx),
          timestamp: nowTime(),
        },
      ]);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSend(text?: string) {
    const value = (text ?? input).trim();
    if (!value || isTyping || isLimited) return;

    const userMsg: Message = {
      id: uid(),
      role: 'user',
      content: value,
      timestamp: nowTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const nextCount = sentCount + 1;
    setSentCount(nextCount);

    setTimeout(() => {
      // Escalation offered every 4th message
      const isEscalation = nextCount % 4 === 0;

      let content: string;
      if (isEscalation) {
        content =
          'It looks like you might have more detailed questions. Would you like to connect with a human recruiter for a direct answer?';
      } else {
        content = checkForbidden(value) ?? getCannedResponse(value, pathname, appCtx);
      }

      setMessages((m) => [
        ...m,
        { id: uid(), role: 'ai', content, timestamp: nowTime(), isEscalation },
      ]);
      setIsTyping(false);
    }, 900);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const subtitle = getContextSubtitle(pathname, applications);
  const suggestions = getSuggestions(pathname, appCtx);

  // Limit-state placeholder — forward-looking, never a dead end
  const limitPlaceholder =
    appCtx.stage === 'rejected'
      ? 'Daily limit reached — your Insight Report has more answers'
      : 'Daily limit reached — check your dashboard for the latest status';

  return (
    <>
      {/* ── Panel ─────────────────────────────────────────────── */}
      {isOpen && (
        <div className={styles.panel} role="dialog" aria-label="Claro AI chat">

          {/* Header */}
          <div className={styles.panelHeader}>
            <div className={styles.headerMeta}>
              <span className={styles.headerTitle}>Claro AI</span>
              <span className={styles.headerSub}>{subtitle}</span>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close AI chat"
            >
              <IconX size={13} />
            </button>
          </div>

          {/* Scrollable chat content */}
          <div className={styles.chatContent}>

            {messages.map((msg) => {
              if (msg.role === 'user') {
                return (
                  <div key={msg.id} className={`${styles.bubbleRow} ${styles.bubbleRowUser}`}>
                    <div className={`${styles.bubbleGroup} ${styles.bubbleGroupUser}`}>
                      <div className={styles.userBubble}>{msg.content}</div>
                      <span className={`${styles.timestamp} ${styles.timestampUser}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={styles.bubbleRow}>
                  <div className={`${styles.aiAvatar} ${msg.isEscalation ? styles.aiAvatarEscalation : ''}`}>
                    {msg.isEscalation
                      ? <IconHeartHandshake size={14} />
                      : <IconSparkles size={14} />}
                  </div>
                  <div className={styles.bubbleGroup}>
                    <div className={`${styles.aiBubble} ${msg.isEscalation ? styles.aiBubbleEscalation : ''}`}>
                      {msg.isEscalation && (
                        <span className={styles.escalationLabel}>Human recruiter available</span>
                      )}
                      {msg.content}
                    </div>
                    <span className={styles.timestamp}>{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {isTyping && <TypingBubble />}

            {/* Suggestion chips — shown only before the first user message */}
            {showSuggestions && (
              <>
                <span className={styles.sectionLabel}>THE HIRING PROCESS</span>
                {suggestions.map((q) => (
                  <button
                    key={q}
                    className={styles.suggestionBtn}
                    onClick={() => handleSend(q)}
                  >
                    {q}
                  </button>
                ))}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className={styles.panelFooter}>
            <div className={`${styles.inputRow} ${isLimited ? styles.inputRowDisabled : ''}`}>
              <input
                className={styles.chatInput}
                placeholder={
                  isLimited
                    ? limitPlaceholder
                    : 'Ask anything about this application…'
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping || isLimited}
                aria-label="Message input"
              />
              <button
                className={`${styles.sendBtn} ${isLimited ? styles.sendBtnDisabled : ''}`}
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping || isLimited}
                aria-label="Send message"
              >
                <IconArrowUp size={12} />
              </button>
            </div>
            <p className={styles.disclaimer}>
              Claro AI shares what it knows — it never predicts hiring outcomes.
            </p>
          </div>

        </div>
      )}

      {/* ── Floating bubble trigger ────────────────────────────── */}
      <button
        className={styles.bubble}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
        aria-expanded={isOpen}
      >
        <IconSparkles size={22} />
        <span className={styles.onlineBadge} aria-hidden="true" />
      </button>
    </>
  );
}
