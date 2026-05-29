import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  IconSearch,
  IconSortDescending,
  IconArrowRight,
  IconX,
  IconRefresh,
  IconInbox,
  IconChecks,
  IconCircleCheck,
  IconCircleCheckFilled,
  IconCircleX,
  IconCircle,
  IconFileDescription,
  IconClipboardList,
  IconEye,
  IconMicrophone2,
  IconHourglass,
  IconStar,
  IconNotes,
} from '@tabler/icons-react';
import { useApplications } from '../../store/useStore';
import { JOBS } from '../../data/mockData';
import { useToast } from '../../store/useToast';
import type { CandidateStage, Application } from '../../store/types';
import styles from './ApplicationsScreen.module.css';

// ── Helpers ────────────────────────────────────────────────────────────────

function formatExpectedDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatRelativeDate(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    if (diffHours === 0) return 'just now';
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
  return formatExpectedDate(iso);
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function appRef(id: string): string {
  const seed = parseInt(id.replace(/\D/g, '') || '1', 10);
  const num = (seed * 10007 + 90000) % 100000;
  return `#CLA-${String(num).padStart(5, '0')}`;
}

// ── Stage config ───────────────────────────────────────────────────────────

type StripColor   = 'neutral' | 'teal' | 'teal2' | 'amber' | 'orange' | 'green' | 'violet' | 'blue';
type BadgeVariant = 'neutral' | 'teal' | 'teal2' | 'amber' | 'orange' | 'green' | 'violet' | 'blue';

interface StageConfig {
  label: string;
  badge: BadgeVariant;
  strip: StripColor;
  BadgeIcon: React.ComponentType<{ size?: number }>;
  timelineStep: number;         // 0–5, which dot is "current"
  timelineCurrent: 'teal' | 'teal2' | 'amber' | 'violet' | 'blue';
  description: string;
  dateMode: 'applied' | 'expected' | 'decision' | 'saved';
}

const STAGE_CONFIG: Record<CandidateStage, StageConfig> = {
  draft: {
    label: 'Draft',
    badge: 'neutral',
    strip: 'neutral',
    BadgeIcon: IconNotes,
    timelineStep: 0,
    timelineCurrent: 'teal',
    description: "You haven't submitted this application yet. Your progress is saved so you can pick up where you left off.",
    dateMode: 'saved',
  },
  applied: {
    label: 'Application Received',
    badge: 'blue',
    strip: 'blue',
    BadgeIcon: IconInbox,
    timelineStep: 0,
    timelineCurrent: 'blue',
    description: 'Your application has been received and is in our queue. We will notify you once our team begins their review.',
    dateMode: 'applied',
  },
  'in-review': {
    label: 'Under Review',
    badge: 'teal',
    strip: 'teal',
    BadgeIcon: IconEye,
    timelineStep: 1,
    timelineCurrent: 'teal',
    description: 'Our team is currently reviewing your application. We will reach out once a decision has been made.',
    dateMode: 'expected',
  },
  assessment: {
    label: 'Action Required',
    badge: 'amber',
    strip: 'amber',
    BadgeIcon: IconClipboardList,
    timelineStep: 2,
    timelineCurrent: 'amber',
    description: 'Please complete your cognitive and personality assessment to move forward. Your application cannot proceed until this step is done.',
    dateMode: 'expected',
  },
  'assessment-complete': {
    label: 'Assessment Submitted',
    badge: 'teal2',
    strip: 'teal2',
    BadgeIcon: IconCircleCheck,
    timelineStep: 2,
    timelineCurrent: 'teal2',
    description: 'Your assessment has been submitted successfully. Your insight report will be available once the assessment window closes.',
    dateMode: 'expected',
  },
  interview: {
    label: 'Interview Confirmed',
    badge: 'violet',
    strip: 'violet',
    BadgeIcon: IconMicrophone2,
    timelineStep: 3,
    timelineCurrent: 'violet',
    description: 'Your AI interview is scheduled. Check your confirmation email for the date and time. Our team will evaluate your responses within 3 days of completion.',
    dateMode: 'expected',
  },
  decision: {
    label: 'Final Review in Progress',
    badge: 'orange',
    strip: 'orange',
    BadgeIcon: IconHourglass,
    timelineStep: 4,
    timelineCurrent: 'amber',
    description: 'Your interview has been completed and our team is now in the final stages of their review. We will notify you as soon as a decision has been reached.',
    dateMode: 'expected',
  },
  accepted: {
    label: 'Offer Extended',
    badge: 'green',
    strip: 'green',
    BadgeIcon: IconStar,
    timelineStep: 5,
    timelineCurrent: 'teal',
    description: 'We are excited to move forward with you for this role. Please review your offer details and confirm your acceptance before the deadline.',
    dateMode: 'expected',
  },
  rejected: {
    label: 'Application Closed',
    badge: 'neutral',
    strip: 'neutral',
    BadgeIcon: IconFileDescription,
    timelineStep: 5,
    timelineCurrent: 'teal',
    description: 'We have completed our review for this role. Your insight report is now available, containing working style and growth observations from your assessment. It is yours to keep.',
    dateMode: 'decision',
  },
};

// ── Filter chips ───────────────────────────────────────────────────────────

type FilterKey = 'all' | 'action' | 'active' | 'drafts' | 'closed';

const FILTER_CHIPS: { key: FilterKey; label: string }[] = [
  { key: 'all',    label: 'All' },
  { key: 'action', label: 'Action required' },
  { key: 'active', label: 'Active' },
  { key: 'drafts', label: 'Drafts' },
  { key: 'closed', label: 'Closed' },
];

const ACTION_STAGES: CandidateStage[] = ['assessment'];
const ACTIVE_STAGES: CandidateStage[] = ['applied', 'in-review', 'assessment-complete', 'interview', 'decision'];
const CLOSED_STAGES: CandidateStage[] = ['accepted', 'rejected'];

function applyFilter(apps: Application[], filter: FilterKey): Application[] {
  switch (filter) {
    case 'all':    return apps;
    case 'action': return apps.filter((a) => ACTION_STAGES.includes(a.stage));
    case 'active': return apps.filter((a) => ACTIVE_STAGES.includes(a.stage));
    case 'drafts': return apps.filter((a) => a.stage === 'draft');
    case 'closed': return apps.filter((a) => CLOSED_STAGES.includes(a.stage));
  }
}

// ── Timeline ───────────────────────────────────────────────────────────────

const TL_LABELS = ['Applied', 'Under review', 'Assessment', 'Interview', 'Final Review', 'Decision'];

function Timeline({ stage }: { stage: CandidateStage }) {
  const { timelineStep, timelineCurrent } = STAGE_CONFIG[stage];
  const allDone   = stage === 'accepted' || stage === 'rejected';
  const doneColor = stage === 'accepted' ? '#018a6e' : '#1c2024';

  return (
    <div className={styles.timeline}>
      {TL_LABELS.map((_label, i) => {
        const isRejectedLast = stage === 'rejected' && i === TL_LABELS.length - 1;
        const isDone    = isRejectedLast ? false : (allDone || i < timelineStep);
        const isCurrent = !allDone && i === timelineStep;

        return (
          <div key={i} className={styles.tlStep}>
            {i > 0 && <div className={styles.tlLine} />}
            <div className={styles.tlDotWrap}>
              {isRejectedLast ? (
                <IconCircleX size={20} color="rgba(0,0,47,0.35)" strokeWidth={1.5} />
              ) : isDone ? (
                <IconCircleCheckFilled size={20} color={doneColor} />
              ) : isCurrent ? (
                <div className={`${styles.tlDotCircle} ${
                  timelineCurrent === 'amber'  ? styles.tlDotAmber  :
                  timelineCurrent === 'violet' ? styles.tlDotViolet :
                  timelineCurrent === 'blue'   ? styles.tlDotBlue   :
                  timelineCurrent === 'teal2'  ? styles.tlDotTeal2  :
                  styles.tlDotTeal
                }`} />
              ) : (
                <IconCircle size={20} color="rgba(0,0,47,0.2)" strokeWidth={1.5} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Application card ───────────────────────────────────────────────────────

function ApplicationCard({ application }: { application: Application }) {
  const job = JOBS.find((j) => j.id === application.jobId);
  const navigate = useNavigate();
  if (!job) return null;

  const config = STAGE_CONFIG[application.stage];
  const { BadgeIcon } = config;

  const STRIP_MAP: Record<StripColor, string> = {
    neutral: styles.stripNeutral,
    teal:    styles.stripTeal,
    teal2:   styles.stripTeal2,
    amber:   styles.stripAmber,
    orange:  styles.stripOrange,
    green:   styles.stripGreen,
    violet:  styles.stripViolet,
    blue:    styles.stripBlue,
  };
  const BADGE_MAP: Record<BadgeVariant, string> = {
    neutral: styles.badgeNeutral,
    teal:    styles.badgeTeal,
    teal2:   styles.badgeTeal2,
    amber:   styles.badgeAmber,
    orange:  styles.badgeOrange,
    green:   styles.badgeGreen,
    violet:  styles.badgeViolet,
    blue:    styles.badgeBlue,
  };
  const stripClass = STRIP_MAP[config.strip];
  const badgeClass = BADGE_MAP[config.badge];

  const dateText =
    config.dateMode === 'applied'   ? `Applied ${formatRelativeDate(application.appliedAt)}`        :
    config.dateMode === 'saved'     ? `Saved ${formatRelativeDate(application.appliedAt)}`           :
    config.dateMode === 'decision'  ? `Decision: ${formatExpectedDate(application.expectedDecisionDate)}` :
    /* expected */                    `Expected by ${formatExpectedDate(application.expectedDecisionDate)}`;

  const showViewJobDetail =
    application.stage !== 'accepted' && application.stage !== 'rejected';

  return (
    <div className={styles.card}>
      <div className={`${styles.cardStrip} ${stripClass}`} />
      <div className={styles.cardContent}>

        {/* Badge + title (left) / date + ref (right) */}
        <div className={styles.infoContainer}>
          <div className={styles.infoLeft}>
            <span className={`${styles.badge} ${badgeClass}`}>
              <BadgeIcon size={14} />
              {config.label}
            </span>
            <div className={styles.cardTitleGroup}>
              <p className={styles.cardJobTitle}>{job.title}</p>
              <p className={styles.cardJobSub}>
                {job.company} • {job.location} ({job.workMode.toLowerCase()})
              </p>
            </div>
          </div>
          <div className={styles.cardMeta}>
            <span className={styles.cardMetaText}>{dateText}</span>
            <span className={styles.cardMetaText}>{appRef(application.id)}</span>
          </div>
        </div>

        {/* Description */}
        <p className={styles.cardDesc}>{config.description}</p>

        {/* Draft: application form progress bar */}
        {application.stage === 'draft' && (
          <div className={styles.progressArea}>
            <div className={styles.progressInfo}>
              <span className={styles.progressPct}>
                Application Progress: {application.assessmentProgress}%
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${application.assessmentProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Timeline — shown for all stages except draft */}
        {application.stage !== 'draft' && <Timeline stage={application.stage} />}

        {/* Action buttons — always at the bottom via margin-top: auto */}
        <div className={styles.cardActions}>

          {/* Draft: continue application */}
          {application.stage === 'draft' && (
            <button
              className={styles.btnGhost}
              onClick={() => navigate(`/jobs/${job.id}/apply`)}
            >
              Continue Application
              <IconArrowRight size={14} />
            </button>
          )}

          {/* Assessment: primary amber CTA */}
          {application.stage === 'assessment' && (
            <button
              className={styles.btnAmber}
              onClick={() => navigate(`/applications/${application.id}/assessment`)}
            >
              Complete Your Assessment
              <IconArrowRight size={14} />
            </button>
          )}

          {/* Assessment complete: disabled insight report availability notice */}
          {application.stage === 'assessment-complete' && (
            <div className={styles.btnGhostDisabled}>
              Insight Report Available on {formatShortDate(application.expectedDecisionDate)}
            </div>
          )}

          {/* Interview: go to interview landing */}
          {application.stage === 'interview' && (
            <button
              className={styles.btnGhostViolet}
              onClick={() => navigate(`/applications/${application.id}/interview`)}
            >
              Complete AI Interview
              <IconArrowRight size={14} />
            </button>
          )}

          {/* Final review: ask AI (orange) */}
          {application.stage === 'decision' && (
            <button
              className={styles.btnGhostOrange}
              onClick={() => navigate('/conversations')}
            >
              Ask AI About Your Situation
            </button>
          )}

          {/* Offer extended: success green CTA → goes directly to offer page */}
          {application.stage === 'accepted' && (
            <button
              className={styles.btnGreen}
              onClick={() => navigate(`/applications/${application.id}/offer`)}
            >
              View Your Offer
              <IconArrowRight size={14} />
            </button>
          )}

          {/* Accepted + insight report: secondary ghost → goes directly to insight page */}
          {application.stage === 'accepted' && application.hasInsightReport && (
            <button
              className={styles.btnGhost}
              onClick={() => navigate(`/applications/${application.id}/insight`)}
            >
              View Insight Report
            </button>
          )}

          {/* Rejected: view results → insight if unlocked, otherwise closure summary */}
          {application.stage === 'rejected' && (
            <button
              className={styles.btnGhostTeal}
              onClick={() =>
                navigate(
                  application.insightUnlocked
                    ? `/applications/${application.id}/insight`
                    : `/applications/${application.id}/closed`,
                )
              }
            >
              View your results
              <IconArrowRight size={14} />
            </button>
          )}

          {/* "View job detail" — all non-terminal stages */}
          {showViewJobDetail && (
            <button
              className={styles.btnGhost}
              onClick={() => navigate(`/applications/job/${job.id}`)}
            >
              View job detail
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Filter bar ─────────────────────────────────────────────────────────────

function FilterBar({
  activeFilter,
  counts,
  searchQuery,
  onFilterChange,
  onSearch,
  onSort,
}: {
  activeFilter: FilterKey;
  counts: Record<FilterKey, number>;
  searchQuery: string;
  onFilterChange: (f: FilterKey) => void;
  onSearch: (q: string) => void;
  onSort: () => void;
}) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>
          <IconSearch size={14} />
        </span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by role, company..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className={styles.chips}>
        {FILTER_CHIPS.map(({ key, label }) => (
          <button
            key={key}
            className={`${styles.chip} ${activeFilter === key ? styles.chipActive : ''}`}
            onClick={() => onFilterChange(key)}
          >
            {label}
            {key !== 'all' && counts[key] > 0 && (
              <span className={styles.chipCount}>{counts[key]}</span>
            )}
          </button>
        ))}
      </div>

      <button className={styles.sortBtn} onClick={onSort}>
        <IconSortDescending size={14} />
        Relevance
      </button>
    </div>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────

export default function ApplicationsScreen() {
  const applications = useApplications();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') ?? '');

  const stateOverride = searchParams.get('state');

  const counts: Record<FilterKey, number> = {
    all:    applications.length,
    action: applications.filter((a) => ACTION_STAGES.includes(a.stage)).length,
    active: applications.filter((a) => ACTIVE_STAGES.includes(a.stage)).length,
    drafts: applications.filter((a) => a.stage === 'draft').length,
    closed: applications.filter((a) => CLOSED_STAGES.includes(a.stage)).length,
  };

  const filterBarProps = {
    activeFilter,
    counts,
    searchQuery,
    onFilterChange: setActiveFilter,
    onSearch: setSearchQuery,
    onSort: () => showToast({ message: 'Sort — coming in V1.' }),
  };

  const pageHeader = (
    <div className={styles.header}>
      <h1 className={styles.heading}>Applications</h1>
      <p className={styles.subtitle}>Track your real-time hiring progress and stay updated on every step.</p>
    </div>
  );

  // ── Error ────────────────────────────────────────────────────────────────
  if (stateOverride === 'error') {
    return (
      <div className={styles.page}>
        <div className={styles.body}>
          {pageHeader}
          <FilterBar {...filterBarProps} />
          <div className={styles.stateCenter}>
            <div className={styles.stateCard}>
              <div className={`${styles.stateIconWrap} ${styles.iconError}`}>
                <IconX size={28} strokeWidth={2.5} />
              </div>
              <div className={styles.stateTextGroup}>
                <p className={styles.stateTitle}>Could not load your applications.</p>
                <p className={styles.stateBody}>
                  There may be a temporary issue with our service.
                  Try refreshing the page. If the problem continues,{' '}
                  <span
                    className={styles.stateLink}
                    role="button"
                    onClick={() => showToast({ message: 'AI Chat — coming in V1.' })}
                  >
                    ask AI for help.
                  </span>
                </p>
              </div>
              <div className={styles.stateActions}>
                <button className={styles.stateGhostBtn} onClick={() => window.location.reload()}>
                  <IconRefresh size={16} />
                  Refresh page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty (no applications) ───────────────────────────────────────────────
  if (stateOverride === 'empty' || applications.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.body}>
          {pageHeader}
          <FilterBar {...filterBarProps} />
          <div className={styles.stateCenter}>
            <div className={styles.stateCard}>
              <div className={`${styles.stateIconWrap} ${styles.iconTeal}`}>
                <IconInbox size={28} />
              </div>
              <div className={styles.stateTextGroup}>
                <p className={styles.stateTitle}>You have not applied to any roles yet.</p>
                <p className={styles.stateBody}>
                  Browse open positions to get started. Every role shows you the full hiring process before you apply.
                </p>
              </div>
              <div className={styles.stateActions}>
                <button className={styles.statePrimaryBtn} onClick={() => navigate('/jobs')}>
                  Browse Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Compute filtered list ─────────────────────────────────────────────────
  const searchFiltered = searchQuery.trim()
    ? applications.filter((a) => {
        const job = JOBS.find((j) => j.id === a.jobId);
        if (!job) return false;
        const q = searchQuery.toLowerCase();
        return job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q);
      })
    : applications;

  // For override states we force a filter + empty result
  const effectiveFilter: FilterKey =
    stateOverride === 'action-empty' ? 'action' :
    stateOverride === 'filter-empty' ? 'active' :
    activeFilter;

  const visibleApps =
    (stateOverride === 'action-empty' || stateOverride === 'filter-empty')
      ? []
      : applyFilter(searchFiltered, activeFilter);

  // ── Action-required empty ─────────────────────────────────────────────────
  if (effectiveFilter === 'action' && visibleApps.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.body}>
          {pageHeader}
          <FilterBar {...filterBarProps} activeFilter={effectiveFilter} />
          <div className={styles.stateCenter}>
            <div className={styles.stateCard}>
              <div className={`${styles.stateIconWrap} ${styles.iconTeal}`}>
                <IconCircleCheck size={28} />
              </div>
              <div className={styles.stateTextGroup}>
                <p className={styles.stateTitle}>You're all caught up.</p>
                <p className={styles.stateBody}>No applications need your attention right now.</p>
              </div>
              <div className={styles.stateActions}>
                <button className={styles.stateGhostBtn} onClick={() => setActiveFilter('all')}>
                  View All History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Active / drafts empty ─────────────────────────────────────────────────
  if ((effectiveFilter === 'active' || effectiveFilter === 'drafts') && visibleApps.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.body}>
          {pageHeader}
          <FilterBar {...filterBarProps} activeFilter={effectiveFilter} />
          <div className={styles.stateCenter}>
            <div className={styles.stateCard}>
              <div className={`${styles.stateIconWrap} ${styles.iconTeal}`}>
                <IconChecks size={28} />
              </div>
              <div className={styles.stateTextGroup}>
                <p className={styles.stateTitle}>You have no active applications.</p>
                <p className={styles.stateBody}>
                  Switch to All to see your full history, or browse new roles to apply again.
                </p>
              </div>
              <div className={styles.stateActions}>
                <button className={styles.stateGhostBtn} onClick={() => setActiveFilter('all')}>
                  View All History
                </button>
                <button className={styles.statePrimaryBtn} onClick={() => navigate('/jobs')}>
                  Browse Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Default list ──────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.body}>
        {pageHeader}
        <FilterBar {...filterBarProps} />
        <div className={styles.cardGrid}>
          {visibleApps.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      </div>
    </div>
  );
}
