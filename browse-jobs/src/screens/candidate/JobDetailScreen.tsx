import { useParams, useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import {
  IconArrowLeft,
  IconArrowRight,
  IconBriefcase,
  IconMapPin,
  IconClock,
  IconHourglass,
  IconUsers,
  IconX,
  IconRefresh,
  IconBell,
  IconBookmark,
  IconMailOff,
  IconCircleCheck,
} from '@tabler/icons-react';
import { JOBS } from '../../data/mockData';
import { useStore } from '../../store/useStore';
import { useToast } from '../../store/useToast';
import { Avatar } from '../../components/ds';
import styles from './JobDetailScreen.module.css';

// ── Helpers ───────────────────────────────────────────────────────────────

function formatSalaryCompact(range: string): string {
  const matches = [...range.matchAll(/[\d.]+/g)];
  if (matches.length < 2) return range;
  const toM = (s: string) => {
    const n = parseInt(s.replace(/\./g, ''), 10);
    if (n >= 1_000_000) return `${n / 1_000_000}M`;
    if (n >= 1_000) return `${n / 1_000}K`;
    return String(n);
  };
  return `IDR ${toM(matches[0][0])} - ${toM(matches[matches.length - 1][0])}`;
}

function daysUntil(isoDate: string): number {
  const diff = new Date(isoDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ── Hiring process steps ─────────────────────────────────────────────────

const HIRING_STEPS = [
  {
    step: 1,
    label: 'Application Received',
    badge: null as string | null,
    desc: 'Your application has been successfully submitted and queued in our database. You will receive an automated confirmation email immediately. No further action is required from your side at this moment.',
  },
  {
    step: 2,
    label: 'Under Review',
    badge: 'Approx. 1-3 days',
    desc: "Our hiring team is carefully evaluating your resume and portfolio against the core requirements of the role. We manually review every application to ensure we don't miss out on unique talent.",
  },
  {
    step: 3,
    label: 'Assessment',
    badge: 'Approx. 20 mins',
    desc: 'If your profile aligns with our needs, you will be invited to complete a cognitive and personality assessment to understand your working style and how you might thrive within our team culture.',
  },
  {
    step: 4,
    label: 'Interview',
    badge: '1 hour',
    desc: "Candidates who pass the assessment will be invited for a direct interview — our chance to dive deeper into your background and past challenges. It's also your opportunity to ask about the role and team.",
  },
  {
    step: 5,
    label: 'Final Review',
    badge: 'Approx. 2-3 days',
    desc: 'After all interviews are completed, our hiring committee enters the deliberation phase. We consolidate feedback from all interviewers and review your assessment insights comprehensively.',
  },
  {
    step: 6,
    label: 'Decision & Insight',
    badge: 'Approx. 20 mins',
    desc: "This is the culmination of the process. If selected, you'll receive an official Offer Extended status. If we decide not to move forward, we'll close your application transparently and provide you with an Insight Report.",
  },
];

// ── Component ─────────────────────────────────────────────────────────────

export default function JobDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const applications = useStore((s) => s.applications);
  const { showToast } = useToast();

  const fromApplications = location.pathname.startsWith('/applications');
  const backPath = fromApplications ? '/applications' : '/jobs';
  const backLabel = fromApplications ? 'Back to applications' : 'Back to browse jobs';

  const stateOverride = searchParams.get('state');
  const job = JOBS.find((j) => j.id === id);
  const existingApp = applications.find((a) => a.jobId === id);
  const applyingForLabel = fromApplications && job ? `${job.title} at ${job.company}` : null;

  // ── Error state ────────────────────────────────────────────────────────
  if (!job || stateOverride === 'error') {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(backPath)}>
            <IconArrowLeft size={16} />
            {backLabel}
          </button>
          {applyingForLabel && (
            <span className={styles.applyingFor}>
              Applying for: <strong>{applyingForLabel}</strong>
            </span>
          )}
        </div>
        <div className={styles.stateCenter}>
          <div className={styles.stateCard}>
            <div className={`${styles.stateIconWrap} ${styles.iconError}`}>
              <IconX size={24} strokeWidth={2.5} />
            </div>
            <div className={styles.stateTextGroup}>
              <p className={styles.stateTitle}>Could not load the job listing</p>
              <p className={styles.stateBody}>
                There may be a temporary issue with our service. Try refreshing the page.
                If the problem continues,{' '}
                <span
                  className={styles.stateLink}
                  role="button"
                  onClick={() => showToast({ message: 'AI Chat — coming in V1.' })}
                >
                  ask AI for help.
                </span>
              </p>
            </div>
            <button className={styles.refreshBtn} onClick={() => window.location.reload()}>
              <IconRefresh size={16} />
              Refresh page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Closed state ───────────────────────────────────────────────────────
  if (!job.isOpen || stateOverride === 'closed') {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(backPath)}>
            <IconArrowLeft size={16} />
            {backLabel}
          </button>
          {applyingForLabel && (
            <span className={styles.applyingFor}>
              Applying for: <strong>{applyingForLabel}</strong>
            </span>
          )}
        </div>
        <div className={styles.stateCenter}>
          <div className={styles.stateCard}>
            <div className={`${styles.stateIconWrap} ${styles.iconTeal}`}>
              <IconMailOff size={32} />
            </div>
            <div className={styles.stateTextGroup}>
              <p className={styles.stateTitle}>This role is no longer accepting applications.</p>
              <p className={styles.stateBody}>
                Process details are no longer available for this closed vacancy.
              </p>
            </div>
            <button
              className={styles.primaryBtn}
              onClick={() => showToast({ message: 'Job alerts — coming in V1.' })}
            >
              <IconBell size={18} />
              Set up Job Alert
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Default / Applied state ────────────────────────────────────────────
  const closingDays = daysUntil(job.closingDate);
  const salaryFormatted = formatSalaryCompact(job.salaryRange);

  return (
    <div className={styles.page}>
      {/* Sticky header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(backPath)}>
          <IconArrowLeft size={16} />
          {backLabel}
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.vacancyGrid}>

          {/* ── Left: Content card ─────────────────────── */}
          <div className={styles.leftCard}>

            {/* Job header */}
            <div className={styles.jobHeader}>
              <div className={styles.companyLogoBox}>
                <Avatar initials={job.companyLogoInitials} size="lg" color="brand" />
              </div>
              <div className={styles.jobTitleGroup}>
                <p className={styles.jobTitle}>{job.title}</p>
                <p className={styles.jobCompany}>{job.company}</p>
                <p className={styles.jobMeta}>
                  {job.type} • {job.location} ({job.workMode.toLowerCase()})
                </p>
              </div>
            </div>

            <div className={styles.cardSep} />

            {/* About the role */}
            <div className={styles.section}>
              <p className={styles.sectionLabel}>ABOUT THE ROLE</p>
              <p className={styles.sectionBody}>{job.description}</p>
            </div>

            <div className={styles.cardSep} />

            {/* The hiring process */}
            <div className={styles.section}>
              <p className={styles.sectionLabel}>THE HIRING PROCESS</p>
              <p className={styles.sectionBody}>Know exactly what to expect before you apply.</p>
              <div className={styles.hiringSteps}>
                {HIRING_STEPS.map(({ step, label, badge, desc }, i) => (
                  <div key={step} className={styles.hiringStep}>
                    {/* Left: numbered circle + connector */}
                    <div className={styles.stepIconCol}>
                      <div className={styles.stepCircle}>
                        <span className={styles.stepNum}>{step}</span>
                      </div>
                      {i < HIRING_STEPS.length - 1 && (
                        <div className={styles.stepConnector} />
                      )}
                    </div>
                    {/* Right: label + badge + description */}
                    <div className={styles.stepContent}>
                      <div className={styles.stepHeader}>
                        <span className={styles.stepLabel}>{label}</span>
                        {badge && (
                          <span className={styles.stepBadge}>
                            <IconClock size={12} />
                            {badge}
                          </span>
                        )}
                      </div>
                      <p className={styles.stepDesc}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.cardSep} />

            {/* Experience & Requirements */}
            <div className={styles.section}>
              <p className={styles.sectionLabel}>EXPERIENCE & REQUIREMENTS</p>
              <ul className={styles.reqList}>
                {job.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right: Salary / Apply card ─────────────── */}
          <div className={styles.rightCard}>

            {/* Salary */}
            <div className={styles.salarySection}>
              <p className={styles.salaryAmount}>{salaryFormatted}</p>
              <p className={styles.salarySubtitle}>Gross per month</p>
              <div className={styles.badges}>
                <span className={styles.badgeWarning}>
                  <IconHourglass size={12} />
                  {closingDays <= 0
                    ? 'Closing today'
                    : `Closes in ${closingDays} day${closingDays !== 1 ? 's' : ''}`}
                </span>
                <span className={styles.badgeBlue}>
                  <IconUsers size={12} />
                  {job.positions} Position{job.positions !== 1 ? 's' : ''} left
                </span>
              </div>
            </div>

            <div className={styles.cardSep} />

            {/* Meta rows */}
            <div className={styles.metaRows}>
              <div className={styles.metaRow}>
                <IconBriefcase size={16} className={styles.metaIcon} />
                <span className={styles.metaLabel}>Employment:</span>
                <span className={styles.metaValue}>{job.type}</span>
              </div>
              <div className={styles.metaRow}>
                <IconMapPin size={16} className={styles.metaIcon} />
                <span className={styles.metaLabel}>Location:</span>
                <span className={styles.metaValue}>{job.workMode}</span>
              </div>
              <div className={styles.metaRow}>
                <IconClock size={16} className={styles.metaIcon} />
                <span className={styles.metaLabel}>Process Estimation:</span>
                <span className={styles.metaValue}>~{job.processingDays} Days</span>
              </div>
            </div>

            <div className={styles.cardSep} />

            {/* Actions */}
            <div className={styles.actionsArea}>
              {existingApp ? (
                /* Applied state */
                <div className={styles.appliedState}>
                  <div className={styles.appliedBtn}>
                    <IconCircleCheck size={16} />
                    You have applied to this role
                  </div>
                  <Link
                    to={`/applications?search=${encodeURIComponent(job.title)}`}
                    className={styles.viewStatusLink}
                  >
                    View your application status
                    <IconArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                /* Default CTA */
                <>
                  <button
                    className={styles.applyBtn}
                    onClick={() => navigate(`/jobs/${id}/apply`)}
                  >
                    Apply now
                  </button>
                  <button
                    className={styles.saveBtn}
                    onClick={() => showToast({ message: 'Save to profile — coming in V1.' })}
                  >
                    <IconBookmark size={16} />
                    Save to profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
