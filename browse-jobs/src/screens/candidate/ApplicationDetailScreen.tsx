import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  IconArrowLeft,
  IconAlertCircle,
  IconInbox,
  IconEye,
  IconClipboard,
  IconCircleCheck,
  IconCalendarEvent,
  IconClock,
  IconStar,
  IconX,
  IconLock,
  IconSparkles,
  IconBrain,
  IconMoodSmile,
  IconCode,
  IconMicrophone2,
} from '@tabler/icons-react';
import { useStore } from '../../store/useStore';
import { JOBS } from '../../data/mockData';
import { useToast } from '../../store/useToast';
import { Avatar, Text, Button, Badge, Progress, Callout } from '../../components/ds';
import type { CandidateStage, Application, AssessmentType } from '../../store/types';
import styles from './ApplicationDetailScreen.module.css';

// ── Types ──────────────────────────────────────────────────────────────────

type BadgeVariant = 'active' | 'draft' | 'inactive' | 'urgent' | 'resolved' | 'passive' | 'error' | 'brand';

// ── Stage config ───────────────────────────────────────────────────────────

interface StageConfig {
  label: string;
  badgeVariant: BadgeVariant;
  colorVar: string;
  Icon: React.ElementType;
}

const STAGE_CONFIG: Record<CandidateStage, StageConfig> = {
  draft: {
    label: 'Draft',
    badgeVariant: 'passive',
    colorVar: 'var(--text-disabled)',
    Icon: IconInbox,
  },
  applied: {
    label: 'Application Received',
    badgeVariant: 'active',
    colorVar: 'var(--stage-applied-color)',
    Icon: IconInbox,
  },
  'in-review': {
    label: 'Under Review',
    badgeVariant: 'passive',
    colorVar: 'var(--stage-in-review-color)',
    Icon: IconEye,
  },
  assessment: {
    label: 'Action Required',
    badgeVariant: 'urgent',
    colorVar: 'var(--stage-assessment-color)',
    Icon: IconClipboard,
  },
  'assessment-complete': {
    label: 'Assessment Submitted',
    badgeVariant: 'resolved',
    colorVar: 'var(--stage-assessment-done-color)',
    Icon: IconCircleCheck,
  },
  interview: {
    label: 'Interview Confirmed',
    badgeVariant: 'brand',
    colorVar: 'var(--stage-interview-color)',
    Icon: IconCalendarEvent,
  },
  decision: {
    label: 'Final Review in Progress',
    badgeVariant: 'passive',
    colorVar: 'var(--stage-decision-color)',
    Icon: IconClock,
  },
  accepted: {
    label: 'Offer Extended',
    badgeVariant: 'resolved',
    colorVar: 'var(--stage-accepted-color)',
    Icon: IconStar,
  },
  rejected: {
    label: 'Application Closed',
    badgeVariant: 'passive',
    colorVar: 'var(--stage-rejected-color)',
    Icon: IconX,
  },
};

// ── Ordered stage timeline (without the accepted/rejected fork) ────────────

const TIMELINE_STAGES: CandidateStage[] = [
  'applied',
  'in-review',
  'assessment',
  'assessment-complete',
  'interview',
  'decision',
  'accepted',
];

// Stage index for ordering (used to determine done / current / future)
const STAGE_ORDER: Record<CandidateStage, number> = {
  draft: -1,
  applied: 0,
  'in-review': 1,
  assessment: 2,
  'assessment-complete': 3,
  interview: 4,
  decision: 5,
  accepted: 6,
  rejected: 6,
};

function getTimelineState(timelineStage: CandidateStage, currentStage: CandidateStage): 'done' | 'current' | 'future' {
  const currentOrder = STAGE_ORDER[currentStage];
  const itemOrder = STAGE_ORDER[timelineStage];

  if (currentStage === 'rejected') {
    // For rejected, all stages up to decision are done; rejected is current
    if (timelineStage === 'rejected') return 'current';
    if (timelineStage === 'accepted') return 'future';
    if (itemOrder <= STAGE_ORDER['decision']) return 'done';
    return 'future';
  }

  if (itemOrder < currentOrder) return 'done';
  if (itemOrder === currentOrder) return 'current';
  return 'future';
}

// ── Assessment icon map ────────────────────────────────────────────────────

const ASSESSMENT_ICON: Record<AssessmentType, React.ElementType> = {
  cognitive: IconBrain,
  personality: IconMoodSmile,
  technical: IconCode,
  interview: IconMicrophone2,
};

const ASSESSMENT_COLORS: Record<AssessmentType, { bg: string; color: string }> = {
  cognitive: { bg: 'var(--assessment-cognitive-bg)', color: 'var(--assessment-cognitive-icon)' },
  personality: { bg: 'var(--assessment-personality-bg)', color: 'var(--assessment-personality-icon)' },
  technical: { bg: 'var(--assessment-technical-bg)', color: 'var(--assessment-technical-icon)' },
  interview: { bg: 'var(--assessment-interview-bg)', color: 'var(--assessment-interview-icon)' },
};

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatRelativeDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatShortDate(iso);
}

// ── Stage timeline component ───────────────────────────────────────────────

function StageTimeline({ currentStage }: { currentStage: CandidateStage }) {
  const stagesForTimeline: CandidateStage[] =
    currentStage === 'rejected'
      ? ['applied', 'in-review', 'assessment', 'assessment-complete', 'interview', 'decision', 'rejected']
      : TIMELINE_STAGES;

  return (
    <div className={styles.timeline}>
      <p className={styles.sectionTitle}>Application Progress</p>
      <ol className={styles.timelineList}>
        {stagesForTimeline.map((stage) => {
          const state = getTimelineState(stage, currentStage);
          const cfg = STAGE_CONFIG[stage];
          const StageIcon = cfg.Icon;

          return (
            <li
              key={stage}
              className={`${styles.timelineItem} ${styles[state]}`}
            >
              <div className={styles.timelineDotWrap}>
                <span className={`${styles.timelineDot} ${styles[state]}`} />
              </div>
              <div className={styles.timelineContent}>
                <span className={`${styles.timelineLabel} ${styles[state]}`}>
                  <StageIcon
                    size={14}
                    style={{
                      display: 'inline',
                      verticalAlign: 'middle',
                      marginRight: 6,
                      color: state !== 'future' ? cfg.colorVar : 'var(--text-disabled)',
                    }}
                  />
                  {cfg.label}
                </span>
                {state === 'current' && (
                  <span className={styles.timelineSub}>Current stage</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ── Stage-specific action cards ────────────────────────────────────────────

function AssessmentActionCard({ application }: { application: Application }) {
  const completed = application.assessments.filter((a) => a.completed).length;
  const total = application.assessments.length;

  return (
    <div className={`${styles.actionCard} ${styles.actionCardUrgent}`}>
      <div className={styles.actionCardInner}>
        <p className={styles.actionCardTitle}>Complete your assessment</p>
        <p className={styles.actionCardBody}>
          You have {completed} of {total} assessments completed. Complete the remaining{' '}
          {total - completed} to progress your application.
        </p>

        <Progress
          value={application.assessmentProgress}
          label={`${completed} / ${total} completed`}
          showValue
          color="brand"
        />

        <div className={styles.assessmentList}>
          {application.assessments.map((a) => {
            const AssessIcon = ASSESSMENT_ICON[a.type];
            const colors = ASSESSMENT_COLORS[a.type];
            return (
              <div
                key={a.id}
                className={`${styles.assessmentRow} ${a.completed ? styles.assessmentRowDone : ''}`}
              >
                <div
                  className={styles.assessmentIconWrap}
                  style={{ background: colors.bg, color: colors.color }}
                >
                  <AssessIcon size={16} />
                </div>
                <div className={styles.assessmentInfo}>
                  <div className={styles.assessmentName}>{a.label}</div>
                  <div className={styles.assessmentMeta}>{a.duration} min</div>
                </div>
                {a.completed ? (
                  <IconCircleCheck size={18} className={styles.assessmentCheck} />
                ) : (
                  <Text size="xs" color="tertiary">Pending</Text>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.actionCardActions}>
          <Button
            variant="primary"
            onClick={() => { window.location.href = `/applications/${application.id}/assessment`; }}
          >
            <IconClipboard size={15} />
            Go to assessments
          </Button>
        </div>
      </div>
    </div>
  );
}

function InterviewActionCard({ application }: { application: Application }) {
  return (
    <div className={`${styles.actionCard} ${styles.actionCardBrand}`}>
      <div className={styles.actionCardInner}>
        <p className={styles.actionCardTitle}>Complete your AI interview</p>
        <p className={styles.actionCardBody}>
          Your AI interview is ready to begin. Find a quiet space, ensure your camera and
          microphone are working, and set aside approximately 15 minutes to complete all questions.
        </p>
        <div className={styles.actionCardActions}>
          <Button
            variant="primary"
            onClick={() => { window.location.href = `/applications/${application.id}/interview`; }}
          >
            <IconMicrophone2 size={15} />
            Start AI interview
          </Button>
        </div>
      </div>
    </div>
  );
}

function AcceptedActionCard({ application }: { application: Application }) {
  const offer = application.offerDetails;

  return (
    <div className={`${styles.actionCard} ${styles.actionCardResolved}`}>
      <div className={styles.actionCardInner}>
        <p className={styles.actionCardTitle}>You have received an offer</p>
        {offer ? (
          <p className={styles.actionCardBody}>
            {offer.company} has extended an offer for the {offer.position} role at{' '}
            {offer.salary}. Review the full offer details and accept or discuss with the team.
          </p>
        ) : (
          <p className={styles.actionCardBody}>
            An offer has been extended for this role. View the details to learn more.
          </p>
        )}
        <div className={styles.actionCardActions}>
          <Button
            variant="primary"
            onClick={() => { window.location.href = `/applications/${application.id}/offer`; }}
          >
            <IconStar size={15} />
            View offer
          </Button>
        </div>
      </div>
    </div>
  );
}

function RejectedActionCard({ application }: { application: Application }) {
  return (
    <div className={`${styles.actionCard} ${styles.actionCardPassive}`}>
      <div className={styles.actionCardInner}>
        <p className={styles.actionCardTitle}>Application not progressed</p>
        {application.rejectionReason ? (
          <>
            <p className={styles.actionCardBody}>
              The hiring team shared the following feedback:
            </p>
            <Callout variant="info">
              <Text size="sm" color="secondary" style={{ lineHeight: 'var(--leading-relaxed)' }}>
                {application.rejectionReason}
              </Text>
            </Callout>
          </>
        ) : (
          <p className={styles.actionCardBody}>
            The hiring team has decided not to move forward with your application at this time.
            Your effort in completing the process is appreciated.
          </p>
        )}
        <div className={styles.actionCardActions}>
          <Button
            variant="ghost"
            onClick={() => { window.location.href = `/applications/${application.id}/closed`; }}
          >
            View closure summary
          </Button>
          <Button
            variant="link"
            onClick={() => { window.location.href = '/jobs'; }}
          >
            Browse new positions
          </Button>
        </div>
      </div>
    </div>
  );
}

function InsightReportBlock({ application }: { application: Application }) {
  if (!application.hasInsightReport) return null;

  if (application.insightUnlocked) {
    return (
      <div className={`${styles.actionCard} ${styles.actionCardResolved}`}>
        <div className={styles.actionCardInner}>
          <p className={styles.actionCardTitle}>Your Insight Report is ready</p>
          <p className={styles.actionCardBody}>
            Your personalised report with assessment scores, strengths, and development areas is now
            available to view.
          </p>
          <div className={styles.actionCardActions}>
            <Button
              variant="primary"
              onClick={() => { window.location.href = `/applications/${application.id}/insight`; }}
            >
              <IconSparkles size={15} />
              View Insight Report
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.insightLocked}>
      <IconLock size={18} className={styles.insightLockedIcon} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <Text size="sm" weight="semibold" color="primary">Insight Report locked</Text>
        <Text size="sm" color="secondary">
          Your report will become available on{' '}
          {formatDate(application.expectedDecisionDate)} once the application window closes.
        </Text>
      </div>
    </div>
  );
}

// ── Status card (right column) ─────────────────────────────────────────────

function StatusCard({ application }: { application: Application }) {
  const cfg = STAGE_CONFIG[application.stage];
  const StageIcon = cfg.Icon;

  const showProgress =
    application.assessments.length > 0 &&
    (application.stage === 'assessment' ||
      application.stage === 'assessment-complete' ||
      STAGE_ORDER[application.stage] > STAGE_ORDER['assessment-complete']);

  return (
    <div className={styles.statusCard}>
      <div className={styles.statusCardHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <StageIcon size={18} style={{ color: cfg.colorVar, flexShrink: 0 }} />
          <span className={styles.statusCardStageName}>{cfg.label}</span>
        </div>
        <div className={styles.statusCardStageRow}>
          <Badge variant={cfg.badgeVariant} size="sm">{cfg.label}</Badge>
        </div>
      </div>

      <div className={styles.statusCardBody}>
        <div className={styles.statusCardRow}>
          <span className={styles.statusCardRowLabel}>Applied</span>
          <span className={styles.statusCardRowValue}>{formatShortDate(application.appliedAt)}</span>
        </div>
        <div className={styles.statusCardRow}>
          <span className={styles.statusCardRowLabel}>Expected decision</span>
          <span className={styles.statusCardRowValue}>{formatShortDate(application.expectedDecisionDate)}</span>
        </div>
        {application.deadline && application.stage === 'assessment' && (
          <div className={styles.statusCardRow}>
            <span className={styles.statusCardRowLabel}>Assessment deadline</span>
            <span className={styles.statusCardRowValue}>{formatShortDate(application.deadline)}</span>
          </div>
        )}

        {showProgress && (
          <Progress
            value={application.assessmentProgress}
            label="Assessment progress"
            showValue
            color={application.assessmentProgress === 100 ? 'brand' : 'warning'}
          />
        )}
      </div>
    </div>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────

export default function ApplicationDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const application = useStore((s) => s.applications.find((a) => a.id === id));
  const job = application ? JOBS.find((j) => j.id === application.jobId) : undefined;

  // ── Not found ────────────────────────────────────────────────────────────

  if (!application || !job) {
    return (
      <div className={styles.page}>
        <button className={styles.back} onClick={() => navigate('/applications')}>
          <IconArrowLeft size={16} />
          Back to applications
        </button>
        <div className={styles.stateCenter}>
          <div className={styles.stateCard}>
            <div className={`${styles.stateIconWrap} ${styles.stateIconError}`}>
              <IconAlertCircle size={32} />
            </div>
            <p className={styles.stateTitle}>Application not found</p>
            <p className={styles.stateBody}>
              This application may have been removed or the link may be incorrect. Return to your
              applications list to find the one you are looking for.
            </p>
            <Button variant="primary" onClick={() => navigate('/applications')}>
              Back to my applications
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const stage = application.stage;
  const cfg = STAGE_CONFIG[stage];
  const stageOrder = STAGE_ORDER[stage];
  const showInsightBlock =
    application.hasInsightReport &&
    (stage === 'assessment-complete' || stageOrder > STAGE_ORDER['assessment-complete']);

  // ── Default detail view ───────────────────────────────────────────────────

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/applications')}>
        <IconArrowLeft size={16} />
        Back to applications
      </button>

      <div className={styles.inner}>
        {/* ── Left column ──────────────────────── */}
        <div className={styles.left}>
          {/* Job header */}
          <div>
            <div className={styles.jobHeader}>
              <Avatar initials={job.companyLogoInitials} size="lg" color="secondary" />
              <div className={styles.jobHeaderInfo}>
                <h1 className={styles.jobTitle}>{job.title}</h1>
                <p className={styles.jobCompany}>{job.company}</p>
              </div>
            </div>
          </div>

          {/* Stage timeline */}
          <StageTimeline currentStage={stage} />

          {/* Stage-specific action cards */}
          {stage === 'assessment' && (
            <AssessmentActionCard application={application} />
          )}

          {stage === 'interview' && (
            <InterviewActionCard application={application} />
          )}

          {stage === 'accepted' && (
            <AcceptedActionCard application={application} />
          )}

          {stage === 'rejected' && (
            <RejectedActionCard application={application} />
          )}

          {/* Insight report block (assessment-complete or later) */}
          {showInsightBlock && (
            <InsightReportBlock application={application} />
          )}

          {/* Last activity */}
          <div className={styles.activityCard}>
            <Text size="xs" color="tertiary" weight="semibold" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Last Activity
            </Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <IconClock size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
              <Text size="sm" color="secondary">
                {formatRelativeDate(application.lastActivityAt)}
              </Text>
              <Text size="sm" color="tertiary">
                — {cfg.label}
              </Text>
            </div>
          </div>
        </div>

        {/* ── Right column ──────────────────────── */}
        <div className={styles.right}>
          <StatusCard application={application} />

          {/* Ask AI button */}
          <div className={styles.aiButton}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <Text size="sm" weight="semibold" color="brand">Have a question?</Text>
              <Text size="xs" color="secondary">
                Ask AI anything about this application — deadlines, next steps, or what to expect.
              </Text>
            </div>
            <Button
              variant="ghost"
              size="sm"
              style={{ alignSelf: 'flex-start' }}
              onClick={() => showToast({ message: 'This feature is coming in V1.', type: 'info' })}
            >
              <IconSparkles size={14} />
              Ask AI about this application
            </Button>
          </div>

          {/* View job posting link */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Link
              to={`/jobs/${job.id}`}
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-tertiary)',
                textDecoration: 'underline',
                textUnderlineOffset: 2,
              }}
            >
              View original job posting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
