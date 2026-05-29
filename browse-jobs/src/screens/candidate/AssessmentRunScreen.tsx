import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  IconArrowLeft,
  IconArrowRight,
  IconFlag,
  IconX,
  IconAlertCircle,
  IconPlayerPause,
  IconInfoCircle,
  IconWifi,
  IconRefresh,
} from '@tabler/icons-react';
import { useStore } from '../../store/useStore';
import type { AssessmentType } from '../../store/types';
import styles from './AssessmentRunScreen.module.css';

// ── Question types ─────────────────────────────────────────────────────────

interface MCQQuestion {
  kind: 'mcq';
  text: string;
  options: string[];
}

interface LikertQuestion {
  kind: 'likert';
  text: string;
}

interface OpenQuestion {
  kind: 'open';
  text: string;
}

interface NumericQuestion {
  kind: 'numeric';
  text: string;
  placeholder?: string;
}

type Question = MCQQuestion | LikertQuestion | OpenQuestion | NumericQuestion;

// ── Question banks ─────────────────────────────────────────────────────────

const COGNITIVE_QUESTIONS: Question[] = [
  {
    kind: 'mcq',
    text: 'Which number comes next in the sequence: 2, 4, 8, 16, ___?',
    options: ['18', '24', '32', '64'],
  },
  {
    kind: 'mcq',
    text: 'If all Bloops are Razzles and all Razzles are Lazzles, then all Bloops are definitely…',
    options: ['Razzles only', 'Lazzles', 'Neither', 'Cannot be determined'],
  },
  {
    kind: 'mcq',
    text: 'Which shape completes the pattern: circle, square, triangle, circle, square, ___?',
    options: ['Circle', 'Square', 'Triangle', 'Diamond'],
  },
  {
    kind: 'mcq',
    text: 'A store reduces a price by 20%, then increases the result by 20%. The final price compared to the original is…',
    options: ['The same', '4% less', '4% more', '40% less'],
  },
  {
    kind: 'mcq',
    text: 'Which word is the odd one out: Symphony, Sonata, Fresco, Concerto?',
    options: ['Symphony', 'Sonata', 'Fresco', 'Concerto'],
  },
  {
    kind: 'mcq',
    text: 'If it takes 5 machines 5 minutes to make 5 widgets, how long does it take 100 machines to make 100 widgets?',
    options: ['100 minutes', '5 minutes', '20 minutes', '1 minute'],
  },
  {
    kind: 'mcq',
    text: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?',
    options: ['$0.10', '$0.05', '$0.15', '$0.01'],
  },
  {
    kind: 'mcq',
    text: 'Which of the following is always odd? A: The sum of two odd numbers. B: The product of two odd numbers. C: The sum of an odd and even number.',
    options: ['A only', 'B only', 'C only', 'B and C'],
  },
  {
    kind: 'numeric',
    text: 'A tech company notes that out of 100 new employees, 60% come from a computer science background, and 40% from a design background. If 25% of those designers also possess basic coding skills, what is the probability of randomly selecting a designer who does NOT have coding skills from the entire pool of new employees? Enter your answer as a whole number percentage.',
    placeholder: 'Enter a whole number',
  },
  {
    kind: 'mcq',
    text: 'In a race, you overtake the person in second place. What place are you in now?',
    options: ['First place', 'Second place', 'Third place', 'Cannot be determined'],
  },
  {
    kind: 'numeric',
    text: 'A water tank is 3/4 full. After removing 12 litres it is 2/3 full. What is the total capacity of the tank in litres?',
    placeholder: 'Enter a whole number',
  },
  {
    kind: 'mcq',
    text: 'Which of these is a logical conclusion: "All swans I have seen are white. Therefore all swans are white."',
    options: [
      'Valid deductive reasoning',
      'Invalid — relies on inductive generalisation',
      'Valid inductive reasoning',
      'Invalid — swans can be any colour',
    ],
  },
];

const PERSONALITY_QUESTIONS: Question[] = [
  { kind: 'likert', text: 'I enjoy working in collaborative, team-oriented environments.' },
  { kind: 'likert', text: 'I prefer to plan tasks thoroughly before starting them.' },
  { kind: 'likert', text: 'I am comfortable adapting when priorities change unexpectedly.' },
  { kind: 'likert', text: 'I find it energising to interact with a large number of people each day.' },
  { kind: 'likert', text: 'I tend to take the lead when working in a group setting.' },
  { kind: 'likert', text: 'I feel satisfied when I deliver work that exceeds expectations.' },
  { kind: 'likert', text: 'I prefer clear structure and defined processes over open-ended exploration.' },
  { kind: 'likert', text: 'I am able to manage multiple competing tasks without feeling overwhelmed.' },
];

const TECHNICAL_QUESTIONS: Question[] = [
  {
    kind: 'mcq',
    text: 'What does Big O notation measure in an algorithm?',
    options: [
      'The exact runtime in milliseconds',
      'The amount of memory used',
      'How runtime or space scales with input size',
      'The number of lines of code',
    ],
  },
  {
    kind: 'mcq',
    text: 'In SQL, which clause filters records after a GROUP BY has been applied?',
    options: ['WHERE', 'HAVING', 'FILTER', 'SELECT'],
  },
  {
    kind: 'mcq',
    text: 'Which data structure uses LIFO (Last In, First Out) ordering?',
    options: ['Queue', 'Stack', 'Linked list', 'Heap'],
  },
  {
    kind: 'mcq',
    text: 'What is the primary purpose of an index in a relational database?',
    options: [
      'To enforce referential integrity',
      'To speed up data retrieval queries',
      'To compress table data',
      'To prevent duplicate rows',
    ],
  },
  {
    kind: 'mcq',
    text: 'Which HTTP status code indicates that a resource was successfully created?',
    options: ['200 OK', '204 No Content', '201 Created', '301 Moved Permanently'],
  },
  {
    kind: 'mcq',
    text: 'In React, what is the correct hook to run a side effect after every render?',
    options: [
      'useCallback',
      'useMemo',
      'useEffect',
      'useRef',
    ],
  },
  {
    kind: 'mcq',
    text: 'Which CSS property controls the stacking order of positioned elements?',
    options: ['stack-order', 'z-index', 'position', 'layer'],
  },
  {
    kind: 'mcq',
    text: 'What does REST stand for?',
    options: [
      'Remote Execution State Transfer',
      'Representational State Transfer',
      'Resource Entity State Transfer',
      'Remote Entity Service Transfer',
    ],
  },
];

const INTERVIEW_QUESTIONS: Question[] = [
  {
    kind: 'open',
    text: 'Tell us about a time you worked under significant pressure. What did you do and what was the outcome?',
  },
  {
    kind: 'open',
    text: 'Describe a situation where you had to collaborate with a difficult colleague or stakeholder. How did you handle it?',
  },
  {
    kind: 'open',
    text: 'What motivates you in your work, and how does this role align with those motivations?',
  },
  {
    kind: 'open',
    text: 'Describe a project you are most proud of. What made it successful and what would you do differently?',
  },
];

const QUESTION_BANKS: Record<AssessmentType, Question[]> = {
  cognitive: COGNITIVE_QUESTIONS,
  personality: PERSONALITY_QUESTIONS,
  technical: TECHNICAL_QUESTIONS,
  interview: INTERVIEW_QUESTIONS,
};

// ── Assessment labels ──────────────────────────────────────────────────────

const ASSESSMENT_LABELS: Record<AssessmentType, string> = {
  cognitive: 'Cognitive Assessment',
  personality: 'Personality Profile',
  technical: 'Technical Aptitude',
  interview: 'Interview Questions',
};

// ── Helpers ────────────────────────────────────────────────────────────────

function isValidType(type: string | null): type is AssessmentType {
  return (
    type === 'cognitive' ||
    type === 'personality' ||
    type === 'technical' ||
    type === 'interview'
  );
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function wordCount(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

function deriveScore(assessmentId: string): number {
  let hash = 0;
  for (let i = 0; i < assessmentId.length; i++) {
    hash = ((hash << 5) - hash + assessmentId.charCodeAt(i)) | 0;
  }
  return 60 + (Math.abs(hash) % 31);
}

// Upload status messages keyed by progress band
function uploadStatusLabel(pct: number): string {
  if (pct < 30) return 'Chunking your answer...';
  if (pct < 60) return 'Encrypting data...';
  if (pct < 90) return 'Uploading securely...';
  return 'Finalising...';
}

// ── Main screen ────────────────────────────────────────────────────────────

export default function AssessmentRunScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const rawAssessmentId = searchParams.get('assessmentId') ?? '';
  const rawTypeParam = searchParams.get('type');

  const application = useStore((s) => s.applications.find((a) => a.id === id));
  const completeAssessment = useStore((s) => s.completeAssessment);

  // If query params are absent, fall back to the first incomplete assessment
  const pendingAssessment = application?.assessments.find((a) => !a.completed);
  const assessmentId = rawAssessmentId || pendingAssessment?.id || '';
  const typeParam = rawTypeParam ?? pendingAssessment?.type ?? null;
  const assessmentType: AssessmentType | null = isValidType(typeParam) ? typeParam : null;

  const assessment = application?.assessments.find((a) => a.id === assessmentId);

  // ── Local state ────────────────────────────────────────────────────────
  const [currentQ, setCurrentQ] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>({});
  const [likertAnswers, setLikertAnswers] = useState<Record<number, number>>({});
  const [openAnswers, setOpenAnswers] = useState<Record<number, string>>({});
  const [numericAnswers, setNumericAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());

  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [connectionLost, setConnectionLost] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitError, setSubmitError] = useState(false);

  // Timer
  const initialSeconds = (assessment?.duration ?? 25) * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (showPauseModal || showSubmitModal || uploading) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [showPauseModal, showSubmitModal, uploading]);

  // ── Guard ──────────────────────────────────────────────────────────────
  if (!application || !assessmentType || !assessmentId) {
    return (
      <div className={styles.notFoundPage}>
        <div className={styles.notFoundCard}>
          <div className={styles.notFoundIconWrap}>
            <IconAlertCircle size={28} strokeWidth={2} />
          </div>
          <p className={styles.notFoundTitle}>Assessment not found</p>
          <p className={styles.notFoundBody}>
            This assessment link is invalid or the session has expired.
            Return to your applications to try again.
          </p>
          <button
            className={styles.backBtn}
            onClick={() => navigate(`/applications/${id ?? ''}`)}
          >
            Back to applications
          </button>
        </div>
      </div>
    );
  }

  const questions = QUESTION_BANKS[assessmentType];
  const totalQ = questions.length;
  const question = questions[currentQ];
  const isLastQuestion = currentQ === totalQ - 1;

  // ── Answer helpers ─────────────────────────────────────────────────────

  function isAnswered(idx: number): boolean {
    const q = questions[idx];
    if (q.kind === 'mcq') return mcqAnswers[idx] !== undefined;
    if (q.kind === 'likert') return likertAnswers[idx] !== undefined;
    if (q.kind === 'open') return wordCount(openAnswers[idx] ?? '') >= 1;
    if (q.kind === 'numeric') return (numericAnswers[idx] ?? '').trim().length > 0;
    return false;
  }

  function canProceed(): boolean {
    if (question.kind === 'mcq') return mcqAnswers[currentQ] !== undefined;
    if (question.kind === 'likert') return likertAnswers[currentQ] !== undefined;
    if (question.kind === 'open') return wordCount(openAnswers[currentQ] ?? '') >= 10;
    if (question.kind === 'numeric') return (numericAnswers[currentQ] ?? '').trim().length > 0;
    return false;
  }

  const answeredCount = questions.filter((_, i) => isAnswered(i)).length;
  const unansweredCount = totalQ - answeredCount;

  // ── Flag toggle ────────────────────────────────────────────────────────
  function toggleFlag() {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentQ)) {
        next.delete(currentQ);
      } else {
        next.add(currentQ);
      }
      return next;
    });
  }

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    setShowSubmitModal(false);
    setUploading(true);
    setUploadProgress(0);

    // Animate progress bar
    let pct = 0;
    const ticker = setInterval(() => {
      pct += Math.random() * 18 + 8;
      if (pct >= 100) {
        pct = 100;
        clearInterval(ticker);
        setUploadProgress(100);

        setTimeout(() => {
          try {
            const score =
              assessmentType === 'cognitive' || assessmentType === 'technical'
                ? deriveScore(assessmentId)
                : undefined;
            completeAssessment(id!, assessmentId, score);
            navigate(
              `/applications/${id}/assessment/complete?type=${assessmentType}`,
            );
          } catch {
            setUploading(false);
            setSubmitError(true);
          }
        }, 400);
      } else {
        setUploadProgress(pct);
      }
    }, 280);
  }, [assessmentId, assessmentType, completeAssessment, id, navigate]);

  // ── Uploading screen ───────────────────────────────────────────────────
  if (uploading) {
    return (
      <div className={styles.uploadPage}>
        <p className={styles.uploadTitle}>Uploading your assessment</p>
        <p className={styles.uploadSubtitle}>This usually takes about 10 seconds.</p>
        <div className={styles.progressBarWrap}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
        <p className={styles.uploadStatus}>{uploadStatusLabel(uploadProgress)}</p>
      </div>
    );
  }

  // ── Submit error screen ────────────────────────────────────────────────
  if (submitError) {
    return (
      <div className={styles.errorPage}>
        <div className={styles.errorCard}>
          <div className={styles.errorIconWrap}>
            <IconAlertCircle size={28} strokeWidth={2} />
          </div>
          <p className={styles.errorTitle}>Your assessment could not be submitted.</p>
          <p className={styles.errorBody}>
            Check your connection and try again. There may be a temporary connection
            issue. Do not worry, your answers are saved locally and will not be lost.
          </p>
          <button
            className={styles.retryBtn}
            onClick={() => {
              setSubmitError(false);
              handleSubmit();
            }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ── Render question content ────────────────────────────────────────────
  function renderQuestion() {
    if (question.kind === 'mcq') {
      return (
        <ul className={styles.optionList}>
          {question.options.map((opt) => {
            const selected = mcqAnswers[currentQ] === opt;
            return (
              <li key={opt}>
                <button
                  className={`${styles.optionItem} ${selected ? styles.optionItemSelected : ''}`}
                  onClick={() =>
                    setMcqAnswers((prev) => ({ ...prev, [currentQ]: opt }))
                  }
                >
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
      );
    }

    if (question.kind === 'likert') {
      const selected = likertAnswers[currentQ];
      return (
        <div className={styles.likertWrap}>
          <div className={styles.likertButtons}>
            {([1, 2, 3, 4, 5] as const).map((val) => (
              <button
                key={val}
                className={`${styles.likertBtn} ${selected === val ? styles.likertBtnSelected : ''}`}
                onClick={() =>
                  setLikertAnswers((prev) => ({ ...prev, [currentQ]: val }))
                }
              >
                {val}
              </button>
            ))}
          </div>
          <div className={styles.likertEndLabels}>
            <span className={styles.likertEndLabel}>Strongly disagree</span>
            <span className={styles.likertEndLabel}>Strongly agree</span>
          </div>
        </div>
      );
    }

    if (question.kind === 'open') {
      const val = openAnswers[currentQ] ?? '';
      const wc = wordCount(val);
      return (
        <div className={styles.textareaWrap}>
          <textarea
            className={styles.textarea}
            placeholder="Type your response here…"
            value={val}
            onChange={(e) =>
              setOpenAnswers((prev) => ({ ...prev, [currentQ]: e.target.value }))
            }
          />
          <div className={styles.textareaFooter}>
            <span className={styles.textareaHint}>Min. 50 words recommended</span>
            <span className={styles.textareaCount}>{wc} words</span>
          </div>
        </div>
      );
    }

    if (question.kind === 'numeric') {
      return (
        <div className={styles.numericWrap}>
          <input
            type="text"
            inputMode="numeric"
            className={styles.numericInput}
            placeholder={question.placeholder ?? 'Enter a number'}
            value={numericAnswers[currentQ] ?? ''}
            onChange={(e) =>
              setNumericAnswers((prev) => ({ ...prev, [currentQ]: e.target.value }))
            }
          />
        </div>
      );
    }

    return null;
  }

  return (
    <div className={styles.page}>
      {/* ── Pause modal ─────────────────────────────────────────────────── */}
      {showPauseModal && (
        <div className={styles.backdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderText}>
                <p className={styles.modalTitle}>Pause your assessment?</p>
                <p className={styles.modalSubtitle}>
                  You can resume later, but the timer will continue running while
                  paused. Make sure you have enough time remaining before you return.
                </p>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setShowPauseModal(false)}
              >
                <IconX size={14} />
              </button>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalGhostBtn}
                onClick={() => {
                  setShowPauseModal(false);
                  navigate(`/applications/${id}/assessment?state=paused`);
                }}
              >
                Pause
              </button>
              <button
                className={styles.modalTealBtn}
                onClick={() => setShowPauseModal(false)}
              >
                Keep Going
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Submit confirmation modal ────────────────────────────────────── */}
      {showSubmitModal && (
        <div className={styles.backdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderText}>
                <p className={styles.modalTitle}>Submit your assessment?</p>
                <p className={styles.modalSubtitle}>
                  You will not be able to change your answers after submission.
                </p>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setShowSubmitModal(false)}
              >
                <IconX size={14} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.statsRow}>
                <span className={styles.statsLabel}>Questions answered</span>
                <span className={styles.statsValue}>
                  {answeredCount} of {totalQ}
                </span>
              </div>
              <div className={styles.statsRow}>
                <span className={styles.statsLabel}>Flagged for review</span>
                <span className={styles.statsValue}>{flagged.size} questions</span>
              </div>
              {unansweredCount > 0 && (
                <div className={styles.warnBanner}>
                  <IconInfoCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>
                    {unansweredCount} question{unansweredCount > 1 ? 's are' : ' is'} unanswered.
                    You can still go back and answer them.
                  </span>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalGhostBtn}
                onClick={() => setShowSubmitModal(false)}
              >
                Review answers
              </button>
              <button className={styles.modalTealBtn} onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Connection-lost banner ──────────────────────────────────────── */}
      {connectionLost && (
        <div className={styles.connectionBanner}>
          <span className={styles.connectionMsg}>
            <IconWifi size={15} style={{ flexShrink: 0 }} />
            Connection lost — your progress is saved. Reconnect to continue.
          </span>
          <button
            className={styles.retryBtnInline}
            onClick={() => setConnectionLost(false)}
          >
            <IconRefresh size={13} />
            Retry
          </button>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.brand}>
            Claro<span className={styles.brandDot}>°</span>
          </span>
          <span className={styles.headerDivider} />
          <span className={styles.assessmentLabel}>
            {ASSESSMENT_LABELS[assessmentType]}
          </span>
        </div>

        <div className={styles.headerCenter}>
          Question {currentQ + 1} of {totalQ}
        </div>

        <div className={styles.headerRight}>
          <span className={styles.recordingBadge}>
            <span className={styles.recDot} />
            Recording
          </span>
          <span className={styles.timer}>{formatTime(secondsLeft)}</span>
          <button
            className={styles.pauseBtn}
            onClick={() => setShowPauseModal(true)}
          >
            <IconPlayerPause size={12} />
            Pause
          </button>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className={styles.body}>
        {/* Content */}
        <main className={styles.content}>
          <div className={styles.questionBlock}>
            <span className={styles.questionLabel}>Question {currentQ + 1}</span>
            <p className={styles.questionText}>{question.text}</p>
            {renderQuestion()}
          </div>
        </main>

        {/* Question navigator */}
        <aside className={styles.navigator}>
          <span className={styles.navigatorTitle}>Question Navigator</span>
          <div className={styles.navGrid}>
            {questions.map((_, i) => {
              const isCurrent = i === currentQ;
              const isFlagged = flagged.has(i);
              const answered = isAnswered(i);

              let cls = styles.navBtn;
              if (isCurrent) cls += ` ${styles.navBtnCurrent}`;
              else if (isFlagged) cls += ` ${styles.navBtnFlagged}`;
              else if (answered) cls += ` ${styles.navBtnAnswered}`;

              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => setCurrentQ(i)}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div>
          {currentQ > 0 && (
            <button
              className={styles.prevBtn}
              onClick={() => setCurrentQ((q) => q - 1)}
            >
              <IconArrowLeft size={14} />
              Previous Question
            </button>
          )}
        </div>

        <div className={styles.footerRight}>
          <button
            className={`${styles.flagBtn} ${flagged.has(currentQ) ? styles.flagBtnActive : ''}`}
            onClick={toggleFlag}
          >
            <IconFlag size={13} />
            {flagged.has(currentQ) ? 'Flagged' : 'Flag this question'}
          </button>

          {!isLastQuestion && (
            <button
              className={styles.nextBtn}
              disabled={!canProceed()}
              onClick={() => setCurrentQ((q) => q + 1)}
            >
              Next question
              <IconArrowRight size={14} />
            </button>
          )}

          {isLastQuestion && (
            <button
              className={styles.nextBtn}
              onClick={() => setShowSubmitModal(true)}
            >
              Submit assessment
              <IconArrowRight size={14} />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
