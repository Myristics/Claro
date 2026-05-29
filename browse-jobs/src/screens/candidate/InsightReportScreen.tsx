import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IconArrowLeft,
  IconAlertCircle,
  IconCircleX,
  IconSparkles,
  IconRefresh,
  IconFileText,
  IconClipboard,
  IconBulb,
} from '@tabler/icons-react';
import { useStore } from '../../store/useStore';
import { JOBS } from '../../data/mockData';
import { useToast } from '../../store/useToast';
import styles from './InsightReportScreen.module.css';

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function generateRef(applicationId: string, suffix: string): string {
  let hash = 0;
  const str = applicationId + suffix;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  const num = Math.abs(hash) % 100000;
  return `#CLA-${String(num).padStart(5, '0')}`;
}

// ── Insight card data (from Figma node 27:264) ─────────────────────────────

type InsightVariant = 'cognitive' | 'personality' | 'working';

interface InsightBlock {
  id: string;
  variant: InsightVariant;
  sectionLabel: string;
  source: string;
  title: string;
  body: string;
  tip: string;
}

const INSIGHT_BLOCKS: InsightBlock[] = [
  {
    id: 'cognitive',
    variant: 'cognitive',
    sectionLabel: 'COGNITIVE REASONING',
    source: 'Cognitive Assessment',
    title: 'Structured Thinker',
    body: 'You tend to approach problems methodically, breaking them into clear steps before acting. This makes you effective in situations that reward careful analysis.',
    tip: 'Consider roles that leverage systematic problem-solving, such as process design or analytical research.',
  },
  {
    id: 'personality',
    variant: 'personality',
    sectionLabel: 'PERSONALITY PROFILE',
    source: 'Personality Test',
    title: 'Building Detail Orientation',
    body: 'Your results suggest you work well at a high level but may benefit from building habits around detail-checking, particularly in fast-paced environments.',
    tip: 'Practice structured review frameworks — checklists or peer review habits — to strengthen precision over time.',
  },
  {
    id: 'working',
    variant: 'working',
    sectionLabel: 'WORKING STYLE',
    source: 'Personality Test',
    title: 'Adaptive Communicator',
    body: 'Your communication style shows flexibility — you adjust your approach depending on the audience and context, which tends to be effective across different team dynamics.',
    tip: 'Consider roles that benefit from cross-functional communication, where adaptability is a core strength.',
  },
];

// Variant class maps
const _CARD_CLASS: Record<InsightVariant, string> = {
  cognitive:   styles.insightCardCognitive,
  personality: styles.insightCardPersonality,
  working:     styles.insightCardWorking,
}; void _CARD_CLASS;
const LABEL_CLASS: Record<InsightVariant, string> = {
  cognitive:   styles.insightLabelCognitive,
  personality: styles.insightLabelPersonality,
  working:     styles.insightLabelWorking,
};
const _BADGE_CLASS: Record<InsightVariant, string> = {
  cognitive:   styles.insightBadgeCognitive,
  personality: styles.insightBadgePersonality,
  working:     styles.insightBadgeWorking,
}; void _BADGE_CLASS;
const FOOTER_CLASS: Record<InsightVariant, string> = {
  cognitive:   styles.insightFooterCognitive,
  personality: styles.insightFooterPersonality,
  working:     styles.insightFooterWorking,
};
const TIP_CLASS: Record<InsightVariant, string> = {
  cognitive:   styles.insightTipCognitive,
  personality: styles.insightTipPersonality,
  working:     styles.insightTipWorking,
};
const ICON_CLASS: Record<InsightVariant, string> = {
  cognitive:   styles.insightIconCognitive,
  personality: styles.insightIconPersonality,
  working:     styles.insightIconWorking,
};

// ── Insight card sub-component ─────────────────────────────────────────────

function InsightCard({ block }: { block: InsightBlock }) {
  const { variant } = block;
  return (
    <div className={styles.insightCard}>
      {/* Header + body stacked together */}
      <div className={styles.insightCardContent}>
        {/* Header row: eyebrow label (coloured) + neutral badge */}
        <div className={styles.insightCardHeader}>
          <span className={`${styles.insightLabel} ${LABEL_CLASS[variant]}`}>
            {block.sectionLabel}
          </span>
          <div className={styles.insightBadge}>
            <IconClipboard size={12} strokeWidth={1.75} />
            <span>{block.source}</span>
          </div>
        </div>

        {/* Body: title + description — both neutral */}
        <div className={styles.insightCardBody}>
          <p className={styles.insightTitle}>{block.title}</p>
          <p className={styles.insightDesc}>{block.body}</p>
        </div>
      </div>

      {/* Footer: coloured bg + coloured icon + coloured tip */}
      <div className={`${styles.insightCardFooter} ${FOOTER_CLASS[variant]}`}>
        <IconBulb size={16} strokeWidth={1.75} className={`${styles.insightBulb} ${ICON_CLASS[variant]}`} />
        <p className={`${styles.insightTip} ${TIP_CLASS[variant]}`}>{block.tip}</p>
      </div>
    </div>
  );
}

// ── Archetype static data ──────────────────────────────────────────────────

const ARCHETYPE = {
  name: 'The Empathetic Strategist',
  description:
    'You combine logical rigour with a strong ability to read people and situations. You see both the big picture and the human detail, making you effective in roles that require both strategic thinking and stakeholder management.',
};

// ── Main screen ────────────────────────────────────────────────────────────

export default function InsightReportScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loadProgress, setLoadProgress] = useState(8);
  const [loadDone, setLoadDone] = useState(false);
  const [loadError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const application = useStore((s) => s.applications.find((a) => a.id === id));
  const job = application ? JOBS.find((j) => j.id === application.jobId) : undefined;

  // Simulate insight report loading
  useEffect(() => {
    if (!application || !application.insightUnlocked) {
      setLoadDone(true);
      return;
    }

    setLoadDone(false);
    setLoadProgress(8);

    intervalRef.current = window.setInterval(() => {
      setLoadProgress((p) => {
        const next = Math.min(p + Math.floor(Math.random() * 10 + 5), 95);
        if (next >= 92) {
          if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
          window.setTimeout(() => setLoadDone(true), 380);
        }
        return next;
      });
    }, 180);

    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, [retryKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Loading ────────────────────────────────────────────────────────────

  if (!loadDone) {
    return (
      <div className={styles.page}>
        <div className={styles.pageBar}>
          <button className={styles.backBtn} onClick={() => navigate('/applications')}>
            <IconArrowLeft size={15} strokeWidth={2} />
            Back to My Applications
          </button>
          {job && (
            <p className={styles.pageBarTitle}>
              Insight Report for: <strong>{job.title} at {job.company}</strong>
            </p>
          )}
        </div>
        <div className={styles.stateCenter}>
          <div className={styles.loadingContent}>
            <p className={styles.loadingTitle}>Preparing your insight report</p>
            <p className={styles.loadingSub}>This usually takes about 10 seconds.</p>
            <div className={styles.progressBarWrap}>
              <div className={styles.progressBarFill} style={{ width: `${loadProgress}%` }} />
            </div>
            <p className={styles.loadingCaption}>Analysing your responses...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────

  if (loadError) {
    return (
      <div className={styles.page}>
        <div className={styles.pageBar}>
          <button className={styles.backBtn} onClick={() => navigate('/applications')}>
            <IconArrowLeft size={15} strokeWidth={2} />
            Back to My Applications
          </button>
        </div>
        <div className={styles.stateCenter}>
          <div className={styles.errorCard}>
            <div className={styles.errorIconWrap}>
              <IconAlertCircle size={28} strokeWidth={2} />
            </div>
            <p className={styles.errorTitle}>Could not load your insight report.</p>
            <p className={styles.errorBody}>
              There may be a temporary issue with our servers. Please try refreshing. If this
              continues, you can{' '}
              <button className={styles.errorLink} onClick={() => navigate('/conversations')}>
                ask AI for help
              </button>
              .
            </p>
            <button className={styles.refreshBtn} onClick={() => setRetryKey((k) => k + 1)}>
              <IconRefresh size={15} />
              Refresh page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────

  if (!application || !job) {
    return (
      <div className={styles.page}>
        <div className={styles.pageBar}>
          <button className={styles.backBtn} onClick={() => navigate('/applications')}>
            <IconArrowLeft size={15} strokeWidth={2} />
            Back to My Applications
          </button>
        </div>
        <div className={styles.stateCenter}>
          <div className={styles.errorCard}>
            <div className={styles.errorIconWrap}>
              <IconAlertCircle size={28} strokeWidth={2} />
            </div>
            <p className={styles.errorTitle}>Application not found</p>
            <p className={styles.errorBody}>
              This application may have been removed or the link may be incorrect.
            </p>
            <button className={styles.refreshBtn} onClick={() => navigate('/applications')}>
              Back to my applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Locked ─────────────────────────────────────────────────────────────

  if (!application.insightUnlocked) {
    return (
      <div className={styles.page}>
        <div className={styles.pageBar}>
          <button className={styles.backBtn} onClick={() => navigate('/applications')}>
            <IconArrowLeft size={15} strokeWidth={2} />
            Back to My Applications
          </button>
          <p className={styles.pageBarTitle}>
            Insight Report for: <strong>{job.title} at {job.company}</strong>
          </p>
        </div>
        <div className={styles.stateCenter}>
          <div className={styles.errorCard}>
            <div className={styles.lockedIconWrap}>
              <IconAlertCircle size={28} strokeWidth={2} />
            </div>
            <p className={styles.errorTitle}>Insight report not yet available</p>
            <p className={styles.errorBody}>
              Your report will be available once the application window closes and all candidates
              have been assessed.
            </p>
            <button className={styles.refreshBtn} onClick={() => navigate('/applications')}>
              Back to my applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main report ────────────────────────────────────────────────────────

  const isClosed = application.stage === 'rejected';
  const refCode = generateRef(application.id, 'insight');
  const decisionDate = formatDate(application.lastActivityAt);

  return (
    <div className={styles.page}>

      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className={styles.pageBar}>
        <button className={styles.backBtn} onClick={() => navigate('/applications')}>
          <IconArrowLeft size={15} strokeWidth={2} />
          Back to My Applications
        </button>
        <p className={styles.pageBarTitle}>
          Insight Report for: <strong>{job.title} at {job.company}</strong>
        </p>
      </div>

      {/* ── Main scrollable content ───────────────────────────────────── */}
      <div className={styles.content}>
        <div className={styles.inner}>

          {/* ── Application closed card (inside scroll, before report) ─── */}
          {isClosed && (
            <div className={styles.closedCard}>
              <div className={styles.closedBannerRow}>
                <IconCircleX size={15} strokeWidth={2} className={styles.closedBannerIcon} />
                <div className={styles.closedMeta}>
                  <span className={styles.closedLabel}>Application closed</span>
                  <span className={styles.closedDot}>•</span>
                  <span className={styles.closedMetaText}>Decision made on {decisionDate}</span>
                  <span className={styles.closedDot}>•</span>
                  <span className={styles.closedMetaText}>Ref: {refCode}</span>
                </div>
              </div>
              <h2 className={styles.closedTitle}>
                We have completed our review for the {job.title} role.
              </h2>
              <p className={styles.closedBody}>
                We have completed our review of your application. {job.company} has chosen to
                proceed with other candidates for the {job.title} position. We appreciate the time
                and effort you invested in this process.
              </p>
            </div>
          )}

          {/* ── Main report card ─────────────────────────────────────── */}
          <div className={styles.reportCard}>

            {/* ── Report heading ────────────────────────────────────── */}
            <div className={styles.reportHeader}>
              <h1 className={styles.reportTitle}>Your Insight Report</h1>
              <p className={styles.reportSub}>
                A reflection of your working style, strengths, and growth areas — yours to keep,
                regardless of the outcome of this application.
              </p>
            </div>

            {/* ── Archetype card ────────────────────────────────────── */}
            <div className={styles.archetypeCard}>
              <div className={styles.archetypeLabelWrap}>
                <span className={styles.archetypeLabel}>Your Archetype</span>
              </div>
              <p className={styles.archetypeName}>{ARCHETYPE.name}</p>
              <p className={styles.archetypeDesc}>{ARCHETYPE.description}</p>
            </div>

            {/* ── Detailed insights ──────────────────────────────────── */}
            <div className={styles.insightSection}>
              <div className={styles.sectionLabelRow}>
                <p className={styles.sectionLabel}>DETAILED INSIGHTS</p>
                <div className={styles.sectionDivider} />
              </div>
              {INSIGHT_BLOCKS.map((block) => (
                <InsightCard key={block.id} block={block} />
              ))}
            </div>

            {/* ── Ask AI callout ─────────────────────────────────────── */}
            <div className={styles.aiCallout}>
              <div className={styles.aiCalloutLeft}>
                <IconSparkles size={18} className={styles.aiCalloutIcon} />
                <div>
                  <p className={styles.aiCalloutTitle}>Want to dig deeper?</p>
                  <p className={styles.aiCalloutBody}>
                    Ask our AI to explain what your archetype means for your career, or get
                    personalised development tips based on your results.
                  </p>
                </div>
              </div>
              <button className={styles.aiCalloutBtn} onClick={() => navigate('/conversations')}>
                Ask AI about your results
              </button>
            </div>

            {/* ── Continue your journey — inside report card, centred ─── */}
            <div className={styles.continueCard}>
              <div className={styles.continueCardHeader}>
                <p className={styles.continueTitle}>Continue your journey</p>
                <p className={styles.continueSub}>
                  Your insight report is yours to keep. Save it as a PDF to use when applying to
                  other roles.
                </p>
              </div>
              <div className={styles.continueBtns}>
                <button
                  className={`${styles.continueBtn} ${styles.continueBtnPrimary}`}
                  onClick={() => showToast({ message: 'Save as PDF — coming in V1.' })}
                >
                  <IconFileText size={15} />
                  Save as PDF
                </button>
                <button className={styles.continueBtn} onClick={() => navigate('/jobs')}>
                  Browse similar job vacancy
                </button>
              </div>
            </div>

          </div>{/* /reportCard */}

        </div>
      </div>
    </div>
  );
}
