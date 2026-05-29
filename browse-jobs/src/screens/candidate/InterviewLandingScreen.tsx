import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  IconArrowLeft,
  IconCheck,
  IconX,
  IconCalendar,
  IconLock,
  IconCamera,
  IconMicrophone2,
  IconWifi,
} from '@tabler/icons-react';
import { JOBS } from '../../data/mockData';
import { useStore } from '../../store/useStore';
import styles from './InterviewLandingScreen.module.css';

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDeadline(dateStr: string): string {
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ', 23:59 WIB'
  );
}

function daysUntil(isoDate: string): number {
  const diff = new Date(isoDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ── Static content ─────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  { num: 1, title: 'See the question', desc: 'Read the prompt carefully.' },
  { num: 2, title: 'Time to think', desc: 'Take up to 30 seconds to prepare.' },
  { num: 3, title: 'Record answer', desc: 'Speak your response (up to 2 mins).' },
  { num: 4, title: 'Submit & Next', desc: 'Review your answer or move on.' },
];

const EVALUATES = [
  'Clarity of response structure',
  'Completeness of your answers',
  'Communication of your reasoning',
];

const NOT_JUDGES = [
  'Accent or speaking style',
  'Camera quality or room lighting',
  'Nervousness or body language',
];

// ── Equipment Check Modal ──────────────────────────────────────────────────

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
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Check your equipment before starting</h3>
            <p className={styles.modalSubtitle}>
              Please make sure all of your device aspect are ready.
            </p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            <IconX size={16} />
          </button>
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
              <button className={styles.retryBtn} onClick={retryCamera}>
                Retry
              </button>
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
              <span className={styles.equipDesc}>Connection stable</span>
            </div>
            <span className={styles.readyBadge}>Ready</span>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button className={styles.saveLaterBtn} onClick={onClose}>
            Save for later
          </button>
          <button
            className={styles.startBtn}
            disabled={camera !== 'ok'}
            onClick={onStart}
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}

// ── TopBar ─────────────────────────────────────────────────────────────────

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

// ── Main screen ────────────────────────────────────────────────────────────

export default function InterviewLandingScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stateOverride = searchParams.get('state');

  const application = useStore((s) => s.applications.find((a) => a.id === id));
  const [showEquipment, setShowEquipment] = useState(false);

  const job = application ? JOBS.find((j) => j.id === application.jobId) : null;
  const jobLabel = job ? `${job.title} at ${job.company}` : '';

  // ── Not found ────────────────────────────────────────────
  if (!application || !job) {
    return (
      <div className={styles.page}>
        <TopBar onBack={() => navigate('/applications')} jobLabel="" />
        <div className={styles.centerWrap}>
          <div className={styles.stateCard}>
            <div className={`${styles.stateIcon} ${styles.stateIconTeal}`}>
              <IconX size={28} strokeWidth={2} />
            </div>
            <p className={styles.stateTitle}>Interview not found</p>
            <p className={styles.stateBody}>
              This interview may have been removed or the link may be incorrect.
            </p>
            <button className={styles.ghostBtn} onClick={() => navigate('/applications')}>
              Back to my applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  const deadline = application.deadline;
  const isDeadlinePassed = daysUntil(deadline) < 0 || stateOverride === 'deadline';

  // ── Deadline passed ──────────────────────────────────────
  if (isDeadlinePassed) {
    return (
      <div className={styles.page}>
        <TopBar onBack={() => navigate('/applications')} jobLabel={jobLabel} />
        <div className={styles.centerWrap}>
          <div className={`${styles.stateCard} ${styles.stateCardWide}`}>
            <div className={`${styles.stateIcon} ${styles.stateIconTeal}`}>
              <IconX size={28} strokeWidth={2} />
            </div>
            <div className={styles.stateTextGroup}>
              <p className={styles.stateTitle}>The deadline for this interview has passed</p>
              <p className={styles.stateBody}>
                The AI Interview window for <strong>{job.title}</strong> at{' '}
                <strong>{job.company}</strong> closed on {formatDeadline(deadline)}. This step can
                no longer be completed. Your application status will be updated shortly.
              </p>
            </div>
            <button className={styles.ghostBtn} onClick={() => navigate('/applications')}>
              <IconArrowLeft size={16} strokeWidth={2} />
              Back to my applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Landing (default) ────────────────────────────────────
  return (
    <div className={styles.page}>
      <TopBar onBack={() => navigate('/applications')} jobLabel={jobLabel} />

      <div className={styles.body}>
        <div className={styles.inner}>
          <div className={styles.card}>
            <div className={styles.cardInner}>

              {/* Heading */}
              <div className={styles.headingSection}>
                <h1 className={styles.heading}>Ready for your AI interview?</h1>
                <p className={styles.subheading}>
                  You will respond to a few short questions on video. Take your time, as there is no
                  live audience and AI only evaluates your reasoning.
                </p>
              </div>

              {/* How it works */}
              <div className={styles.tipsContainer}>
                <div className={styles.tipsBox}>
                  <p className={styles.tipsTitle}>How it works</p>
                  <div className={styles.tipsList}>
                    {HOW_IT_WORKS.map(({ num, title, desc }) => (
                      <div key={num} className={styles.tipItem}>
                        <div className={styles.tipNum}>{num}</div>
                        <div className={styles.tipTextGroup}>
                          <span className={styles.tipTitle}>{title}</span>
                          <span className={styles.tipDesc}>{desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* What AI evaluates vs does not judge */}
              <div className={styles.measuresRow}>
                <div className={styles.measuresCol}>
                  <p className={styles.measuresTitle}>What the AI looks at</p>
                  <div className={styles.measuresList}>
                    {EVALUATES.map((item) => (
                      <div key={item} className={styles.measureItem}>
                        <IconCheck size={20} className={styles.measureCheck} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.measuresCol}>
                  <p className={styles.measuresTitle}>What this does not judge</p>
                  <div className={styles.measuresList}>
                    {NOT_JUDGES.map((item) => (
                      <div key={item} className={styles.measureItem}>
                        <IconX size={20} className={styles.measureClose} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Privacy notice */}
              <div className={styles.privacyBar}>
                <div className={styles.privacyBox}>
                  <IconLock size={16} className={styles.privacyIcon} />
                  <p className={styles.privacyText}>
                    <strong>Privacy &amp; Data Transparency:</strong>{' '}
                    AI only summarizes your key points. The final hiring decision is made 100% by
                    human recruiters.
                  </p>
                </div>
              </div>

              {/* Navigation row */}
              <div className={styles.navBar}>
                <div className={styles.navLeft}>
                  <IconCalendar size={16} className={styles.navIcon} />
                  <span className={styles.navDeadlineLabel}>Deadline:</span>
                  <span className={styles.navDeadlineValue}>{formatDeadline(deadline)}</span>
                </div>
                <div className={styles.navRight}>
                  <button
                    className={styles.saveLaterBtnOutline}
                    onClick={() => navigate('/applications')}
                  >
                    Save for later
                  </button>
                  <button
                    className={styles.startAssessmentBtn}
                    onClick={() => setShowEquipment(true)}
                  >
                    Start assessment
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {showEquipment && (
        <EquipmentModal
          onClose={() => setShowEquipment(false)}
          onStart={() => {
            setShowEquipment(false);
            navigate(`/applications/${id}/interview/run`);
          }}
        />
      )}
    </div>
  );
}
