import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconArrowLeft,
  IconCircleCheck,
  IconCircleX,
  IconAlertCircle,
  IconBold,
  IconItalic,
  IconList,
  IconListNumbers,
  IconLink,
  IconX,
  IconBriefcase,
  IconBrain,
  IconMessageCircle,
  IconSettings2,
  IconChevronDown,
  IconPlus,
  IconRefresh,
} from '@tabler/icons-react';
import { useToast } from '../../store/useToast';
import styles from './RecruiterCreateVacancyScreen.module.css';

// ── Types ───────────────────────────────────────────────────────────────────

interface FormState {
  roleTitle: string;
  department: string;
  positions: string;
  experienceLevel: string;
  location: string;
  workMode: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  applicationDeadline: string;
  expectedDecisionDate: string;
  aboutRole: string;
  requirements: string;
  customQuestion1: string;
  customQuestion2: string;
  showQuestion2: boolean;
  assessmentMode: 'smart' | 'custom';
  personalityEnabled: boolean;
  personalityTimeLimit: string;
  personalityFramework: string;
  personalityInstructions: string;
  aiInterviewEnabled: boolean;
  aiInterviewQuestions: string;
  aiInterviewTimePerResponse: string;
  aiInterviewPrepTime: 'none' | '30sec' | '1min' | '3min';
  aiInterviewRetakePolicy: 'no-retakes' | '1' | '3' | 'unlimited';
  aiInterviewInstructions: string;
  technicalEnabled: boolean;
  cognitiveEnabled: boolean;
  assessmentOpens: string;
  assessmentDeadline: string;
  proctoringLevel: string;
  publishMode: 'now' | 'later';
}

const INITIAL_FORM: FormState = {
  roleTitle: '',
  department: '',
  positions: '1',
  experienceLevel: '',
  location: '',
  workMode: '',
  employmentType: '',
  salaryMin: '',
  salaryMax: '',
  applicationDeadline: '',
  expectedDecisionDate: '',
  aboutRole: '',
  requirements: '',
  customQuestion1: '',
  customQuestion2: '',
  showQuestion2: false,
  assessmentMode: 'smart',
  personalityEnabled: true,
  personalityTimeLimit: '',
  personalityFramework: '',
  personalityInstructions: '',
  aiInterviewEnabled: true,
  aiInterviewQuestions: '',
  aiInterviewTimePerResponse: '',
  aiInterviewPrepTime: '1min',
  aiInterviewRetakePolicy: '1',
  aiInterviewInstructions: '',
  technicalEnabled: false,
  cognitiveEnabled: false,
  assessmentOpens: '',
  assessmentDeadline: '',
  proctoringLevel: '',
  publishMode: 'now',
};

// ── Progress bar labels ─────────────────────────────────────────────────────

const NEXT_LABELS = [
  'Next: Role Details',
  'Next: Assessment Setup',
  'Next: Review & Publish',
  'Almost done!',
];

// ── Helper: Field wrapper ───────────────────────────────────────────────────

function Field({
  label,
  required,
  helper,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.fieldRequired}>*</span>}
      </label>
      {children}
      {error ? (
        <span className={styles.fieldError}>
          <IconCircleX size={13} />
          {error}
        </span>
      ) : helper ? (
        <span className={styles.fieldHelper}>{helper}</span>
      ) : null}
    </div>
  );
}

// ── Helper: Native select ───────────────────────────────────────────────────

function Select({
  value,
  onChange,
  placeholder,
  options,
  hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  hasError?: boolean;
}) {
  return (
    <div className={styles.selectWrap}>
      <select
        className={`${styles.input} ${styles.select} ${hasError ? styles.inputError : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <IconChevronDown size={14} className={styles.selectIcon} />
    </div>
  );
}

// ── Helper: Toolbar for textareas ───────────────────────────────────────────

function FormatToolbar() {
  return (
    <div className={styles.toolbar}>
      <button type="button" className={styles.toolbarBtn} title="Bold">
        <IconBold size={14} />
      </button>
      <button type="button" className={styles.toolbarBtn} title="Italic">
        <IconItalic size={14} />
      </button>
      <span className={styles.toolbarDivider} />
      <button type="button" className={styles.toolbarBtn} title="Bullet list">
        <IconList size={14} />
      </button>
      <button type="button" className={styles.toolbarBtn} title="Numbered list">
        <IconListNumbers size={14} />
      </button>
      <span className={styles.toolbarDivider} />
      <button type="button" className={styles.toolbarBtn} title="Insert link">
        <IconLink size={14} />
      </button>
    </div>
  );
}

// ── Toggle switch ───────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className={styles.toggle}>
      <input
        type="checkbox"
        className={styles.toggleInput}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.toggleTrack} />
    </label>
  );
}

// ── Assessment icon helper ──────────────────────────────────────────────────

function AssessmentIcon({
  type,
}: {
  type: 'ai-interview' | 'personality' | 'technical' | 'cognitive';
}) {
  const config = {
    'ai-interview': {
      Icon: IconMessageCircle,
      cls: styles.iconAI,
    },
    personality: {
      Icon: IconBrain,
      cls: styles.iconPersonality,
    },
    technical: {
      Icon: IconSettings2,
      cls: styles.iconTechnical,
    },
    cognitive: {
      Icon: IconBriefcase,
      cls: styles.iconCognitive,
    },
  };
  const { Icon, cls } = config[type];
  return (
    <span className={`${styles.assessmentIcon} ${cls}`}>
      <Icon size={16} />
    </span>
  );
}

// ── Step 1 ──────────────────────────────────────────────────────────────────

function Step1({
  form,
  set,
  dateError,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  dateError: boolean;
}) {
  return (
    <>
      <div className={styles.formGrid}>
        <Field label="Role title" required>
          <input
            className={styles.input}
            value={form.roleTitle}
            onChange={(e) => set('roleTitle', e.target.value)}
            placeholder="e.g. Senior Product Designer"
          />
        </Field>

        <Field label="Department" required>
          <input
            className={styles.input}
            value={form.department}
            onChange={(e) => set('department', e.target.value)}
            placeholder="e.g. Engineering"
          />
        </Field>

        <Field label="Number of positions" required>
          <input
            className={styles.input}
            type="number"
            min="1"
            value={form.positions}
            onChange={(e) => set('positions', e.target.value)}
            placeholder="1"
          />
        </Field>

        <Field label="Experience Level" required>
          <Select
            value={form.experienceLevel}
            onChange={(v) => set('experienceLevel', v)}
            placeholder="Select level"
            options={[
              { value: 'Entry-level', label: 'Entry-level' },
              { value: 'Mid-level', label: 'Mid-level' },
              { value: 'Senior', label: 'Senior' },
              { value: 'Lead', label: 'Lead' },
              { value: 'Manager', label: 'Manager' },
            ]}
          />
        </Field>

        <Field label="City / Location" required>
          <input
            className={styles.input}
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="e.g. Jakarta Selatan"
          />
        </Field>

        <Field label="Work Mode" required>
          <Select
            value={form.workMode}
            onChange={(v) => set('workMode', v)}
            placeholder="Select work mode"
            options={[
              { value: 'On-site', label: 'On-site' },
              { value: 'Remote', label: 'Remote' },
              { value: 'Hybrid', label: 'Hybrid' },
            ]}
          />
        </Field>

        <Field label="Employment type" required>
          <Select
            value={form.employmentType}
            onChange={(v) => set('employmentType', v)}
            placeholder="Select type"
            options={[
              { value: 'Full-time', label: 'Full-time' },
              { value: 'Part-time', label: 'Part-time' },
              { value: 'Contract', label: 'Contract' },
              { value: 'Freelance', label: 'Freelance' },
            ]}
          />
        </Field>

        <Field label="Salary Range" required>
          <div className={styles.salaryRow}>
            <input
              className={styles.input}
              value={form.salaryMin}
              onChange={(e) => set('salaryMin', e.target.value)}
              placeholder="Min"
              type="number"
              min="0"
            />
            <span className={styles.salaryTo}>to</span>
            <input
              className={styles.input}
              value={form.salaryMax}
              onChange={(e) => set('salaryMax', e.target.value)}
              placeholder="Max"
              type="number"
              min="0"
            />
          </div>
        </Field>

        <Field
          label="Application deadline"
          required
          helper="Candidate will see this date"
        >
          <input
            className={styles.input}
            type="date"
            value={form.applicationDeadline}
            onChange={(e) => set('applicationDeadline', e.target.value)}
          />
        </Field>

        <Field
          label="Expected decision date"
          required
          helper={
            !dateError
              ? "Shown to candidates as 'Expected decision by'."
              : undefined
          }
          error={
            dateError
              ? 'Decision date must be after the application deadline'
              : undefined
          }
        >
          <input
            className={`${styles.input} ${dateError ? styles.inputError : ''}`}
            type="date"
            value={form.expectedDecisionDate}
            onChange={(e) => set('expectedDecisionDate', e.target.value)}
          />
        </Field>
      </div>
    </>
  );
}

// ── Step 2 ──────────────────────────────────────────────────────────────────

function Step2({
  form,
  set,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className={styles.step2Sections}>
      {/* About the role */}
      <div className={styles.step2Section}>
        <span className={styles.sectionLabel}>About the role</span>
        <hr className={styles.sectionDivider} />
        <FormatToolbar />
        <textarea
          className={styles.textarea}
          rows={6}
          value={form.aboutRole}
          onChange={(e) => set('aboutRole', e.target.value)}
          placeholder="Describe the role, team, and what success looks like…"
        />
        <span className={styles.fieldHelper}>
          Write in a way that gives candidates a genuine sense of the role and
          team culture.
        </span>
      </div>

      {/* Experience & requirements */}
      <div className={styles.step2Section}>
        <span className={styles.sectionLabel}>Experience &amp; requirements</span>
        <hr className={styles.sectionDivider} />
        <FormatToolbar />
        <textarea
          className={styles.textarea}
          rows={6}
          value={form.requirements}
          onChange={(e) => set('requirements', e.target.value)}
          placeholder="List required skills, qualifications, and experience…"
        />
      </div>

      {/* Application questions */}
      <div className={styles.step2Section}>
        <span className={styles.sectionLabel}>Application questions</span>
        <hr className={styles.sectionDivider} />

        <div className={styles.infoCallout}>
          <IconAlertCircle size={14} className={styles.infoCalloutIcon} />
          <span>
            One question is always included by default: &ldquo;Why are you
            interested in this role?&rdquo; You can add up to 2 additional
            questions. Candidates answer in plain text, up to 500 characters.
          </span>
        </div>

        {/* Default (disabled) question */}
        <div className={styles.questionRow}>
          <span className={styles.questionLabel}>Default question</span>
          <div className={`${styles.input} ${styles.inputDisabled}`}>
            Why are you interested in this role?
          </div>
        </div>

        {/* Custom question 1 */}
        <div className={styles.questionRow}>
          <span className={styles.questionLabel}>Question 1 of 2</span>
          <textarea
            className={styles.textarea}
            rows={2}
            value={form.customQuestion1}
            onChange={(e) => set('customQuestion1', e.target.value)}
            placeholder="Enter your question…"
          />
        </div>

        {/* Custom question 2 */}
        {form.showQuestion2 && (
          <div className={styles.questionRow}>
            <span className={styles.questionLabel}>Question 2 of 2</span>
            <textarea
              className={styles.textarea}
              rows={2}
              value={form.customQuestion2}
              onChange={(e) => set('customQuestion2', e.target.value)}
              placeholder="Enter your question…"
            />
          </div>
        )}

        {!form.showQuestion2 && (
          <button
            type="button"
            className={styles.addQuestionBtn}
            onClick={() => set('showQuestion2', true)}
          >
            <IconPlus size={14} />
            Add another question (1 remaining)
          </button>
        )}
      </div>
    </div>
  );
}

// ── Smart Default display rows ──────────────────────────────────────────────

const SMART_ASSESSMENTS = [
  {
    type: 'ai-interview' as const,
    name: 'AI Interview',
    subtitle:
      '1 min preparation time · 5 questions · 3 minutes per response · 1 retake per question',
    enabled: true,
  },
  {
    type: 'personality' as const,
    name: 'Personality Profile',
    subtitle:
      '20 min · Big Five (OCEAN) · No passing threshold — informational only',
    enabled: true,
  },
  {
    type: 'technical' as const,
    name: 'Technical Aptitude',
    subtitle:
      'Not included — enable in Custom if role requires technical evaluation',
    enabled: false,
  },
  {
    type: 'cognitive' as const,
    name: 'Cognitive Reasoning',
    subtitle:
      'Not included — enable in Custom if role requires technical evaluation',
    enabled: false,
  },
];

const SMART_WINDOW_ROWS = [
  {
    label: 'Assessment opens',
    value: 'Immediately after application submitted',
  },
  {
    label: 'Assessment deadline',
    value: 'Same as application deadline',
  },
  {
    label: 'Insight report released',
    value: 'After assessment window closes',
  },
  {
    label: 'Proctoring level',
    value: 'Standard proctoring (tab switch detection)',
  },
];

function SmartDefaultTab() {
  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionBlock}>
        <span className={styles.sectionLabel}>
          Assessments &amp; Passing Threshold
        </span>
        <hr className={styles.sectionDivider} />
        {SMART_ASSESSMENTS.map((a) => (
          <div key={a.name} className={styles.assessmentRow}>
            <AssessmentIcon type={a.type} />
            <div className={styles.assessmentInfo}>
              <span className={styles.assessmentName}>{a.name}</span>
              <span className={styles.assessmentSubtitle}>{a.subtitle}</span>
            </div>
            <span
              className={`${styles.assessmentBadge} ${
                a.enabled
                  ? styles.assessmentBadgeEnabled
                  : styles.assessmentBadgeDisabled
              }`}
            >
              {a.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.sectionBlock}>
        <span className={styles.sectionLabel}>
          Assessment Window &amp; Proctoring Level
        </span>
        <hr className={styles.sectionDivider} />
        {SMART_WINDOW_ROWS.map((r) => (
          <div key={r.label} className={styles.kvRow}>
            <span className={styles.kvLabel}>{r.label}</span>
            <span className={styles.kvValue}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Custom tab ──────────────────────────────────────────────────────────────

function CustomTab({
  form,
  set,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionBlock}>
        <span className={styles.sectionLabel}>
          Assessments &amp; Passing Threshold
        </span>
        <hr className={styles.sectionDivider} />

        {/* Personality Profile */}
        <div
          className={`${styles.assessmentCard} ${
            form.personalityEnabled ? styles.assessmentCardEnabled : ''
          }`}
        >
          <div className={styles.assessmentCardHeader}>
            <AssessmentIcon type="personality" />
            <div className={styles.assessmentInfo}>
              <span className={styles.assessmentName}>Personality Profile</span>
              <span className={styles.assessmentSubtitle}>
                20 min · Big Five (OCEAN)
              </span>
            </div>
            <span
              className={`${styles.assessmentToggleLabel} ${
                form.personalityEnabled
                  ? styles.assessmentToggleLabelOn
                  : styles.assessmentToggleLabelOff
              }`}
            >
              {form.personalityEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <Toggle
              checked={form.personalityEnabled}
              onChange={(v) => set('personalityEnabled', v)}
            />
          </div>

          {form.personalityEnabled && (
            <div className={styles.assessmentCardBody}>
              <div className={styles.formGrid2}>
                <Field
                  label="Time limit"
                  required
                  helper="Recommended: 15-25 minutes"
                >
                  <div className={styles.inputWithSuffix}>
                    <input
                      className={`${styles.input} ${styles.inputFlex}`}
                      type="number"
                      min="1"
                      value={form.personalityTimeLimit}
                      onChange={(e) =>
                        set('personalityTimeLimit', e.target.value)
                      }
                      placeholder="20"
                    />
                    <span className={styles.inputSuffix}>min</span>
                  </div>
                </Field>
                <Field
                  label="Framework"
                  required
                  helper="No passing threshold — informational only"
                >
                  <Select
                    value={form.personalityFramework}
                    onChange={(v) => set('personalityFramework', v)}
                    placeholder="Select framework"
                    options={[
                      { value: 'big-five', label: 'Big Five (OCEAN)' },
                      { value: 'disc', label: 'DISC' },
                      { value: 'enneagram', label: 'Enneagram' },
                    ]}
                  />
                </Field>
              </div>
              <Field
                label="Candidate instructions"
                required
                helper="Shown to the candidate before they begin."
              >
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={form.personalityInstructions}
                  onChange={(e) =>
                    set('personalityInstructions', e.target.value)
                  }
                  placeholder="Enter instructions for candidates…"
                />
              </Field>
            </div>
          )}
        </div>

        {/* AI Interview */}
        <div
          className={`${styles.assessmentCard} ${
            form.aiInterviewEnabled ? styles.assessmentCardEnabled : ''
          }`}
        >
          <div className={styles.assessmentCardHeader}>
            <AssessmentIcon type="ai-interview" />
            <div className={styles.assessmentInfo}>
              <span className={styles.assessmentName}>AI Interview</span>
              <span className={styles.assessmentSubtitle}>
                Video · AI-evaluated
              </span>
            </div>
            <span
              className={`${styles.assessmentToggleLabel} ${
                form.aiInterviewEnabled
                  ? styles.assessmentToggleLabelOn
                  : styles.assessmentToggleLabelOff
              }`}
            >
              {form.aiInterviewEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <Toggle
              checked={form.aiInterviewEnabled}
              onChange={(v) => set('aiInterviewEnabled', v)}
            />
          </div>

          {form.aiInterviewEnabled && (
            <div className={styles.assessmentCardBody}>
              <div className={styles.formGrid2}>
                <Field
                  label="Questions"
                  required
                  helper="Recommended: 3-5 questions"
                >
                  <div className={styles.inputWithSuffix}>
                    <input
                      className={`${styles.input} ${styles.inputFlex}`}
                      type="number"
                      min="1"
                      value={form.aiInterviewQuestions}
                      onChange={(e) =>
                        set('aiInterviewQuestions', e.target.value)
                      }
                      placeholder="5"
                    />
                    <span className={styles.inputSuffix}>questions</span>
                  </div>
                </Field>
                <Field
                  label="Time per response"
                  required
                  helper="Recommended: 2-3 minutes"
                >
                  <div className={styles.inputWithSuffix}>
                    <input
                      className={`${styles.input} ${styles.inputFlex}`}
                      type="number"
                      min="1"
                      value={form.aiInterviewTimePerResponse}
                      onChange={(e) =>
                        set('aiInterviewTimePerResponse', e.target.value)
                      }
                      placeholder="3"
                    />
                    <span className={styles.inputSuffix}>min</span>
                  </div>
                </Field>
              </div>

              <Field label="Preparation time per question" required>
                <div className={styles.radioGroup}>
                  {(
                    [
                      { value: 'none', label: 'None' },
                      { value: '30sec', label: '30 sec' },
                      { value: '1min', label: '1 min' },
                      { value: '3min', label: '3 min' },
                    ] as const
                  ).map((opt) => (
                    <label key={opt.value} className={styles.radioOption}>
                      <input
                        type="radio"
                        className={styles.radioInput}
                        name="aiPrepTime"
                        value={opt.value}
                        checked={form.aiInterviewPrepTime === opt.value}
                        onChange={() => set('aiInterviewPrepTime', opt.value)}
                      />
                      <span className={styles.radioLabel}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="Retake policy" required>
                <div className={styles.radioGroup}>
                  {(
                    [
                      { value: 'no-retakes', label: 'No retakes' },
                      { value: '1', label: '1 retake' },
                      { value: '3', label: '3 retakes' },
                      { value: 'unlimited', label: 'Unlimited' },
                    ] as const
                  ).map((opt) => (
                    <label key={opt.value} className={styles.radioOption}>
                      <input
                        type="radio"
                        className={styles.radioInput}
                        name="aiRetakePolicy"
                        value={opt.value}
                        checked={form.aiInterviewRetakePolicy === opt.value}
                        onChange={() =>
                          set('aiInterviewRetakePolicy', opt.value)
                        }
                      />
                      <span className={styles.radioLabel}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </Field>

              <Field
                label="Candidate instructions"
                required
                helper="Shown to the candidate before they begin."
              >
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={form.aiInterviewInstructions}
                  onChange={(e) =>
                    set('aiInterviewInstructions', e.target.value)
                  }
                  placeholder="Enter instructions for candidates…"
                />
              </Field>
            </div>
          )}
        </div>

        {/* Technical Aptitude (collapsed only) */}
        <div className={styles.assessmentCard}>
          <div className={styles.assessmentCardHeader}>
            <AssessmentIcon type="technical" />
            <div className={styles.assessmentInfo}>
              <span className={styles.assessmentName}>Technical Aptitude</span>
              <span className={styles.assessmentSubtitle}>
                Not included — enable if role requires technical evaluation
              </span>
            </div>
            <span className={styles.assessmentToggleLabelOff}>Disabled</span>
            <Toggle
              checked={form.technicalEnabled}
              onChange={(v) => set('technicalEnabled', v)}
            />
          </div>
        </div>

        {/* Cognitive Reasoning (collapsed only) */}
        <div className={styles.assessmentCard}>
          <div className={styles.assessmentCardHeader}>
            <AssessmentIcon type="cognitive" />
            <div className={styles.assessmentInfo}>
              <span className={styles.assessmentName}>Cognitive Reasoning</span>
              <span className={styles.assessmentSubtitle}>
                Not included — enable if role requires technical evaluation
              </span>
            </div>
            <span className={styles.assessmentToggleLabelOff}>Disabled</span>
            <Toggle
              checked={form.cognitiveEnabled}
              onChange={(v) => set('cognitiveEnabled', v)}
            />
          </div>
        </div>
      </div>

      {/* Assessment Window & Proctoring */}
      <div className={styles.sectionBlock}>
        <span className={styles.sectionLabel}>
          Assessment Window &amp; Proctoring
        </span>
        <hr className={styles.sectionDivider} />

        <div className={styles.formGrid2}>
          <Field label="Assessment opens" required>
            <Select
              value={form.assessmentOpens}
              onChange={(v) => set('assessmentOpens', v)}
              placeholder="Select timing"
              options={[
                {
                  value: 'immediately',
                  label: 'Immediately after application submitted',
                },
                {
                  value: 'after-review',
                  label: 'After recruiter review',
                },
              ]}
            />
          </Field>
          <Field label="Assessment deadline" required>
            <Select
              value={form.assessmentDeadline}
              onChange={(v) => set('assessmentDeadline', v)}
              placeholder="Select deadline"
              options={[
                {
                  value: 'same-as-application',
                  label: 'Same as application deadline',
                },
                { value: '3-days', label: '3 days after opening' },
                { value: '7-days', label: '7 days after opening' },
              ]}
            />
          </Field>
        </div>

        <Field
          label="Proctoring level"
          required
          helper="Candidates are always informed of proctoring level before the assessment begins."
        >
          <Select
            value={form.proctoringLevel}
            onChange={(v) => set('proctoringLevel', v)}
            placeholder="Select proctoring level"
            options={[
              {
                value: 'standard',
                label: 'Standard proctoring (tab switch detection)',
              },
              { value: 'strict', label: 'Strict proctoring (camera enabled)' },
              { value: 'none', label: 'No proctoring' },
            ]}
          />
        </Field>
      </div>
    </div>
  );
}

// ── Step 3 ──────────────────────────────────────────────────────────────────

function Step3({
  form,
  set,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div>
      {/* Tab bar */}
      <div className={styles.tabBar}>
        <button
          type="button"
          className={`${styles.tab} ${
            form.assessmentMode === 'smart' ? styles.tabActive : ''
          }`}
          onClick={() => set('assessmentMode', 'smart')}
        >
          Smart Default
        </button>
        <button
          type="button"
          className={`${styles.tab} ${
            form.assessmentMode === 'custom' ? styles.tabActive : ''
          }`}
          onClick={() => set('assessmentMode', 'custom')}
        >
          Custom
        </button>
      </div>

      {form.assessmentMode === 'smart' ? (
        <SmartDefaultTab />
      ) : (
        <CustomTab form={form} set={set} />
      )}
    </div>
  );
}

// ── Step 4 review helpers ───────────────────────────────────────────────────

function ReviewField({
  label,
  value,
  required,
}: {
  label: string;
  value: string | null | undefined;
  required?: boolean;
}) {
  const isEmpty = !value || value.trim() === '';
  return (
    <div className={styles.reviewFieldRow}>
      <span className={styles.reviewFieldLabel}>{label}</span>
      {isEmpty ? (
        required ? (
          <span className={styles.reviewMissing}>
            <IconCircleX size={13} />
            Not set — required
          </span>
        ) : (
          <span className={styles.reviewEmpty}>Empty</span>
        )
      ) : (
        <span className={styles.reviewFieldValue}>{value}</span>
      )}
    </div>
  );
}

function ReviewCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewCardHeader}>
        <span className={styles.reviewCardTitle}>{title}</span>
        <button type="button" className={styles.editLink} onClick={onEdit}>
          Edit
        </button>
      </div>
      <hr className={styles.reviewCardDivider} />
      <div className={styles.reviewCardBody}>{children}</div>
    </div>
  );
}

function Step4({
  form,
  set,
  onEditStep,
  isReadyToPublish,
  onPublish,
  onDraft,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  onEditStep: (n: number) => void;
  isReadyToPublish: boolean;
  onPublish: () => void;
  onDraft: () => void;
}) {
  const checklist = [
    {
      label: 'Role title and department set',
      ok: !!(form.roleTitle.trim() && form.department.trim()),
    },
    {
      label: 'Salary range provided',
      ok: !!(form.salaryMin.trim() && form.salaryMax.trim()),
    },
    {
      label: 'Application deadline set',
      ok: !!form.applicationDeadline.trim(),
    },
    {
      label: 'Role description added',
      ok: !!form.aboutRole.trim(),
    },
    {
      label: 'Expected decision date set',
      ok: !!form.expectedDecisionDate.trim(),
    },
    {
      label: form.requirements.trim()
        ? 'Requirements added'
        : 'Requirements not added',
      ok: !!form.requirements.trim(),
    },
  ];

  // Build question list
  const questionLines: string[] = ['Why are you interested in this role?'];
  if (form.customQuestion1.trim()) questionLines.push(form.customQuestion1.trim());
  if (form.showQuestion2 && form.customQuestion2.trim())
    questionLines.push(form.customQuestion2.trim());

  const salaryDisplay =
    form.salaryMin && form.salaryMax
      ? `IDR ${form.salaryMin} – ${form.salaryMax} / month`
      : null;

  const durationDisplay =
    form.applicationDeadline || form.expectedDecisionDate
      ? `${form.applicationDeadline || '—'} to ${form.expectedDecisionDate || '—'}`
      : null;

  return (
    <div className={styles.step4Layout}>
      {/* ── Left column ── */}
      <div className={styles.step4Left}>
        {/* Basic Information */}
        <ReviewCard title="Basic Information" onEdit={() => onEditStep(0)}>
          <ReviewField label="Role title" value={form.roleTitle} required />
          <ReviewField label="Department" value={form.department} required />
          <ReviewField
            label="Positions"
            value={form.positions ? `${form.positions} position(s)` : null}
          />
          <ReviewField label="Experience level" value={form.experienceLevel} />
          <ReviewField label="Location" value={form.location} />
          <ReviewField label="Salary range" value={salaryDisplay} required />
          <ReviewField
            label="Application duration"
            value={durationDisplay}
          />
        </ReviewCard>

        {/* Role Details */}
        <ReviewCard title="Role Details" onEdit={() => onEditStep(1)}>
          <div className={styles.reviewFieldRow}>
            <span className={styles.reviewFieldLabel}>About the role</span>
            {form.aboutRole.trim() ? (
              <span className={`${styles.reviewFieldValue} ${styles.reviewMultiline}`}>
                {form.aboutRole}
              </span>
            ) : (
              <span className={styles.reviewEmpty}>Not provided</span>
            )}
          </div>
          <div className={styles.reviewFieldRow}>
            <span className={styles.reviewFieldLabel}>Requirements</span>
            {form.requirements.trim() ? (
              <span className={`${styles.reviewFieldValue} ${styles.reviewMultiline}`}>
                {form.requirements}
              </span>
            ) : (
              <span className={styles.reviewMissing}>
                <IconCircleX size={13} />
                Not set — required
              </span>
            )}
          </div>
          <div className={styles.reviewFieldRow}>
            <span className={styles.reviewFieldLabel}>
              Application questions
            </span>
            <ul className={styles.reviewQuestionList}>
              {questionLines.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        </ReviewCard>

        {/* Assessment Setup */}
        <ReviewCard title="Assessment Setup" onEdit={() => onEditStep(2)}>
          <div className={styles.sectionBlock}>
            {SMART_ASSESSMENTS.map((a) => (
              <div key={a.name} className={styles.assessmentRow}>
                <AssessmentIcon type={a.type} />
                <div className={styles.assessmentInfo}>
                  <span className={styles.assessmentName}>{a.name}</span>
                  <span className={styles.assessmentSubtitle}>{a.subtitle}</span>
                </div>
                <span
                  className={`${styles.assessmentBadge} ${
                    a.enabled
                      ? styles.assessmentBadgeEnabled
                      : styles.assessmentBadgeDisabled
                  }`}
                >
                  {a.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            ))}
          </div>
          <hr className={styles.reviewCardDivider} />
          {SMART_WINDOW_ROWS.map((r) => (
            <div key={r.label} className={styles.kvRow}>
              <span className={styles.kvLabel}>{r.label}</span>
              <span className={styles.kvValue}>{r.value}</span>
            </div>
          ))}
        </ReviewCard>
      </div>

      {/* ── Right sidebar ── */}
      <aside className={styles.step4Sidebar}>
        <div className={styles.publishBox}>
          <span className={styles.publishBoxTitle}>Ready to publish?</span>
          <div className={styles.checklist}>
            {checklist.map((item) => (
              <div key={item.label} className={styles.checklistItem}>
                {item.ok ? (
                  <IconCircleCheck
                    size={16}
                    className={styles.checklistIconOk}
                  />
                ) : (
                  <IconCircleX
                    size={16}
                    className={styles.checklistIconFail}
                  />
                )}
                <span
                  className={
                    item.ok
                      ? styles.checklistLabelOk
                      : styles.checklistLabelFail
                  }
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.publishProceedBox}>
          <span className={styles.publishProceedTitle}>
            Choose how you want to proceed.
          </span>
          <label className={styles.radioCard}>
            <input
              type="radio"
              name="publishMode"
              value="now"
              checked={form.publishMode === 'now'}
              onChange={() => set('publishMode', 'now')}
              className={styles.radioInput}
            />
            <div>
              <span className={styles.radioCardLabel}>Publish now</span>
              <span className={styles.radioCardDesc}>
                Make this vacancy live immediately after publishing.
              </span>
            </div>
          </label>
          <label className={styles.radioCard}>
            <input
              type="radio"
              name="publishMode"
              value="later"
              checked={form.publishMode === 'later'}
              onChange={() => set('publishMode', 'later')}
              className={styles.radioInput}
            />
            <div>
              <span className={styles.radioCardLabel}>Schedule for later</span>
              <span className={styles.radioCardDesc}>
                Set a date and time to automatically publish this vacancy.
              </span>
            </div>
          </label>
        </div>

        <button
          type="button"
          className={`${styles.btnPrimary} ${styles.btnFull} ${
            !isReadyToPublish ? styles.btnDisabled : ''
          }`}
          onClick={onPublish}
          disabled={!isReadyToPublish}
        >
          Publish Vacancy
        </button>

        <button
          type="button"
          className={`${styles.btnGhost} ${styles.btnFull}`}
          onClick={onDraft}
        >
          Save as Draft
        </button>

        <div className={styles.whatNextBox}>
          <span className={styles.whatNextTitle}>What happens next</span>
          <ol className={styles.whatNextList}>
            <li>
              <span className={styles.whatNextNum}>1</span>
              <span>
                <strong>Vacancy goes live</strong> — candidates can find and
                apply to this role.
              </span>
            </li>
            <li>
              <span className={styles.whatNextNum}>2</span>
              <span>
                <strong>Assessments are assigned</strong> — candidates complete
                assessments immediately after applying.
              </span>
            </li>
            <li>
              <span className={styles.whatNextNum}>3</span>
              <span>
                <strong>Review insights</strong> — access AI-generated insight
                reports from the Pipeline dashboard.
              </span>
            </li>
          </ol>
        </div>
      </aside>
    </div>
  );
}

// ── Exit confirmation modal ─────────────────────────────────────────────────

function ExitModal({
  onCancel,
  onSaveDraft,
}: {
  onCancel: () => void;
  onSaveDraft: () => void;
}) {
  return (
    <div className={styles.modalBackdrop} onClick={onCancel}>
      <div
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-modal-title"
      >
        <div className={styles.modalHeader}>
          <span id="exit-modal-title" className={styles.modalTitle}>
            Save your progress and exit?
          </span>
          <button
            type="button"
            className={styles.modalClose}
            onClick={onCancel}
            aria-label="Close"
          >
            <IconX size={16} />
          </button>
        </div>
        <p className={styles.modalBody}>
          Your changes would be saved as draft and you can return to complete
          this job vacancy later.
        </p>
        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={onSaveDraft}
          >
            Save as draft
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main screen ─────────────────────────────────────────────────────────────

export default function RecruiterCreateVacancyScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [showExitModal, setShowExitModal] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Date validation
  const dateError = !!(
    form.applicationDeadline &&
    form.expectedDecisionDate &&
    new Date(form.expectedDecisionDate) <= new Date(form.applicationDeadline)
  );

  const canGoNext = step === 0 ? !dateError : true;

  // Publish readiness
  const isReadyToPublish = !!(
    form.roleTitle.trim() &&
    form.department.trim() &&
    form.salaryMin.trim() &&
    form.salaryMax.trim() &&
    form.applicationDeadline.trim() &&
    form.aboutRole.trim() &&
    form.expectedDecisionDate.trim() &&
    form.requirements.trim()
  );

  // Progress bar fill — starts at 0%, reaches 100% on the review step (step 3)
  const fillPercent = (step / 3) * 100;

  function handleSaveDraft() {
    setShowExitModal(false);
    showToast({ message: 'Draft saved successfully.', type: 'success' });
    navigate('/r/vacancies');
  }

  function handlePublish() {
    showToast({ message: 'Vacancy published successfully!', type: 'success' });
    navigate('/r/vacancies');
  }

  const STEP_TITLES = [
    'Basic Information',
    'Role Details',
    'Assessment Setup',
    'Review & Publish',
  ];

  return (
    <div className={styles.page}>
      {/* ── Topbar ── */}
      <header className={styles.topbar}>
        <h1 className={styles.topbarTitle}>Create New Vacancy</h1>
        <button
          type="button"
          className={styles.btnGhost}
          onClick={() => setShowExitModal(true)}
        >
          Save and exit
          <span className={styles.exitArrow}>↗</span>
        </button>
      </header>

      {/* ── Scrollable content ── */}
      <div className={styles.scrollArea}>
        <div className={step === 3 ? styles.formWrapperWide : styles.formWrapper}>

          {/* Progress bar — above the card, scrolls with content */}
          <div className={styles.progressArea}>
            <div className={styles.progressMeta}>
              <span className={styles.progressStep}>
                Step {step + 1} of 4
              </span>
              <span className={styles.progressNext}>
                {NEXT_LABELS[step]}
              </span>
            </div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
          </div>

        {step < 4 && (
          <div
            className={`${styles.card} ${
              step === 3 ? styles.cardStep4 : styles.cardCentered
            }`}
          >
            {step !== 3 && (
              <h2 className={styles.cardTitle}>{STEP_TITLES[step]}</h2>
            )}

            {step === 0 && (
              <Step1 form={form} set={set} dateError={dateError} />
            )}
            {step === 1 && <Step2 form={form} set={set} />}
            {step === 2 && <Step3 form={form} set={set} />}
            {step === 3 && (
              <Step4
                form={form}
                set={set}
                onEditStep={setStep}
                isReadyToPublish={isReadyToPublish}
                onPublish={handlePublish}
                onDraft={handleSaveDraft}
              />
            )}

            {/* Card footer nav (steps 0–2) */}
            {step < 3 && (
              <div className={styles.cardFooter}>
                {step > 0 ? (
                  <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={() => setStep((s) => s - 1)}
                  >
                    <IconArrowLeft size={14} />
                    Back to previous step
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  className={`${styles.btnPrimary} ${
                    !canGoNext ? styles.btnDisabled : ''
                  }`}
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canGoNext}
                >
                  Next step
                </button>
              </div>
            )}

            {/* Step 4 footer nav */}
            {step === 3 && (
              <div className={styles.cardFooterStep4}>
                <button
                  type="button"
                  className={styles.btnGhost}
                  onClick={() => setStep(2)}
                >
                  <IconArrowLeft size={14} />
                  Back to previous step
                </button>
              </div>
            )}
          </div>
        )}
        </div>{/* end formWrapper */}
      </div>

      {/* ── FAB ── */}
      <button
        type="button"
        className={styles.fab}
        onClick={() => showToast({ message: 'Auto-save — coming in V1.' })}
        aria-label="Auto-save"
      >
        <IconRefresh size={20} />
      </button>

      {/* ── Exit modal ── */}
      {showExitModal && (
        <ExitModal
          onCancel={() => setShowExitModal(false)}
          onSaveDraft={handleSaveDraft}
        />
      )}
    </div>
  );
}
