import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  IconAlertCircle,
  IconCheck,
  IconMessageCircle,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useStore } from '../../store/useStore';
import { JOBS } from '../../data/mockData';
import type { AssessmentType } from '../../store/types';
import styles from './AssessmentCompleteScreen.module.css';

// ── Helpers ────────────────────────────────────────────────────────────────

const ASSESSMENT_NAMES: Partial<Record<AssessmentType, string>> = {
  cognitive: 'Cognitive Reasoning',
  personality: 'Personality Profile',
  technical: 'Technical Aptitude',
  interview: 'Interview',
};

function generateRef(applicationId: string, type: string): string {
  let hash = 0;
  const str = applicationId + type;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  const num = Math.abs(hash) % 100000;
  return `#CLA-${String(num).padStart(5, '0')}-UX`;
}

// ── Main screen ────────────────────────────────────────────────────────────

export default function AssessmentCompleteScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const completedType = searchParams.get('type') as AssessmentType | null;

  const application = useStore((s) => s.applications.find((a) => a.id === id));

  // ── Not found ──────────────────────────────────────────────────────────
  if (!application) {
    return (
      <div className={styles.notFoundPage}>
        <div className={styles.notFoundCard}>
          <div className={styles.notFoundIconWrap}>
            <IconAlertCircle size={28} strokeWidth={2} />
          </div>
          <p className={styles.notFoundTitle}>Application not found</p>
          <p className={styles.notFoundBody}>
            This application may have been removed or the link may be incorrect.
            Return to your applications list to find the one you are looking for.
          </p>
          <button
            className={styles.notFoundBtn}
            onClick={() => navigate('/applications')}
          >
            Back to my applications
          </button>
        </div>
      </div>
    );
  }

  const { assessmentProgress, insightUnlocked, id: appId, jobId } = application;
  const allComplete = assessmentProgress === 100;

  const job = JOBS.find((j) => j.id === jobId);
  const jobTitle = job?.title ?? 'this role';
  const company = job?.company ?? 'the company';

  const assessmentName = completedType ? ASSESSMENT_NAMES[completedType] : null;
  const refCode = generateRef(appId, completedType ?? 'general');

  // ── Remaining assessments ──────────────────────────────────────────────
  const nextAssessment = application.assessments.find((a) => !a.completed);

  function handleNextAssessment() {
    if (nextAssessment) {
      navigate(
        `/applications/${id}/assessment/run?assessmentId=${nextAssessment.id}&type=${nextAssessment.type}`,
      );
    } else {
      navigate(`/applications/${id}/assessment`);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.card}>
          {/* ── Check icon ─────────────────────────────────────────────── */}
          <div className={styles.iconContainer}>
            <div className={styles.iconInner}>
              <IconCheck size={36} strokeWidth={2.5} />
            </div>
          </div>

          {/* ── Title + description ─────────────────────────────────────── */}
          <div className={styles.textBlock}>
            <h1 className={styles.title}>Assessment Submitted!</h1>
            <p className={styles.description}>
              Your{' '}
              {assessmentName && <strong>{assessmentName}</strong>}
              {!assessmentName && 'assessment'}{' '}
              Assessment for <strong>{jobTitle}</strong> at{' '}
              <strong>{company}</strong> has been securely recorded. You have
              successfully completed this stage of your application.
            </p>
          </div>

          {/* ── Ref badge ──────────────────────────────────────────────── */}
          <div className={styles.refBadge}>Ref: {refCode}</div>

          {/* ── Progress block (if all complete) ────────────────────────── */}
          {allComplete && (
            <div className={styles.progressBlock}>
              <p className={styles.progressLabel}>All assessments complete</p>
              <div className={styles.progressBarWrap}>
                <div className={styles.progressBarFill} style={{ width: '100%' }} />
              </div>
              <span className={styles.progressPct}>100% complete</span>
            </div>
          )}

          {/* ── Insight not yet available info ───────────────────────────── */}
          {allComplete && !insightUnlocked && (
            <div className={styles.infoBanner}>
              <IconInfoCircle size={16} className={styles.infoIcon} />
              <span>
                Your Insight Report will be available once the application window
                closes and all candidates have been assessed.
              </span>
            </div>
          )}

          {/* ── Buttons ────────────────────────────────────────────────── */}
          <div className={styles.btnGroup}>
            {allComplete && insightUnlocked && (
              <button
                className={styles.btnPrimary}
                onClick={() => navigate(`/applications/${id}/insight`)}
              >
                View Insight Report
              </button>
            )}

            {!allComplete && (
              <button className={styles.btnPrimary} onClick={handleNextAssessment}>
                Do the next assessment
              </button>
            )}

            <button
              className={styles.btnGhostTeal}
              onClick={() => navigate('/applications')}
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>

      {/* ── FAB chat button ───────────────────────────────────────────────── */}
      <button
        className={styles.fab}
        onClick={() => navigate('/conversations')}
        aria-label="Open chat"
      >
        <IconMessageCircle size={22} strokeWidth={1.75} />
      </button>
    </div>
  );
}
