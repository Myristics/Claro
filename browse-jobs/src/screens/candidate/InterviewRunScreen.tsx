import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconCheck } from '@tabler/icons-react';
import { useStore } from '../../store/useStore';
import { JOBS } from '../../data/mockData';
import styles from './InterviewRunScreen.module.css';

// ── Questions ──────────────────────────────────────────────────────────────

const QUESTIONS: string[] = [
  'Tell us about yourself and why you are interested in this position. What makes you the right fit for this role?',
  'Describe a situation where you had to make a high-stakes decision with incomplete information. How did you manage the risk?',
  'Walk us through a time when you had to work with a difficult team member or stakeholder. How did you resolve the situation?',
  'What is your greatest professional achievement? How did you accomplish it and what was the measurable impact?',
  'Where do you see yourself in five years, and how does this role align with your long-term career goals?',
];

const TOTAL = QUESTIONS.length;
const SECONDS_PER_QUESTION = 120; // 2 minutes

// ── Helpers ────────────────────────────────────────────────────────────────

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ── Main screen ────────────────────────────────────────────────────────────

export default function InterviewRunScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const application = useStore((s) => s.applications.find((a) => a.id === id));
  const advanceStage = useStore((s) => s.advanceStage);

  const job = application ? JOBS.find((j) => j.id === application.jobId) : undefined;

  const [currentQ, setCurrentQ] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);

  // Countdown timer
  useEffect(() => {
    if (completed) return;
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [completed, timeLeft]);

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(SECONDS_PER_QUESTION);
  }, [currentQ]);

  // ── Not found ────────────────────────────────────────────
  if (!application || !job) {
    return (
      <div className={styles.page}>
        <div className={styles.stateCenter}>
          <div className={styles.stateCard}>
            <p className={styles.stateTitle}>Interview not found</p>
            <p className={styles.stateBody}>
              This session has expired or the link is invalid.
            </p>
            <button className={styles.primaryBtn} onClick={() => navigate('/applications')}>
              Back to applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  function handleDone() {
    if (currentQ < TOTAL - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      advanceStage(application!.id, 'decision');
      setCompleted(true);
    }
  }

  // ── Completed state ──────────────────────────────────────
  if (completed) {
    return (
      <div className={styles.page}>
        <div className={styles.completedCenter}>
          <div className={styles.completedCard}>

            {/* Check ring */}
            <div className={styles.completedCheckRing}>
              <div className={styles.completedCheckIcon}>
                <IconCheck size={32} strokeWidth={3} />
              </div>
            </div>

            {/* Text */}
            <div className={styles.completedTextGroup}>
              <h2 className={styles.completedTitle}>AI Interview Completed!</h2>
              <p className={styles.completedBody}>
                Your Interview for <strong>{job.title}</strong> at{' '}
                <strong>{job.company}</strong> has been securely recorded. You have
                successfully completed this stage of your application.
              </p>
            </div>

            {/* Ref badge */}
            <div className={styles.refBadge}>Ref: #CLA-90281-UX</div>

            {/* Buttons */}
            <div className={styles.completedBtns}>
              <button
                className={styles.completedBtnPrimary}
                onClick={() => navigate('/applications')}
              >
                Do the next assessment
              </button>
              <button
                className={styles.completedBtnOutline}
                onClick={() => navigate('/applications')}
              >
                Back to dashboard
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ── Interview in progress ─────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <span className={styles.headerLabel}>AI Interview for:</span>
          <span className={styles.headerJob}>
            {job.title} at {job.company}
          </span>
        </div>
        <div className={styles.recordingBadge}>
          <span className={styles.recordDot} />
          <span className={styles.recordText}>Recording</span>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className={styles.body}>

        {/* Question column */}
        <div className={styles.questionContainer}>
          <p className={styles.questionNum}>
            QUESTION {currentQ + 1} OF {TOTAL}
          </p>
          <p className={styles.questionText}>"{QUESTIONS[currentQ]}"</p>
        </div>

        {/* Video + voiceprint column */}
        <div className={styles.videoContainer}>
          <div className={styles.video}>
            <div className={styles.videoPlaceholder} />
            <div className={styles.timerOverlay}>
              <span className={styles.timerText}>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className={styles.voiceprint}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={styles.voiceprintBar}
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        </div>

      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div className={styles.footer}>
        <button className={styles.doneBtn} onClick={handleDone}>
          Done Answering and Continue
        </button>
      </div>

    </div>
  );
}
