import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  IconArrowLeft,
  IconClock,
  IconClipboardList,
  IconHelp,
  IconDeviceDesktop,
  IconShield,
  IconCheck,
  IconX,
  IconCalendar,
  IconInfoCircle,
  IconAlertTriangle,
  IconCamera,
  IconMicrophone2,
  IconWifi,
  IconSearch,
  IconRefresh,
} from '@tabler/icons-react';
import { JOBS } from '../../data/mockData';
import { useStore } from '../../store/useStore';
import styles from './AssessmentLandingScreen.module.css';

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDeadline(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', 23:59 WIB';
}

// ── Equipment check modal ─────────────────────────────────────────────────

type CheckStatus = 'failed' | 'checking' | 'ok';

function EquipmentModal({
  onClose,
  onStart,
}: {
  onClose: () => void;
  onStart: () => void;
}) {
  const [camera, setCamera] = useState<CheckStatus>('failed');

  function retryCamera() {
    setCamera('checking');
    setTimeout(() => setCamera('ok'), 1200);
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal header */}
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Check your equipment before starting</h3>
            <p className={styles.modalSubtitle}>Please make sure all of your device aspect are ready.</p>
          </div>
          <button className={styles.modalClose} onClick={onClose}><IconX size={16} /></button>
        </div>

        {/* Equipment rows */}
        <div className={styles.equipList}>
          {/* Camera */}
          <div className={`${styles.equipRow} ${camera === 'failed' ? styles.equipRowFailed : ''}`}>
            <div className={styles.equipIconWrap}>
              <IconCamera size={18} strokeWidth={1.5} />
            </div>
            <div className={styles.equipInfo}>
              <span className={styles.equipLabel}>Camera</span>
              <span className={styles.equipDesc}>
                {camera === 'failed'
                  ? 'No camera detected. A working camera is required to complete the AI Interview. Check that your device has a camera connected.'
                  : camera === 'checking'
                  ? 'Checking camera...'
                  : 'Camera detected and ready.'}
              </span>
            </div>
            {camera === 'failed' ? (
              <button className={styles.retryBtn} onClick={retryCamera}>Retry</button>
            ) : camera === 'checking' ? (
              <span className={styles.checkingBadge}>Checking…</span>
            ) : (
              <span className={styles.readyBadge}>Ready</span>
            )}
          </div>

          {/* Microphone */}
          <div className={styles.equipRow}>
            <div className={styles.equipIconWrap}>
              <IconMicrophone2 size={18} strokeWidth={1.5} />
            </div>
            <div className={styles.equipInfo}>
              <span className={styles.equipLabel}>Microphone</span>
              <span className={styles.equipDesc}>Built-in microphone detected</span>
            </div>
            <span className={styles.readyBadge}>Ready</span>
          </div>

          {/* Internet */}
          <div className={styles.equipRow}>
            <div className={styles.equipIconWrap}>
              <IconWifi size={18} strokeWidth={1.5} />
            </div>
            <div className={styles.equipInfo}>
              <span className={styles.equipLabel}>Internet Connection</span>
              <span className={styles.equipDesc}>Connection Stable</span>
            </div>
            <span className={styles.readyBadge}>Ready</span>
          </div>
        </div>

        {/* Modal footer */}
        <div className={styles.modalFooter}>
          <button className={styles.saveLaterBtn} onClick={onClose}>Save for later</button>
          <button className={styles.startBtn} onClick={onStart}>Start assessment</button>
        </div>
      </div>
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────

export default function AssessmentLandingScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stateOverride = searchParams.get('state');

  const application = useStore((s) => s.applications.find((a) => a.id === id));
  const [showEquipment, setShowEquipment] = useState(false);

  const job = application ? JOBS.find((j) => j.id === application.jobId) : null;
  const jobLabel = job ? `${job.title} at ${job.company}` : '';

  // ── Closed state ───────────────────────────────────────────────────────
  if (stateOverride === 'closed') {
    return (
      <div className={styles.page}>
        <TopBar onBack={() => navigate('/applications')} jobLabel={jobLabel} />
        <div className={styles.centerWrap}>
          <div className={styles.stateCard}>
            <div className={`${styles.stateIcon} ${styles.stateIconTeal}`}>
              <IconX size={28} strokeWidth={2} />
            </div>
            <p className={styles.stateTitle}>This assessment window has closed.</p>
            <p className={styles.stateBody}>
              Your application has been automatically withdrawn because the assessment was not
              completed in time. No action is needed from your side.
            </p>
            <button className={styles.primaryBtn} onClick={() => navigate('/jobs')}>
              <IconSearch size={16} strokeWidth={2} />
              Browse Similar Roles
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────
  if (stateOverride === 'error') {
    return (
      <div className={styles.page}>
        <TopBar onBack={() => navigate('/applications')} jobLabel={jobLabel} />
        <div className={styles.centerWrap}>
          <div className={styles.stateCard}>
            <div className={`${styles.stateIcon} ${styles.stateIconRed}`}>
              <IconX size={28} strokeWidth={2} />
            </div>
            <p className={styles.stateTitle}>Could not load your assessment.</p>
            <p className={styles.stateBody}>
              There may be a temporary issue with our service.{' '}
              Try refreshing the page. If the problem continues,{' '}
              <button className={styles.inlineLink} onClick={() => navigate('/conversations')}>
                ask AI for help.
              </button>
            </p>
            <button className={styles.ghostBtn} onClick={() => window.location.reload()}>
              <IconRefresh size={16} strokeWidth={2} />
              Refresh page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Landing (default / paused / half-completed / deadline) ───────────────
  const deadline = application?.deadline ?? '2026-07-01';
  const isInProgress = stateOverride === 'paused' || stateOverride === 'half';

  return (
    <div className={styles.page}>
      <TopBar onBack={() => navigate('/applications')} jobLabel={jobLabel} />

      <div className={styles.body}>
        <div className={styles.inner}>

          {/* In-progress / paused banner */}
          {isInProgress && (
            <div className={styles.infoBanner}>
              <IconInfoCircle size={16} className={styles.bannerIcon} />
              <span>
                {stateOverride === 'paused'
                  ? 'Your assessment is paused. Your answers are saved — pick up right where you left off. Note: the timer kept running while you were away.'
                  : 'You have an assessment in progress. Section 1 of 2 completed. Your answers are saved. The timer is still running.'}
              </span>
            </div>
          )}

          {/* Deadline warning banner */}
          {stateOverride === 'deadline' && (
            <div className={styles.warnBanner}>
              <IconAlertTriangle size={16} className={styles.bannerIcon} />
              <span>Your deadline is in 8 hours. Complete this soon to keep your application active.</span>
            </div>
          )}

          {/* Main card */}
          <div className={styles.card}>
            <div className={styles.cardBody}>

              {/* Title block */}
              <div className={styles.titleBlock}>
                <h1 className={styles.cardTitle}>
                  {isInProgress ? 'Resume your assessment' : 'Ready to begin your assessment?'}
                </h1>
                <p className={styles.cardSubtitle}>
                  {isInProgress
                    ? 'Your progress has been saved. Jump back in to finish where you left off.'
                    : 'Take your time. This is your one chance to show how you think before we move forward.'}
                </p>
              </div>

              {/* What to expect */}
              <div className={styles.expectBox}>
                <p className={styles.boxLabel}>What to expect</p>
                <div className={styles.expectGrid}>
                  <ExpectItem Icon={IconClock} label="Total time" desc="Approximately 45 minutes to complete all sections." />
                  <ExpectItem Icon={IconClipboardList} label="3 Different assessment" desc="Cognitive Reasoning, Personality, and Technical Skills." />
                  <ExpectItem Icon={IconHelp} label="Question Types" desc="Multiple choice and short text scenarios." />
                  <ExpectItem Icon={IconDeviceDesktop} label="Proctoring Enabled" desc="Screen and webcam recording will be active." />
                </div>
              </div>

              {/* About proctoring callout */}
              <div className={styles.proctorCallout}>
                <div className={styles.proctorHeader}>
                  <IconShield size={16} className={styles.proctorIcon} />
                  <span className={styles.proctorTitle}>About proctoring</span>
                </div>
                <p className={styles.proctorBody}>
                  Your screen and webcam will be recorded for the duration of the assessment. This
                  recording is used only to verify the integrity of the assessment process. It will
                  not be used in evaluating your responses.
                </p>
              </div>

              {/* Measures section */}
              <div className={styles.measuresRow}>
                <div className={styles.measuresCol}>
                  <p className={styles.measuresTitle}>What this assessment measures</p>
                  <MeasureItem type="check" text="Logical reasoning and pattern recognition" />
                  <MeasureItem type="check" text="Your preferred working style in team environments" />
                  <MeasureItem type="check" text="Basic understanding of design system principles" />
                </div>
                <div className={styles.measuresCol}>
                  <p className={styles.measuresTitle}>What this does not judge</p>
                  <MeasureItem type="cross" text="Your speed (take the time you need within the limit)" />
                  <MeasureItem type="cross" text="Your visual design or UI aesthetics" />
                  <MeasureItem type="cross" text="Previous industry experience" />
                </div>
              </div>

              {/* Tips box */}
              <div className={styles.tipsBox}>
                <p className={styles.boxLabel}>Tips before you start</p>
                <ul className={styles.tipsList}>
                  <li>Find a quiet space where you won't be interrupted.</li>
                  <li>Ensure you have a stable internet connection.</li>
                  <li>Close unnecessary browser tabs to maintain system performance.</li>
                </ul>
              </div>

            </div>

            {/* Card footer */}
            <div className={styles.cardFooter}>
              <div className={styles.deadlineLabel}>
                <IconCalendar size={15} className={styles.calIcon} />
                <span>Deadline: <strong>{formatDeadline(deadline)}</strong></span>
              </div>
              <div className={styles.footerActions}>
                <button className={styles.saveLaterBtn} onClick={() => navigate(`/applications/${id}`)}>
                  Save for later
                </button>
                <button className={styles.startBtn} onClick={() => setShowEquipment(true)}>
                  {isInProgress ? 'Resume assessment' : 'Start assessment'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Equipment check modal */}
      {showEquipment && (
        <EquipmentModal
          onClose={() => setShowEquipment(false)}
          onStart={() => {
            setShowEquipment(false);
            navigate(`/applications/${id}/assessment/run`);
          }}
        />
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function TopBar({ onBack, jobLabel }: { onBack: () => void; jobLabel: string }) {
  return (
    <div className={styles.topBar}>
      <button className={styles.backBtn} onClick={onBack}>
        <IconArrowLeft size={16} strokeWidth={2} />
      </button>
      {jobLabel && (
        <span className={styles.applyingFor}>
          Applying for: <strong>{jobLabel}</strong>
        </span>
      )}
    </div>
  );
}

function ExpectItem({
  Icon,
  label,
  desc,
}: {
  Icon: React.ElementType;
  label: string;
  desc: string;
}) {
  return (
    <div className={styles.expectItem}>
      <Icon size={16} strokeWidth={1.5} className={styles.expectIcon} />
      <div>
        <p className={styles.expectLabel}>{label}</p>
        <p className={styles.expectDesc}>{desc}</p>
      </div>
    </div>
  );
}

function MeasureItem({ type, text }: { type: 'check' | 'cross'; text: string }) {
  return (
    <div className={styles.measureItem}>
      {type === 'check'
        ? <IconCheck size={14} strokeWidth={2.5} className={styles.measureCheck} />
        : <IconX size={14} strokeWidth={2.5} className={styles.measureCross} />
      }
      <span className={styles.measureText}>{text}</span>
    </div>
  );
}
