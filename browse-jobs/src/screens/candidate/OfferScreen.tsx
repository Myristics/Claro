import { useParams, useNavigate } from 'react-router-dom';
import {
  IconArrowLeft,
  IconStar,
  IconAlertCircle,
  IconInfoCircle,
  IconFileText,
  IconSparkles,
  IconCheck,
} from '@tabler/icons-react';
import { useStore } from '../../store/useStore';
import { JOBS } from '../../data/mockData';
import { useToast } from '../../store/useToast';
import styles from './OfferScreen.module.css';

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDeadline(iso: string): string {
  return (
    new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }) + ', 23:59 WIB'
  );
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

// ── Main screen ────────────────────────────────────────────────────────────

export default function OfferScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const application = useStore((s) => s.applications.find((a) => a.id === id));
  const job = application ? JOBS.find((j) => j.id === application.jobId) : undefined;

  // ── Not found ──────────────────────────────────────────────────────────

  if (!application || !job) {
    return (
      <div className={styles.page}>
        <div className={styles.topbar}>
          <button className={styles.backBtn} onClick={() => navigate('/applications')}>
            <IconArrowLeft size={15} strokeWidth={2} />
            Back to My Applications
          </button>
        </div>
        <div className={styles.stateCenter}>
          <div className={styles.stateCard}>
            <div className={styles.errorIconWrap}>
              <IconAlertCircle size={28} strokeWidth={2} />
            </div>
            <p className={styles.stateTitle}>Application not found</p>
            <p className={styles.stateBody}>
              This application may have been removed or the link may be incorrect.
            </p>
            <button className={styles.statePrimaryBtn} onClick={() => navigate('/applications')}>
              Back to my applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  const offer = application.offerDetails ?? {
    position: job.title,
    company: job.company,
    salary: job.salaryRange,
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  };

  const refCode = generateRef(application.id, 'offer');
  const decisionDate = formatDate(application.lastActivityAt);
  const deadlineFormatted = formatDeadline(application.deadline);
  const benefits = job.benefits.slice(0, 5);

  return (
    <div className={styles.page}>

      {/* ── Topbar ──────────────────────────────────────────────────────── */}
      <div className={styles.topbar}>
        <button className={styles.backBtn} onClick={() => navigate('/applications')}>
          <IconArrowLeft size={15} strokeWidth={2} />
          Back to My Applications
        </button>
        <p className={styles.topbarTitle}>
          Acceptance Page for: <strong>{offer.position} at {offer.company}</strong>
        </p>
      </div>

      {/* ── Scrollable content ──────────────────────────────────────────── */}
      <div className={styles.content}>
        <div className={styles.inner}>

          {/* ── Offer banner card (teal border, white bg) ───────────────── */}
          <div className={styles.bannerCard}>
            <div className={styles.bannerTopRow}>
              <IconStar size={14} strokeWidth={1.75} className={styles.bannerStar} />
              <span className={styles.bannerMeta}>
                Offer extended
                <span className={styles.bannerSep}>•</span>
                Decision made on {decisionDate}
                <span className={styles.bannerSep}>•</span>
                Ref: {refCode}
              </span>
            </div>
            <h1 className={styles.bannerTitle}>
              Congratulations! {offer.company} would like to move forward with you for
              the {offer.position} role.
            </h1>
            <p className={styles.bannerBody}>
              Please review the offer details below and confirm your response before the deadline.
              If you have questions, you can ask AI or contact the recruiter directly.
            </p>
          </div>

          {/* ── Main offer card ──────────────────────────────────────────── */}
          <div className={styles.offerCard}>

            {/* Heading */}
            <h2 className={styles.offerHeading}>Offer details</h2>

            {/* 2-col grid */}
            <div className={styles.offerGrid}>
              <div className={styles.offerCell}>
                <span className={styles.offerLabel}>ROLE</span>
                <span className={styles.offerValue}>{offer.position}</span>
              </div>
              <div className={styles.offerCell}>
                <span className={styles.offerLabel}>EMPLOYMENT TYPE</span>
                <span className={styles.offerValue}>{job.type}</span>
              </div>
              <div className={styles.offerCell}>
                <span className={styles.offerLabel}>COMPENSATION</span>
                <span className={styles.offerValue}>{offer.salary}</span>
              </div>
              <div className={styles.offerCell}>
                <span className={styles.offerLabel}>WORK ARRANGEMENT</span>
                <span className={styles.offerValue}>{job.workMode} • {job.location}</span>
              </div>
              <div className={styles.offerCell}>
                <span className={styles.offerLabel}>START DATE</span>
                <span className={styles.offerValue}>{formatDate(offer.startDate)}</span>
              </div>
              <div className={styles.offerCell}>
                <span className={styles.offerLabel}>PROBATION</span>
                <span className={styles.offerValue}>3 months</span>
              </div>
              {benefits.length > 0 && (
                <div className={`${styles.offerCell} ${styles.offerCellFull}`}>
                  <span className={styles.offerLabel}>BENEFITS</span>
                  <div className={styles.benefitChips}>
                    {benefits.map((b) => (
                      <span key={b} className={styles.benefitChip}>{b}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Download button */}
            <button
              className={styles.downloadBtn}
              onClick={() => showToast({ message: 'Download offer letter — coming in V1.' })}
            >
              <IconFileText size={16} className={styles.downloadIcon} />
              Download full offer letter (PDF)
            </button>

            {/* Amber deadline warning */}
            <div className={styles.deadlineBanner}>
              <IconInfoCircle size={16} className={styles.deadlineIcon} />
              <p className={styles.deadlineText}>
                Response required by {deadlineFormatted}. If no response is received, the offer
                will be automatically withdrawn.
              </p>
            </div>

            {/* YOUR RESPONSE section */}
            <div className={styles.responseSection}>
              <div className={styles.responseDivider}>
                <span className={styles.dividerLabel}>YOUR RESPONSE</span>
                <div className={styles.dividerLine} />
              </div>

              <p className={styles.responseInstruction}>
                Take the time you need to review. Accepting confirms your intention to join — a
                formal contract will follow separately.
              </p>

              <div className={styles.responseBtns}>
                <button
                  className={styles.btnAccept}
                  onClick={() => showToast({ message: 'Offer acceptance — coming in V1.' })}
                >
                  <IconCheck size={15} strokeWidth={2.5} />
                  Accept offer
                </button>
                <button
                  className={styles.btnDecline}
                  onClick={() => showToast({ message: 'Offer decline — coming in V1.' })}
                >
                  Decline offer
                </button>
                <button
                  className={styles.btnAskAi}
                  onClick={() => navigate('/conversations')}
                >
                  <IconSparkles size={14} />
                  Ask AI about this offer
                </button>
              </div>
            </div>

            {/* ── Insight row — card footer ─────────────────────────────── */}
            {application.insightUnlocked && (
              <div className={styles.insightRow}>
                <div className={styles.insightRowLeft}>
                  <div className={styles.insightIconWrap}>
                    <IconFileText size={20} />
                  </div>
                  <div className={styles.insightRowText}>
                    <p className={styles.insightRowTitle}>Your insight report is ready</p>
                    <p className={styles.insightRowSub}>
                      Yours to keep, regardless of your decision on this offer.
                    </p>
                  </div>
                </div>
                <button
                  className={styles.insightRowBtn}
                  onClick={() => navigate(`/applications/${id}/insight`)}
                >
                  View insight report
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
