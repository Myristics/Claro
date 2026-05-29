import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
  IconUpload,
  IconInfoCircle,
  IconAlertCircle,
  IconX,
} from '@tabler/icons-react';
import { JOBS } from '../../data/mockData';
import { useStore } from '../../store/useStore';
import styles from './ApplicationFormScreen.module.css';

// ── Types ──────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

interface S1 { fullName: string; email: string; phone: string; location: string; currentRole: string; }
interface S1Errors { fullName?: string; email?: string; phone?: string; location?: string; currentRole?: string; }
interface S2 { portfolioUrl: string; yearsOfExp: string; noticePeriod: string; }
interface S3 { answer1: string; answer2: string; }

// ── Constants ─────────────────────────────────────────────────────────────

const LOCATIONS = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Depok', 'Tangerang', 'Other'];
const YEARS_EXP = ['Less than 1 year', '1–2 years', '3–5 years', '5–8 years', '8–10 years', '10+ years'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const STEP_TITLES = ['Personal Information', 'Resume & Experience', 'Role-specific Questions'];
const NEXT_HINTS  = ['Next: Resume & Portfolio', 'Next: Role-specific', 'Almost done!'];

// ── Helpers ───────────────────────────────────────────────────────────────

function validateS1(d: S1): S1Errors {
  const e: S1Errors = {};
  if (!d.fullName.trim())   e.fullName   = 'This field is required';
  if (!d.email.trim())      e.email      = 'This field is required';
  if (!d.phone.trim())      e.phone      = 'This field is required';
  if (!d.location)          e.location   = 'This field is required';
  if (!d.currentRole.trim()) e.currentRole = 'This field is required';
  return e;
}

// ── FormField ─────────────────────────────────────────────────────────────

function FormField({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>
        {label}{required && <span className={styles.req}>*</span>}
      </label>
      {children}
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────

export default function ApplicationFormScreen() {
  const { id: jobId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const submitApplication = useStore((s) => s.submitApplication);
  const job = JOBS.find((j) => j.id === jobId);

  // ── State ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>(1);
  const [showExitModal, setShowExitModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Step 1
  const [s1, setS1] = useState<S1>({
    fullName: 'Ahmad Azza',
    email: 'azza@webrocket.app',
    phone: '+628123565',
    location: '',
    currentRole: '',
  });
  const [s1Errors, setS1Errors] = useState<S1Errors>({});

  // Step 2
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [s2, setS2] = useState<S2>({ portfolioUrl: '', yearsOfExp: '', noticePeriod: '' });

  // Step 3
  const [s3, setS3] = useState<S3>({ answer1: '', answer2: '' });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Navigate after submit
  useEffect(() => {
    if (submitted) navigate('/applications');
  }, [submitted, navigate]);

  // ── Computed ───────────────────────────────────────────────────────────
  const s1Ready = !!(s1.fullName.trim() && s1.email.trim() && s1.phone.trim() && s1.location && s1.currentRole.trim());
  const s2Ready = !!(resumeFile && !fileError && s2.yearsOfExp && s2.noticePeriod.trim());
  const s3Ready = !!(s3.answer1.trim() && s3.answer2.trim());

  const nextDisabled =
    (step === 1 && !s1Ready) ||
    (step === 2 && !s2Ready) ||
    (step === 3 && (!s3Ready || submitting));

  const progressPct = step === 1 ? 33.33 : step === 2 ? 66.67 : 100;

  // ── File handling ──────────────────────────────────────────────────────
  function handleFileSelect(file: File) {
    if (file.size > MAX_FILE_SIZE) {
      setFileError('File is too large. Max is 5MB. Try upload again');
      setResumeFile(null);
    } else {
      setResumeFile(file);
      setFileError(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // ── Navigation ─────────────────────────────────────────────────────────
  function handleNext() {
    if (step === 1) {
      const errs = validateS1(s1);
      if (Object.keys(errs).length) { setS1Errors(errs); return; }
      setS1Errors({});
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2) {
      setStep(3);
      window.scrollTo(0, 0);
    } else {
      if (!jobId) return;
      setSubmitting(true);
      setSubmitError(null);
      setTimeout(() => {
        try {
          submitApplication(jobId);
          setSubmitted(true);
        } catch {
          setSubmitError(
            'Your application could not be submitted. There may be a temporary connection issue. Check your network and try again.',
          );
        } finally {
          setSubmitting(false);
        }
      }, 500);
    }
  }

  function handleBack() {
    if (step === 1) setShowExitModal(true);
    else setStep((p) => (p - 1) as Step);
  }

  function handleSaveExit() {
    setShowExitModal(false);
    navigate('/applications');
  }

  // ── Job not found ──────────────────────────────────────────────────────
  if (!job) {
    return (
      <div className={styles.page}>
        <div className={styles.topBar}>
          <span className={styles.applyingFor}>Job not found</span>
          <button className={styles.saveExitBtn} onClick={() => navigate('/jobs')}>
            Browse jobs <IconArrowUpRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <span className={styles.applyingFor}>
          Applying for:{' '}
          <strong>{job.title} at {job.company}</strong>
        </span>
        <button className={styles.saveExitBtn} onClick={() => setShowExitModal(true)}>
          Save and exit <IconArrowUpRight size={14} strokeWidth={2} />
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className={styles.body}>
        <div className={styles.inner}>

          {/* Progress */}
          <div className={styles.progressSection}>
            <div className={styles.progressRow}>
              <span className={styles.stepCount}>Step {step} of 3</span>
              <span className={`${styles.nextHint} ${step === 3 ? styles.nextHintTeal : ''}`}>
                {NEXT_HINTS[step - 1]}
              </span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {/* Autofill info banner — Step 1 only */}
          {step === 1 && (
            <div className={styles.infoBanner}>
              <IconInfoCircle size={16} className={styles.infoBannerIcon} />
              <span>Fields filled from your profile. Review and edit if needed.</span>
            </div>
          )}

          {/* Submit error banner — Step 3 */}
          {step === 3 && submitError && (
            <div className={styles.errorBanner}>
              <IconAlertCircle size={16} className={styles.errorBannerIcon} />
              <span>
                Your application could not be submitted. There may be a temporary connection issue.{' '}
                <button
                  className={styles.errorBannerLink}
                  onClick={() => setSubmitError(null)}
                >
                  Check your network and try again.
                </button>
              </span>
            </div>
          )}

          {/* Card */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{STEP_TITLES[step - 1]}</h2>

              {/* ── Step 1 ── */}
              {step === 1 && (
                <>
                  <FormField label="Full name" required error={s1Errors.fullName}>
                    <input
                      className={`${styles.input} ${s1Errors.fullName ? styles.inputError : ''}`}
                      placeholder="E.g. John Doe"
                      value={s1.fullName}
                      onChange={(e) => { setS1((p) => ({ ...p, fullName: e.target.value })); setS1Errors((p) => ({ ...p, fullName: undefined })); }}
                    />
                  </FormField>

                  <FormField label="Email address" required error={s1Errors.email}>
                    <input
                      className={`${styles.input} ${s1Errors.email ? styles.inputError : ''}`}
                      type="email"
                      placeholder="E.g. Johndoe@gmail.com"
                      value={s1.email}
                      onChange={(e) => { setS1((p) => ({ ...p, email: e.target.value })); setS1Errors((p) => ({ ...p, email: undefined })); }}
                    />
                  </FormField>

                  <FormField label="Phone number" required error={s1Errors.phone}>
                    <input
                      className={`${styles.input} ${s1Errors.phone ? styles.inputError : ''}`}
                      placeholder="E.g. +62123123123"
                      value={s1.phone}
                      onChange={(e) => { setS1((p) => ({ ...p, phone: e.target.value })); setS1Errors((p) => ({ ...p, phone: undefined })); }}
                    />
                  </FormField>

                  <FormField label="Location" required error={s1Errors.location}>
                    <div className={styles.selectWrap}>
                      <select
                        className={`${styles.select} ${s1Errors.location ? styles.inputError : ''}`}
                        value={s1.location}
                        onChange={(e) => { setS1((p) => ({ ...p, location: e.target.value })); setS1Errors((p) => ({ ...p, location: undefined })); }}
                      >
                        <option value="">E.g. Jakarta</option>
                        {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </FormField>

                  <FormField label="Current role" required error={s1Errors.currentRole}>
                    <input
                      className={`${styles.input} ${s1Errors.currentRole ? styles.inputError : ''}`}
                      placeholder="E.g. Product Designer"
                      value={s1.currentRole}
                      onChange={(e) => { setS1((p) => ({ ...p, currentRole: e.target.value })); setS1Errors((p) => ({ ...p, currentRole: undefined })); }}
                    />
                  </FormField>
                </>
              )}

              {/* ── Step 2 ── */}
              {step === 2 && (
                <>
                  <FormField label="Upload resume" required>
                    <>
                      <div
                        className={`${styles.uploadZone} ${dragOver ? styles.uploadZoneDrag : ''} ${fileError ? styles.uploadZoneErr : ''} ${resumeFile && !fileError ? styles.uploadZoneFilled : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFileSelect(f); }}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.docx"
                          style={{ display: 'none' }}
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                        />
                        <IconUpload size={20} strokeWidth={1.5} className={styles.uploadIcon} />
                        {resumeFile && !fileError ? (
                          <span className={styles.uploadFileName}>{resumeFile.name}</span>
                        ) : (
                          <span className={styles.uploadText}>
                            Drag your file or <span className={styles.uploadBrowse}>Browse</span>
                          </span>
                        )}
                      </div>
                      {fileError
                        ? <span className={styles.fileErr}>{fileError}</span>
                        : <span className={styles.uploadHint}>PDF or DOCX up to 5MB</span>
                      }
                    </>
                  </FormField>

                  <FormField label="Portfolio URL">
                    <input
                      className={styles.input}
                      placeholder="https://"
                      value={s2.portfolioUrl}
                      onChange={(e) => setS2((p) => ({ ...p, portfolioUrl: e.target.value }))}
                    />
                  </FormField>

                  <FormField label="Years of experience" required>
                    <div className={styles.selectWrap}>
                      <select
                        className={styles.select}
                        value={s2.yearsOfExp}
                        onChange={(e) => setS2((p) => ({ ...p, yearsOfExp: e.target.value }))}
                      >
                        <option value="">Select an option</option>
                        {YEARS_EXP.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </FormField>

                  <FormField label="Notice period" required>
                    <input
                      className={styles.input}
                      placeholder="When can you start?"
                      value={s2.noticePeriod}
                      onChange={(e) => setS2((p) => ({ ...p, noticePeriod: e.target.value }))}
                    />
                  </FormField>
                </>
              )}

              {/* ── Step 3 ── */}
              {step === 3 && (
                <>
                  <FormField
                    label="Describe a time you solved a complex UX problem. What was your process?"
                    required
                  >
                    <>
                      <textarea
                        className={styles.textarea}
                        placeholder="e.g. In my last project, I redesigned the checkout flow..."
                        value={s3.answer1}
                        maxLength={500}
                        rows={5}
                        onChange={(e) => setS3((p) => ({ ...p, answer1: e.target.value }))}
                      />
                      <div className={styles.charCount}>{s3.answer1.length}/500</div>
                    </>
                  </FormField>

                  <FormField
                    label={`Why are you interested in the ${job.title} role at ${job.company}?`}
                    required
                  >
                    <>
                      <textarea
                        className={styles.textarea}
                        placeholder="Tell us what excites you about this company..."
                        value={s3.answer2}
                        maxLength={500}
                        rows={4}
                        onChange={(e) => setS3((p) => ({ ...p, answer2: e.target.value }))}
                      />
                      <div className={styles.charCount}>{s3.answer2.length}/500</div>
                    </>
                  </FormField>
                </>
              )}
            </div>

            {/* ── Card footer ── */}
            <div className={styles.cardFooter}>
              {step > 1 ? (
                <button className={styles.backBtn} onClick={handleBack}>
                  <IconArrowLeft size={14} strokeWidth={2} />
                  Back to previous step
                </button>
              ) : (
                <div />
              )}
              <button
                className={`${styles.nextBtn} ${nextDisabled ? styles.nextBtnDisabled : ''}`}
                onClick={handleNext}
                disabled={nextDisabled}
              >
                {step === 3 ? 'Submit application' : (
                  <>Next step <IconArrowRight size={14} strokeWidth={2} /></>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Exit modal ── */}
      {showExitModal && (
        <div className={styles.backdrop} onClick={() => setShowExitModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowExitModal(false)}>
              <IconX size={16} strokeWidth={2} />
            </button>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>Save your progress and exit?</h3>
              <p className={styles.modalBody}>
                You can return to complete this application within 7 days. After that, your draft will be removed.
              </p>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setShowExitModal(false)}>
                Cancel
              </button>
              <button className={styles.modalSave} onClick={handleSaveExit}>
                Save as draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
