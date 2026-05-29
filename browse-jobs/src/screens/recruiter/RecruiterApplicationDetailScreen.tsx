import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  IconArrowLeft,
  IconAlertCircle,
  IconAlertTriangle,
  IconBrain,
  IconUser,
  IconCode,
  IconVideo,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandLinkedin,
  IconLink,
  IconArrowRight,
  IconRefresh,
  IconChevronUp,
  IconChevronDown,
  IconMessageCircle,
} from '@tabler/icons-react';
import { useToast } from '../../store/useToast';
import {
  PIPELINE_CANDIDATES,
  VACANCY_DETAILS,
} from '../../data/mockData';
import type {
  PipelineApplication,
  PipelineCandidateStatus,
  VacancyStage,
} from '../../data/mockData';
import { Button, Avatar, Callout, Dialog } from '../../components/ds';
import styles from './RecruiterApplicationDetailScreen.module.css';

// ── Status config ──────────────────────────────────────────────

const STATUS_CONFIG: Record<PipelineCandidateStatus, { label: string; amber: boolean }> = {
  'waiting-for-review': { label: 'Waiting on recruiter', amber: true  },
  'in-progress':        { label: 'In progress',          amber: false },
  shortlisted:          { label: 'Shortlisted',          amber: false },
  'offer-sent':         { label: 'Offer sent',           amber: false },
};

const STAGE_LABEL: Record<VacancyStage, string> = {
  Applied:        'Applied',
  Assessment:     'Assessment stage',
  Interview:      'Interview stage',
  'Final Review': 'Final Review',
  Resolved:       'Resolved',
};

// ── Assessment icon map ────────────────────────────────────────

type AssessmentTypeKey = 'cognitive' | 'personality' | 'technical' | 'ai-interview';

const ASSESS_CFG: Record<AssessmentTypeKey, { Icon: React.ElementType; bg: string; color: string }> = {
  cognitive:      { Icon: IconBrain, bg: 'var(--assessment-cognitive-bg)',    color: 'var(--assessment-cognitive-icon)' },
  personality:    { Icon: IconUser,  bg: 'var(--assessment-personality-bg)', color: 'var(--assessment-personality-icon)' },
  technical:      { Icon: IconCode,  bg: 'var(--assessment-technical-bg)',    color: 'var(--assessment-technical-icon)' },
  'ai-interview': { Icon: IconVideo, bg: 'var(--assessment-interview-bg)',    color: 'var(--assessment-interview-icon)' },
};

function getAssessCfg(type: string) {
  return ASSESS_CFG[type as AssessmentTypeKey] ?? ASSESS_CFG.cognitive;
}

// ── Date helpers ───────────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function daysAgoDate(days: number): string {
  const d = new Date(2026, 4, 28); // May 28, 2026
  d.setDate(d.getDate() - days);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// ── Assessment score per type (based on candidate overall score) ─

const SCORE_OFFSETS: Record<string, number> = {
  cognitive:      0,
  personality:    0,
  technical:      -7,
  'ai-interview': 3,
};

function getAssessmentScore(type: string, base: number): number {
  return Math.min(99, Math.max(50, Math.round(base + (SCORE_OFFSETS[type] ?? 0))));
}

// ── Breakdown categories per assessment type ───────────────────

function clip(v: number): number {
  return Math.min(99, Math.max(45, Math.round(v)));
}

function getBreakdownCategories(type: string, score: number): { label: string; value: number }[] {
  switch (type) {
    case 'cognitive':
      return [
        { label: 'Numerical reasoning', value: clip(score + 4)  },
        { label: 'Verbal reasoning',    value: clip(score - 3)  },
        { label: 'Logical reasoning',   value: clip(score + 1)  },
        { label: 'Abstract reasoning',  value: clip(score - 13) },
      ];
    case 'technical':
      return [
        { label: 'Numerical reasoning',  value: clip(score + 11) },
        { label: 'Verbal reasoning',     value: clip(score + 7)  },
        { label: 'Usability Evaluation', value: clip(score + 4)  },
        { label: 'Logical reasoning',    value: clip(score - 11) },
        { label: 'Abstract reasoning',   value: clip(score - 9)  },
      ];
    case 'ai-interview':
      return [
        { label: 'Communication',       value: clip(score + 7)  },
        { label: 'Clarity',             value: clip(score + 4)  },
        { label: 'Structured Thinking', value: clip(score - 2)  },
        { label: 'Relevance',           value: clip(score - 16) },
      ];
    default:
      return [];
  }
}

// ── OCEAN / Personality scores ─────────────────────────────────

const OCEAN_TRAITS = [
  { key: 'O', label: 'Openness' },
  { key: 'C', label: 'Conscientiousness' },
  { key: 'E', label: 'Extraversion' },
  { key: 'A', label: 'Agreeableness' },
  { key: 'N', label: 'Neuroticism' },
] as const;

function getOceanScores(candidateId: string): Record<string, number> {
  const id = parseInt(candidateId.replace('pc-', ''), 10) || 1;
  return {
    O: 65 + (id * 7  % 30),
    C: 60 + (id * 11 % 35),
    E: 40 + (id * 5  % 40),
    A: 55 + (id * 13 % 30),
    N: 20 + (id * 3  % 40),
  };
}

// Readable OCEAN label for Overview snapshot
const OCEAN_TEXT: Record<string, string> = {
  'pc-1':  'High: O, C, A  •  Low: N',
  'pc-2':  'High: O, A  •  Low: E, N',
  'pc-3':  'High: C, E  •  Low: N',
  'pc-4':  'High: O, C  •  Low: N',
  'pc-5':  'High: O, E, A  •  Low: N',
  'pc-6':  'High: C, A  •  Low: N, E',
  'pc-7':  'High: O  •  Low: N, C',
  'pc-8':  'High: E, A  •  Low: N',
  'pc-9':  'High: O, C, E  •  Low: N',
  'pc-10': 'High: A  •  Low: N, O',
};

function getOceanText(candidateId: string): string {
  return OCEAN_TEXT[candidateId] ?? 'High: O, C  •  Low: N, E';
}

// ── AI Interview Q&A ───────────────────────────────────────────

interface AIQuestion {
  id: string;
  text: string;
  clarity: number;
  relevance: number;
  depth: number;
  totalScore: number;
  transcript: string;
}

const AI_INTERVIEW_QUESTIONS: AIQuestion[] = [
  {
    id: 'q1',
    text: 'Tell me about yourself and your background in this field.',
    clarity: 88, relevance: 85, depth: 82, totalScore: 85,
    transcript: `I have been working as a professional in this space for about 4 years now. I started my career at a small startup where I was the primary owner of several key responsibilities, which pushed me to learn end-to-end — from ideation through to execution. After that I moved to a mid-size company where I worked on a team of 5. My focus has been on delivering high-quality outcomes while maintaining a strong understanding of user needs and business context. I am passionate about work that is both thoughtful and impactful.`,
  },
  {
    id: 'q2',
    text: 'Describe a project where you had to balance user needs with business constraints.',
    clarity: 82, relevance: 79, depth: 84, totalScore: 82,
    transcript: `In my previous role we had a project with a tight deadline and high quality requirements. I worked closely with stakeholders to identify which features were truly essential, prioritised ruthlessly, and ensured the core user needs were met without scope creep. The result was a successful delivery that both users and the business were happy with.`,
  },
  {
    id: 'q3',
    text: 'How do you approach working with cross-functional teams during a project?',
    clarity: 85, relevance: 88, depth: 76, totalScore: 83,
    transcript: `I believe strong cross-functional collaboration starts with clear communication and mutual respect. I make it a point to understand what success looks like for each team — engineering, product, and business — and then find the common ground that drives the best outcome for the project.`,
  },
  {
    id: 'q4',
    text: 'Walk me through your process for tackling a complex or ambiguous problem.',
    clarity: 79, relevance: 83, depth: 88, totalScore: 83,
    transcript: `When faced with a complex problem, I start by clearly defining what the actual problem is — not the surface symptom. I gather relevant data, talk to stakeholders, and form a structured hypothesis. Then I test the solution in small increments, learn quickly, and iterate. This approach has consistently helped me stay focused on real impact.`,
  },
  {
    id: 'q5',
    text: 'What does excellence look like in your role?',
    clarity: 90, relevance: 82, depth: 85, totalScore: 86,
    transcript: `Excellence means consistently delivering work that not only meets the requirements but anticipates future needs. It means being someone your colleagues can rely on for quality, clarity, and follow-through. Most importantly, it means staying curious and always looking for ways to improve — both the work and the way I do it.`,
  },
];

// ── Timeline ───────────────────────────────────────────────────

interface TimelineEvent {
  id: string;
  label: string;
  date: string;
  by: string;
  note?: string;
}

function buildTimeline(app: PipelineApplication): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const hasScore = app.score !== null;

  if (hasScore) {
    events.push({
      id: 'e0',
      label: 'Assessment submitted',
      date: daysAgoDate(1),
      by: 'candidate',
      note: 'Cognitive Reasoning — 78%. Personality Profile — completed.',
    });
  } else if (app.stage === 'Assessment' || app.stage === 'Interview' || app.stage === 'Final Review' || app.stage === 'Resolved') {
    events.push({ id: 'e0', label: app.lastActivity.event, date: daysAgoDate(2), by: app.lastActivity.by });
  }

  if (app.stage === 'Assessment' || app.stage === 'Interview' || app.stage === 'Final Review' || app.stage === 'Resolved') {
    events.push({ id: 'e1', label: 'Assessment window opened', date: daysAgoDate(5), by: 'system' });
  }

  if (app.stage !== 'Applied') {
    events.push({
      id: 'e2',
      label: `Moved to ${app.stage.toLowerCase()} stage`,
      date: daysAgoDate(6),
      by: 'recruiter',
      note: 'Strong portfolio — advanced for next stage.',
    });
  }

  events.push({
    id: 'e3',
    label: 'Application reviewed by system',
    date: daysAgoDate(7),
    by: 'system',
    note: 'Application passed initial screening. Profile meets requirements.',
  });

  events.push({ id: 'e4', label: 'Application received', date: daysAgoDate(8), by: 'system' });

  return events;
}

// ── Candidate ref & extra info ─────────────────────────────────

function buildRef(candidateId: string): string {
  const n = parseInt(candidateId.replace('pc-', ''), 10) || 1;
  return `#CLA-${90000 + n}`;
}

interface CandidateExtra {
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
}

const CANDIDATE_EXTRA: Record<string, CandidateExtra> = {
  'pc-1':  { phone: '+62 812 9001 0001', location: 'Jakarta Selatan, Indonesia', linkedin: 'linkedin.com/in/aditya-k', portfolio: 'aditya.design' },
  'pc-2':  { phone: '+62 813 9002 0002', location: 'Jakarta, Indonesia',           linkedin: 'linkedin.com/in/fika-p' },
  'pc-3':  { phone: '+62 856 9003 0003', location: 'Jakarta Selatan, Indonesia' },
  'pc-4':  { phone: '+62 878 9004 0004', location: 'Jakarta, Indonesia',           linkedin: 'linkedin.com/in/maya-f' },
  'pc-5':  { phone: '+62 811 9005 0005', location: 'Bandung, Indonesia' },
  'pc-6':  { phone: '+62 822 9006 0006', location: 'Jakarta, Indonesia',           linkedin: 'linkedin.com/in/hamida-r' },
  'pc-7':  { phone: '+62 877 9007 0007', location: 'Jakarta Selatan, Indonesia',   portfolio: 'dewi.portfolio.io' },
  'pc-8':  { phone: '+62 895 9008 0008', location: 'Jakarta, Indonesia' },
  'pc-9':  { phone: '+62 851 9009 0009', location: 'Jakarta Barat, Indonesia',     linkedin: 'linkedin.com/in/siti-a' },
  'pc-10': { phone: '+62 812 9010 0010', location: 'Jakarta, Indonesia',           linkedin: 'linkedin.com/in/rizky-p' },
  'pc-11': { phone: '+62 857 9011 0011', location: 'Jakarta Pusat, Indonesia',     linkedin: 'linkedin.com/in/laila-n', portfolio: 'laila.works' },
  'pc-12': { phone: '+62 818 9012 0012', location: 'Surabaya, Indonesia' },
  'pc-13': { phone: '+62 896 9013 0013', location: 'Jakarta, Indonesia' },
  'pc-14': { phone: '+62 812 9014 0014', location: 'Depok, Indonesia',             linkedin: 'linkedin.com/in/farhan-m' },
  'pc-15': { phone: '+62 877 9015 0015', location: 'Jakarta Selatan, Indonesia',   linkedin: 'linkedin.com/in/anisa-w', portfolio: 'anisa.design' },
  'pc-16': { phone: '+62 831 9016 0016', location: 'Jakarta, Indonesia' },
  'pc-17': { phone: '+62 857 9017 0017', location: 'Jakarta, Indonesia',           linkedin: 'linkedin.com/in/indira-s' },
  'pc-18': { phone: '+62 811 9018 0018', location: 'Jakarta Timur, Indonesia' },
  'pc-19': { phone: '+62 822 9019 0019', location: 'Jakarta, Indonesia',           portfolio: 'citra.dev' },
  'pc-20': { phone: '+62 878 9020 0020', location: 'Jakarta, Indonesia' },
};

// ── InfoRow ────────────────────────────────────────────────────

interface InfoRowProps {
  label: string;
  value: string;
  isLink?: boolean;
  href?: string;
  icon?: React.ReactNode;
}

function InfoRow({ label, value, isLink, href, icon }: InfoRowProps) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>
        {isLink && href ? (
          <a href={href} className={styles.infoLink} target="_blank" rel="noopener noreferrer">
            {icon && <span className={styles.infoLinkIcon}>{icon}</span>}
            {value}
          </a>
        ) : (
          <>
            {icon && <span className={styles.infoLinkIcon}>{icon}</span>}
            {value}
          </>
        )}
      </span>
    </div>
  );
}

// ── Main screen ────────────────────────────────────────────────

const THRESHOLD = 70; // passing threshold %

export default function RecruiterApplicationDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const vacancyIdFromState = (location.state as { vacancyId?: string } | null)?.vacancyId;

  const [activeTab, setActiveTab]           = useState<'overview' | 'assessment'>('overview');
  const [rejectOpen, setRejectOpen]         = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>('q1');

  // ── Find candidate ──────────────────────────────────────────

  const candidate = PIPELINE_CANDIDATES.find((c) => c.id === id);

  // ── Error state ──────────────────────────────────────────────

  if (!candidate) {
    return (
      <div className={styles.page}>
        <div className={styles.errorWrap}>
          <div className={styles.errorCard}>
            <div className={styles.errorIconWrap}><IconAlertCircle size={28} /></div>
            <h2 className={styles.errorTitle}>This application could not be loaded</h2>
            <p className={styles.errorBody}>
              The application may have been removed or the link is incorrect.{' '}
              <button
                className={styles.errorLink}
                onClick={() => showToast({ message: 'AI Help coming in V1.', type: 'info' })}
              >
                Ask AI for help
              </button>
            </p>
            <Button variant="brand-ghost" size="sm" onClick={() => navigate(-1)}>
              <IconRefresh size={14} />
              Refresh page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Primary application & siblings ──────────────────────────

  const primaryApp =
    candidate.applications.find((a) => a.vacancyId === vacancyIdFromState) ??
    candidate.applications[0];

  const otherApps   = candidate.applications.filter((a) => a !== primaryApp);
  const isMultiRole = otherApps.length > 0;

  // ── Vacancy & assessment config ──────────────────────────────

  const vacancyDetail = VACANCY_DETAILS.find((vd) => vd.vacancyId === primaryApp.vacancyId);
  const assessTypes   = vacancyDetail?.assessmentTypes.filter((a) => a.enabled) ?? [];

  // ── Derived helpers ──────────────────────────────────────────

  const extra      = CANDIDATE_EXTRA[candidate.id] ?? { phone: '+62 812 0000 0000', location: 'Jakarta, Indonesia' };
  const statusCfg  = STATUS_CONFIG[primaryApp.status];
  const timeline   = buildTimeline(primaryApp);
  const ref        = buildRef(candidate.id);
  const appliedDate = daysAgoDate(8);
  const hasScore   = primaryApp.score !== null;

  const numericAssessCount = assessTypes.filter((a) => a.type !== 'personality').length;
  const totalAssessCount   = assessTypes.length;
  const oceanScores        = getOceanScores(candidate.id);

  // AI summary text
  const aiSummaryText = `${candidate.name} demonstrated strong communication skills and a clear, structured thinking process. Answers were well-articulated and showed genuine understanding of the role's requirements. Some responses on cross-functional collaboration could have been more specific, but overall the interview reflected a candidate with solid experience and good alignment.`;

  // Initials for Avatar
  const initials = candidate.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className={styles.page}>

      {/* ── Header bar ───────────────────────────────────────── */}
      <div className={styles.headerBar}>
        <div className={styles.headerLeft}>
          <button className={styles.backIconBtn} onClick={() => navigate(-1)} aria-label="Go back">
            <IconArrowLeft size={16} />
          </button>
          <span className={styles.headerTitle}>Application Detail</span>
        </div>
        <div className={styles.headerActions}>
          <Button variant="brand-ghost" size="sm" onClick={() => setRejectOpen(true)}>
            Reject
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => showToast({ message: 'Candidate advanced to next stage.', type: 'success' })}
          >
            Advance candidate
          </Button>
        </div>
      </div>

      {/* ── Scrollable content ────────────────────────────────── */}
      <div className={styles.scrollArea}>
        <div className={styles.inner}>

          {/* ── Hero row (open, no card) ─────────────────────── */}
          <div className={styles.heroRow}>
            <Avatar
              initials={initials}
              size="lg"
              color="brand"
              style={{ width: 80, height: 80, fontSize: 'var(--text-2xl)', flexShrink: 0 }}
            />
            <div className={styles.heroInfo}>
              <h1 className={styles.heroName}>{candidate.name}</h1>
              <div className={styles.heroContact}>
                <IconMail size={13} style={{ flexShrink: 0 }} />
                <span style={{ marginLeft: 4 }}>{candidate.email}</span>
                <span className={styles.heroDot}>•</span>
                <IconPhone size={13} style={{ flexShrink: 0 }} />
                <span style={{ marginLeft: 4 }}>{extra.phone}</span>
              </div>
              <div className={styles.heroChips}>
                <span className={styles.chip}>{STAGE_LABEL[primaryApp.stage]}</span>
                <span className={`${styles.chip} ${statusCfg.amber ? styles.chipAmber : ''}`}>
                  {statusCfg.label}
                </span>
                <span className={styles.chip}>Ref: {ref}</span>
                <span className={styles.chip}>Applied {appliedDate}</span>
              </div>
            </div>
          </div>

          {/* ── Multi-role banner ─────────────────────────────── */}
          {isMultiRole && (
            <div className={styles.multiRoleBanner}>
              <IconAlertTriangle size={15} className={styles.multiRoleIcon} />
              <p className={styles.multiRoleText}>
                This candidate also applied to{' '}
                {otherApps.map((oa, i) => (
                  <span key={oa.vacancyId}>
                    <strong>{oa.title}</strong>
                    {i < otherApps.length - 1 && ', '}
                  </span>
                ))}
                .{' '}
                <button
                  className={styles.multiRoleLink}
                  onClick={() => navigate(`/r/applications/${candidate.id}`, { state: { vacancyId: otherApps[0].vacancyId } })}
                >
                  View that application{' '}
                  <IconArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </button>
              </p>
            </div>
          )}

          {/* ── Tabs section ─────────────────────────────────── */}
          <div className={styles.tabsSection}>

            {/* Tab nav — underline only */}
            <div className={styles.tabsNav}>
              <button
                className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'assessment' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('assessment')}
              >
                Assessment
              </button>
            </div>

            {/* ══ Overview tab ════════════════════════════════ */}
            {activeTab === 'overview' && (
              <div className={styles.overviewContent}>

                {/* Candidate Information card */}
                <div className={styles.infoCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>Candidate Information</span>
                  </div>
                  <div className={styles.infoTable}>
                    <InfoRow label="Full name" value={candidate.name} />
                    <InfoRow label="Email"     value={candidate.email} isLink href={`mailto:${candidate.email}`} />
                    <InfoRow label="Phone"     value={extra.phone} />
                    <InfoRow label="Location"  value={extra.location} icon={<IconMapPin size={13} />} />
                    {extra.linkedin && (
                      <InfoRow label="LinkedIn" value={extra.linkedin} isLink href={`https://${extra.linkedin}`} icon={<IconBrandLinkedin size={13} />} />
                    )}
                    {extra.portfolio && (
                      <InfoRow label="Portfolio" value={extra.portfolio} isLink href={`https://${extra.portfolio}`} icon={<IconLink size={13} />} />
                    )}
                  </div>
                </div>

                {/* Two-column: Timeline + Snapshot */}
                <div className={styles.twoCol}>

                  {/* Application Timeline */}
                  <div className={styles.timelineCard}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardTitle}>Application timeline</span>
                    </div>
                    <ol className={styles.timeline}>
                      {timeline.map((evt, i) => (
                        <li key={evt.id} className={styles.timelineItem}>
                          <div className={styles.timelineDotCol}>
                            <span className={styles.timelineDot} />
                            {i < timeline.length - 1 && <span className={styles.timelineConnector} />}
                          </div>
                          <div className={styles.timelineBody}>
                            <span className={styles.timelineLabel}>{evt.label}</span>
                            {evt.note && <span className={styles.timelineNote}>{evt.note}</span>}
                            <span className={styles.timelineMeta}>{evt.date} • by {evt.by}</span>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Assessment Snapshot */}
                  <div className={styles.snapshotCard}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardTitle}>Assessment snapshot</span>
                    </div>
                    {assessTypes.length === 0 ? (
                      <p className={styles.snapshotEmpty}>
                        {vacancyDetail ? 'No assessments configured for this vacancy.' : 'Assessment configuration not available.'}
                      </p>
                    ) : (
                      <div className={styles.snapshotList}>
                        {assessTypes.map((at) => {
                          const cfg = getAssessCfg(at.type);
                          const AssessIcon = cfg.Icon;
                          const isPersonality = at.type === 'personality';
                          const statusText = hasScore ? (isPersonality ? 'Profile complete' : 'Completed') : 'Not started';
                          return (
                            <div key={at.type} className={styles.snapshotItem}>
                              <div className={styles.snapshotItemLeft}>
                                <div className={styles.snapshotIconWrap} style={{ background: cfg.bg, color: cfg.color }}>
                                  <AssessIcon size={14} />
                                </div>
                                <div className={styles.snapshotItemMeta}>
                                  <span className={styles.snapshotItemName}>{at.label}</span>
                                  <span className={styles.snapshotItemStatus}>{statusText}</span>
                                </div>
                              </div>
                              {hasScore ? (
                                isPersonality ? (
                                  <span className={styles.snapshotPersonality}>{getOceanText(candidate.id)}</span>
                                ) : (
                                  <span className={styles.snapshotScore}>{getAssessmentScore(at.type, primaryApp.score!)}%</span>
                                )
                              ) : (
                                <span className={styles.snapshotScoreEmpty}>Not started</span>
                              )}
                            </div>
                          );
                        })}
                        {hasScore && numericAssessCount > 0 && (
                          <div className={styles.snapshotOverall}>
                            <div className={styles.snapshotOverallLeft}>
                              <span className={styles.snapshotOverallLabel}>Overall score</span>
                              <span className={styles.snapshotOverallSub}>
                                Based on {numericAssessCount} of {totalAssessCount} assessment{totalAssessCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <span className={styles.snapshotOverallValue}>{primaryApp.score}%</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* ══ Assessment tab ══════════════════════════════ */}
            {activeTab === 'assessment' && (
              <div className={styles.assessmentContent}>

                {assessTypes.length === 0 ? (
                  <Callout variant="warning" icon={<IconAlertTriangle size={16} />}>
                    No assessments have been assigned to this candidate yet.
                  </Callout>
                ) : (
                  <>
                    {!hasScore && (
                      <Callout variant="warning" icon={<IconAlertTriangle size={16} />}>
                        Assessments have been assigned but the candidate has not yet submitted their results.
                      </Callout>
                    )}

                    {assessTypes.map((at) => {
                      const isPersonality = at.type === 'personality';
                      const isInterview   = at.type === 'ai-interview';
                      const assessScore   = hasScore ? getAssessmentScore(at.type, primaryApp.score!) : null;
                      const aboveThreshold = assessScore !== null && assessScore >= THRESHOLD;
                      const categories    = (hasScore && !isPersonality) ? getBreakdownCategories(at.type, assessScore!) : [];

                      // Submitted date per type
                      const submittedLabel = isInterview
                        ? `Completed ${daysAgoDate(5)}`
                        : `Submitted ${daysAgoDate(isPersonality ? 4 : 6)}`;

                      return (
                        <div key={at.type} className={styles.assessCard}>

                          {/* Card header */}
                          <div className={styles.assessCardHeader}>
                            <span className={styles.assessCardTitle}>{at.label}</span>
                            <span className={styles.assessCardDate}>
                              {hasScore ? submittedLabel : 'Not started'}
                            </span>
                          </div>

                          {/* Card body */}
                          <div className={styles.assessCardBody}>

                            {!hasScore ? (
                              <p className={styles.assessNote}>
                                This assessment has not been started by the candidate yet.
                              </p>

                            ) : isPersonality ? (
                              /* ── Personality: OCEAN slider display ── */
                              <>
                                <p className={styles.assessOceanSection}>Big Five (OCEAN)</p>
                                <div className={styles.assessOceanRows}>
                                  {OCEAN_TRAITS.map(({ key, label }) => {
                                    const pos = oceanScores[key] ?? 50; // 0–100 → % position
                                    return (
                                      <div key={key} className={styles.assessOceanRow}>
                                        <span className={styles.assessOceanLabel}>{label}</span>
                                        <span className={styles.assessOceanScaleLabel}>Low</span>
                                        <div className={styles.assessOceanTrack}>
                                          <div
                                            className={styles.assessOceanFill}
                                            style={{ width: `${pos}%` }}
                                          />
                                          <div
                                            className={styles.assessOceanDot}
                                            style={{ left: `${pos}%` }}
                                          />
                                        </div>
                                        <span className={styles.assessOceanScaleLabel}>High</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </>

                            ) : (
                              /* ── Numeric: score + threshold + bars (+ Q&A for interview) ── */
                              <>
                                {/* Score row */}
                                <div className={styles.assessScoreRow}>
                                  <span className={styles.assessBigScore}>{assessScore}%</span>
                                  {isInterview ? (
                                    <span className={styles.assessAiBadge}>AI-generated summary</span>
                                  ) : (
                                    <span className={aboveThreshold ? styles.assessStatusBadge : styles.assessStatusBadgeFail}>
                                      {aboveThreshold ? 'Above threshold' : 'Below threshold'}
                                    </span>
                                  )}
                                </div>

                                {/* AI summary paragraph */}
                                {isInterview && (
                                  <p className={styles.assessAiSummary}>{aiSummaryText}</p>
                                )}

                                {/* Threshold text (not for AI interview) */}
                                {!isInterview && (
                                  <p className={styles.assessThresholdText}>
                                    Passing threshold: {THRESHOLD}% — set by recruiter
                                  </p>
                                )}

                                {/* Breakdown section */}
                                <p className={styles.assessSectionLabel}>
                                  {isInterview ? 'Breakdown by question' : 'Breakdown by category'}
                                </p>

                                {/* Progress bars */}
                                <div className={styles.assessBarRows}>
                                  {categories.map((cat) => {
                                    const pass = cat.value >= THRESHOLD;
                                    return (
                                      <div key={cat.label} className={styles.assessBarRow}>
                                        <span className={styles.assessBarLabel}>{cat.label}</span>
                                        <div className={styles.assessBarTrack}>
                                          <div
                                            className={styles.assessBarFill}
                                            style={{
                                              width: `${cat.value}%`,
                                              background: pass ? 'var(--brand)' : 'var(--dot-warning)',
                                            }}
                                          />
                                          {/* Threshold marker line */}
                                          <div
                                            className={styles.assessBarMarker}
                                            style={{ left: `${THRESHOLD}%` }}
                                          />
                                        </div>
                                        <span className={pass ? styles.assessBarVal : styles.assessBarValAmber}>
                                          {cat.value}%
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Q&A accordion — AI Interview only */}
                                {isInterview && (
                                  <div className={styles.assessQList}>
                                    {AI_INTERVIEW_QUESTIONS.map((q, qi) => {
                                      const isExpanded = expandedQuestion === q.id;
                                      return (
                                        <div key={q.id} className={styles.assessQItem}>
                                          <button
                                            className={styles.assessQBtn}
                                            onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                                          >
                                            <span className={styles.assessQBtnText}>
                                              Q{qi + 1} {q.text}
                                            </span>
                                            {isExpanded
                                              ? <IconChevronUp size={16} className={styles.assessQChevron} />
                                              : <IconChevronDown size={16} className={styles.assessQChevron} />
                                            }
                                          </button>

                                          {isExpanded && (
                                            <div className={styles.assessQBody}>
                                              {/* Sub-scores grid */}
                                              <div className={styles.assessQSubScores}>
                                                {[
                                                  { label: 'Clarity',   value: q.clarity   },
                                                  { label: 'Relevance', value: q.relevance  },
                                                  { label: 'Depth',     value: q.depth      },
                                                ].map((sub) => (
                                                  <div key={sub.label} className={styles.assessQSubScore}>
                                                    <span className={styles.assessQSubVal}>{sub.value}%</span>
                                                    <span className={styles.assessQSubLabel}>{sub.label}</span>
                                                    <div className={styles.assessQSubBarTrack}>
                                                      <div
                                                        className={styles.assessQSubBarFill}
                                                        style={{ width: `${sub.value}%` }}
                                                      />
                                                    </div>
                                                  </div>
                                                ))}
                                                <div className={styles.assessQTotal}>
                                                  <span className={styles.assessQTotalVal}>{q.totalScore}%</span>
                                                  <span className={styles.assessQTotalLabel}>Total score</span>
                                                </div>
                                              </div>

                                              {/* Transcript */}
                                              <p className={styles.assessTranscriptHeader}>Transcript</p>
                                              <p className={styles.assessTranscript}>{q.transcript}</p>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}

          </div>{/* .tabsSection */}

        </div>{/* .inner */}
      </div>{/* .scrollArea */}

      {/* ── AI chat FAB ──────────────────────────────────────── */}
      <button
        className={styles.aiFab}
        aria-label="Open AI chat"
        onClick={() => showToast({ message: 'AI chat coming in V1.', type: 'info' })}
      >
        <IconMessageCircle size={22} />
      </button>

      {/* ── Reject dialog ─────────────────────────────────────── */}
      <Dialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reject candidate"
        description={`Rejecting ${candidate.name} will close this application and send an automated notification.`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger-ghost"
              size="sm"
              onClick={() => {
                setRejectOpen(false);
                showToast({ message: 'Candidate rejected.', type: 'success' });
              }}
            >
              Reject candidate
            </Button>
          </>
        }
      >
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
          This action cannot be undone. The candidate will receive an email explaining that their
          application was unsuccessful.
        </p>
      </Dialog>

    </div>
  );
}
