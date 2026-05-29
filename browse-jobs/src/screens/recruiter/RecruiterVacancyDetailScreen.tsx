import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IconArrowLeft,
  IconEdit,
  IconDots,
  IconSearch,
  IconAlertTriangle,
  IconInfoCircle,
  IconAlertCircle,
  IconX,
  IconBrain,
  IconUser,
  IconCode,
  IconVideo,
  IconChevronDown,
  IconChevronUp,
  IconUsers,
  IconMapPin,
  IconBriefcase,
  IconCurrencyDollar,
  IconCalendarEvent,
  IconCheck,
} from '@tabler/icons-react';
import { useToast } from '../../store/useToast';
import {
  RECRUITER_VACANCIES,
  PIPELINE_CANDIDATES,
  VACANCY_DETAILS,
} from '../../data/mockData';
import type {
  VacancyStage,
  PipelineCandidateStatus,
  PipelineCandidate,
  VacancyDetail,
  AssessmentTypeConfig,
} from '../../data/mockData';
import { Button, Dialog, TextField, Avatar, Checkbox } from '../../components/ds';
import styles from './RecruiterVacancyDetailScreen.module.css';

// ── Constants ──────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const STAGE_ORDER: VacancyStage[] = [
  'Applied',
  'Assessment',
  'Interview',
  'Final Review',
  'Resolved',
];

const STATUS_CONFIG: Record<
  PipelineCandidateStatus,
  { label: string; cssClass: string }
> = {
  'waiting-for-review': {
    label: 'Waiting on recruiter',
    cssClass: styles.statusWaiting,
  },
  'in-progress': {
    label: 'In progress',
    cssClass: styles.statusInProgress,
  },
  shortlisted: {
    label: 'In progress',
    cssClass: styles.statusInProgress,
  },
  'offer-sent': {
    label: 'Resolved',
    cssClass: styles.statusResolved,
  },
};

const ASSESSMENT_ICON_CFG: Record<
  AssessmentTypeConfig['type'],
  { bg: string; color: string; icon: React.ReactNode }
> = {
  cognitive: {
    bg: '#EBF3FD',
    color: '#185FA5',
    icon: <IconBrain size={16} />,
  },
  personality: {
    bg: '#FAEEDA',
    color: '#854F0B',
    icon: <IconUser size={16} />,
  },
  technical: {
    bg: '#EEEDF9',
    color: '#34299A',
    icon: <IconCode size={16} />,
  },
  'ai-interview': {
    bg: '#F0EFFE',
    color: '#4B42B5',
    icon: <IconVideo size={16} />,
  },
};

const VACANCY_STATUS_CONFIG = {
  active: { label: 'Active', cssClass: styles.badgeActive },
  'need-action': { label: 'Action Needed', cssClass: styles.badgeUrgent },
  'not-active': { label: 'Closed', cssClass: styles.badgeInactive },
  draft: { label: 'Draft', cssClass: styles.badgeDraft },
};

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function daysAgo(iso: string): number {
  return Math.floor(
    (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24),
  );
}

function getAvatarInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// ── Score Cell ─────────────────────────────────────────────────────────────

function ScoreCell({ score }: { score: number | null }) {
  if (score === null)
    return <span className={styles.scoreNull}>—</span>;
  const good = score >= 75;
  return (
    <span className={`${styles.score} ${good ? styles.scoreGood : styles.scoreAmber}`}>
      {score}%
    </span>
  );
}

// ── Status Badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PipelineCandidateStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`${styles.statusBadge} ${cfg.cssClass}`}>
      {cfg.label}
    </span>
  );
}

// ── Stage Cell ─────────────────────────────────────────────────────────────

function StageCell({ stage }: { stage: VacancyStage }) {
  return <span className={styles.stageText}>{stage}</span>;
}

// ── Assessment Type Row ────────────────────────────────────────────────────

function AssessmentTypeRow({ cfg }: { cfg: AssessmentTypeConfig }) {
  const iconCfg = ASSESSMENT_ICON_CFG[cfg.type];
  return (
    <div className={styles.assessmentTypeRow}>
      <span
        className={styles.assessmentIcon}
        style={{ background: iconCfg.bg, color: iconCfg.color }}
      >
        {iconCfg.icon}
      </span>
      <div className={styles.assessmentInfo}>
        <span className={styles.assessmentName}>{cfg.label}</span>
        <span className={styles.assessmentDesc}>{cfg.description}</span>
      </div>
      <span
        className={`${styles.enabledBadge} ${cfg.enabled ? styles.enabledBadgeOn : styles.enabledBadgeOff}`}
      >
        {cfg.enabled ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  );
}

// ── Overview Tab ───────────────────────────────────────────────────────────

function OverviewTab({ detail }: { detail: VacancyDetail }) {
  return (
    <div className={styles.overviewGrid}>
      {/* Role Details card */}
      <div className={styles.detailCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Role Details</span>
        </div>
        <div className={styles.cardBody}>
          {/* About the role */}
          <div className={styles.twoColSection}>
            <span className={styles.sectionLabel}>About the role</span>
            <p className={styles.sectionContent}>{detail.aboutRole}</p>
          </div>

          <div className={styles.sectionDivider} />

          {/* Requirements */}
          <div className={styles.twoColSection}>
            <span className={styles.sectionLabel}>Requirements</span>
            <ul className={styles.sectionList}>
              {detail.requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <div className={styles.sectionDivider} />

          {/* Application questions */}
          <div className={styles.twoColSection}>
            <span className={styles.sectionLabel}>Application questions</span>
            <ul className={styles.sectionList}>
              {detail.applicationQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Assessment Setup card */}
      <div className={styles.detailCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Assessment Setup</span>
        </div>
        <div className={styles.cardBody}>
          {/* Assessment type rows */}
          <div className={styles.assessmentTypesSection}>
            {detail.assessmentTypes.map((cfg) => (
              <AssessmentTypeRow key={cfg.type} cfg={cfg} />
            ))}
          </div>

          <div className={styles.sectionDivider} />

          {/* Settings rows */}
          <div className={styles.settingsSection}>
            <div className={styles.settingRow}>
              <span className={styles.settingLabel}>Assessment opens</span>
              <span className={styles.settingValue}>{detail.assessmentSettings.opensOn}</span>
            </div>
            <div className={styles.settingRow}>
              <span className={styles.settingLabel}>Deadline</span>
              <span className={styles.settingValue}>{detail.assessmentSettings.deadline}</span>
            </div>
            <div className={styles.settingRow}>
              <span className={styles.settingLabel}>Insight report released</span>
              <span className={styles.settingValue}>{detail.assessmentSettings.insightReleased}</span>
            </div>
            <div className={styles.settingRow}>
              <span className={styles.settingLabel}>Proctoring level</span>
              <span className={styles.settingValue}>{detail.assessmentSettings.proctoringLevel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Close Applications Modal ───────────────────────────────────────────────

interface CloseModalProps {
  open: boolean;
  onClose: () => void;
  selectedCandidates: PipelineCandidate[];
  vacancyTitle: string;
  onConfirm: () => void;
}

function CloseApplicationsModal({
  open,
  onClose,
  selectedCandidates,
  vacancyTitle,
  onConfirm,
}: CloseModalProps) {
  const [reason, setReason] = useState<string>('skills-fit');
  const [customReason, setCustomReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [candidatesExpanded, setCandidatesExpanded] = useState(false);

  const count = selectedCandidates.length;
  const isConfirmed = confirmText === String(count);

  const REASONS = [
    {
      id: 'skills-fit',
      label: 'Skills fit, another candidate',
      desc: 'We have decided to move forward with other candidates whose backgrounds align more closely with this specific role.',
    },
    {
      id: 'requirements',
      label: 'Role requirements mismatch',
      desc: 'After reviewing your application, your current experience does not yet meet the specific requirements for this role.',
    },
    {
      id: 'custom',
      label: 'Write a custom reason',
      desc: 'Write your own message. You are accountable for this copy.',
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Close applications"
      description={
        <>
          You are about to close{' '}
          <strong>{count} application{count !== 1 ? 's' : ''}</strong>{' '}
          for {vacancyTitle}. This action cannot be undone.
        </>
      }
      size="md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger-ghost"
            size="sm"
            disabled={!isConfirmed}
            onClick={onConfirm}
          >
            Close {count} application{count !== 1 ? 's' : ''}
          </Button>
        </>
      }
    >
      <div className={styles.modalBody}>

        {/* Candidate accordion */}
        <button
          className={styles.accordionHeader}
          onClick={() => setCandidatesExpanded((v) => !v)}
          type="button"
        >
          <div className={styles.accordionHeaderText}>
            <IconUsers size={14} />
            <span>
              <strong>{count}</strong> candidate{count !== 1 ? 's' : ''} selected
            </span>
          </div>
          {candidatesExpanded ? (
            <IconChevronUp size={14} className={styles.accordionChevron} />
          ) : (
            <IconChevronDown size={14} className={styles.accordionChevron} />
          )}
        </button>
        {candidatesExpanded && (
          <div className={styles.accordionBody}>
            {selectedCandidates.map((c) => (
              <div key={c.id} className={styles.candidateExpandedRow}>
                <Avatar initials={getAvatarInitials(c.name)} size="sm" color="brand" />
                <span className={styles.candidateExpandedName}>{c.name}</span>
                <span className={styles.candidateExpandedEmail}>{c.email}</span>
              </div>
            ))}
          </div>
        )}

        {/* Radio reason cards */}
        <div className={styles.radioGroup}>
          <span className={styles.radioGroupLabel}>Reason for closing</span>
          {REASONS.map((r) => (
            <label
              key={r.id}
              className={`${styles.radioCard} ${reason === r.id ? styles.radioCardActive : ''}`}
            >
              <input
                type="radio"
                name="close-reason"
                value={r.id}
                checked={reason === r.id}
                onChange={() => setReason(r.id)}
                className={styles.radioInput}
              />
              <span className={`${styles.radioCircle} ${reason === r.id ? styles.radioCircleActive : ''}`} />
              <div className={styles.radioCardText}>
                <span className={styles.radioCardTitle}>{r.label}</span>
                {reason !== r.id || r.id !== 'custom' ? (
                  <p className={styles.radioCardDesc}>{r.desc}</p>
                ) : null}
              </div>
            </label>
          ))}
          {reason === 'custom' && (
            <textarea
              className={styles.customReasonArea}
              placeholder="Provide a reason for closing these applications…"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              rows={3}
            />
          )}
        </div>

        {/* Amber warning */}
        <div className={styles.amberWarning}>
          <IconAlertTriangle size={14} />
          <span>
            To confirm, type <strong>{count}</strong> in the field below. This cannot be undone.
          </span>
        </div>

        {/* Confirm field */}
        <TextField
          placeholder={`Type ${count} to confirm`}
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />
      </div>
    </Dialog>
  );
}

// ── Move Stage Modal ───────────────────────────────────────────────────────

interface MoveModalProps {
  open: boolean;
  onClose: () => void;
  initialCandidates: PipelineCandidate[];
  vacancyId: string;
  vacancyTitle: string;
  onConfirm: () => void;
}

function MoveStageModal({
  open,
  onClose,
  initialCandidates,
  vacancyId,
  vacancyTitle,
  onConfirm,
}: MoveModalProps) {
  const [candidates, setCandidates] = useState<PipelineCandidate[]>(
    () => initialCandidates,
  );
  const [candidatesExpanded, setCandidatesExpanded] = useState(true);

  // Reset when modal opens with fresh candidates
  useEffect(() => {
    if (open) {
      setCandidates(initialCandidates);
      setCandidatesExpanded(true);
    }
  }, [open, initialCandidates]);

  const count = candidates.length;

  function removeCandidate(id: string) {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Move to next stage"
      description={
        <>
          Moving{' '}
          <strong>{count} candidate{count !== 1 ? 's' : ''}</strong>{' '}
          from {vacancyTitle}.
        </>
      }
      size="md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={count === 0}
            onClick={onConfirm}
          >
            Move {count} application{count !== 1 ? 's' : ''}
          </Button>
        </>
      }
    >
      <div className={styles.modalBody}>

        {/* Candidate accordion */}
        <button
          className={styles.accordionHeader}
          onClick={() => setCandidatesExpanded((v) => !v)}
          type="button"
        >
          <div className={styles.accordionHeaderText}>
            <IconUsers size={14} />
            <span>
              <strong>{count}</strong> candidate{count !== 1 ? 's' : ''} selected
            </span>
          </div>
          {candidatesExpanded ? (
            <IconChevronUp size={14} className={styles.accordionChevron} />
          ) : (
            <IconChevronDown size={14} className={styles.accordionChevron} />
          )}
        </button>
        {candidatesExpanded && (
          <div className={styles.moveTable}>
            <div className={styles.moveTableHeader}>
              <span className={styles.moveColName}>Name</span>
              <span className={styles.moveColStage}>Last Stage</span>
              <span className={styles.moveColScore}>Score</span>
              <span className={styles.moveColRemove} />
            </div>
            {candidates.map((c) => {
              const app = c.applications.find((a) => a.vacancyId === vacancyId);
              return (
                <div key={c.id} className={styles.moveTableRow}>
                  <div className={styles.moveCandidateCell}>
                    <Avatar initials={getAvatarInitials(c.name)} size="sm" color="brand" />
                    <span className={styles.moveCandidateName}>{c.name}</span>
                  </div>
                  <span className={styles.moveColStage}>
                    <StageCell stage={app?.stage ?? 'Applied'} />
                  </span>
                  <span className={styles.moveColScore}>
                    <ScoreCell score={app?.score ?? null} />
                  </span>
                  <button
                    className={styles.moveRemoveBtn}
                    onClick={() => removeCandidate(c.id)}
                    aria-label={`Remove ${c.name}`}
                  >
                    <IconX size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Info note */}
        <div className={styles.moveInfoNote}>
          <IconInfoCircle size={14} />
          <span>
            <strong>What candidates will see:</strong> Their status will update
            to the next stage and they will receive an email notification.
          </span>
        </div>
      </div>
    </Dialog>
  );
}

// ── Pipeline Tab ───────────────────────────────────────────────────────────

interface PipelineTabProps {
  vacancyId: string;
  vacancyTitle: string;
  isClosed: boolean;
  candidates: PipelineCandidate[];
}

function PipelineTab({
  vacancyId,
  vacancyTitle,
  isClosed,
  candidates,
}: PipelineTabProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<VacancyStage | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [dotsOpenId, setDotsOpenId] = useState<string | null>(null);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const dotsRef = useRef<HTMLDivElement>(null);

  // Close dots menu on outside click
  useEffect(() => {
    if (!dotsOpenId) return;
    function handler(e: MouseEvent) {
      if (dotsRef.current && !dotsRef.current.contains(e.target as Node)) {
        setDotsOpenId(null);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dotsOpenId]);

  // Stage counts
  const stageCounts = useMemo(() => {
    const counts: Record<VacancyStage | 'all', number> = {
      all: candidates.length,
      Applied: 0,
      Assessment: 0,
      Interview: 0,
      'Final Review': 0,
      Resolved: 0,
    };
    candidates.forEach((c) => {
      const app = c.applications.find((a) => a.vacancyId === vacancyId);
      if (app) counts[app.stage] = (counts[app.stage] ?? 0) + 1;
    });
    return counts;
  }, [candidates, vacancyId]);

  // Filtered list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return candidates.filter((c) => {
      const app = c.applications.find((a) => a.vacancyId === vacancyId);
      if (!app) return false;
      if (stageFilter !== 'all' && app.stage !== stageFilter) return false;
      if (q) {
        const matchName = c.name.toLowerCase().includes(q);
        const matchEmail = c.email.toLowerCase().includes(q);
        if (!matchName && !matchEmail) return false;
      }
      return true;
    });
  }, [candidates, vacancyId, stageFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const allPageSelected =
    pageItems.length > 0 && pageItems.every((c) => selectedIds.has(c.id));

  function toggleAll() {
    if (allPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageItems.forEach((c) => next.delete(c.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageItems.forEach((c) => next.add(c.id));
        return next;
      });
    }
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedCandidates = candidates.filter((c) => selectedIds.has(c.id));
  const selectedCount = selectedIds.size;

  function handleClearSelection() {
    setSelectedIds(new Set());
  }

  function handleCloseConfirm() {
    setCloseModalOpen(false);
    setSelectedIds(new Set());
    showToast({
      message: `${selectedCount} application${selectedCount !== 1 ? 's' : ''} closed.`,
      type: 'success',
    });
  }

  function handleMoveConfirm() {
    setMoveModalOpen(false);
    setSelectedIds(new Set());
    showToast({
      message: `${selectedCount} application${selectedCount !== 1 ? 's' : ''} moved to next stage.`,
      type: 'success',
    });
  }

  return (
    <div className={styles.pipelineWrap}>
      {/* Filter container — two persistent rows */}
      <div className={styles.filterContainer}>
        {/* Row 1: search (left) + selection actions (right, when candidates selected) */}
        <div className={styles.filterRow1}>
          <div className={styles.searchWrap}>
            <IconSearch size={14} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search candidates…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            {search && (
              <button
                className={styles.searchClear}
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                <IconX size={12} />
              </button>
            )}
          </div>
          <div className={styles.selectionArea}>
            {selectedCount > 0 && (
              <div className={styles.selectionInfo}>
                <IconCheck size={14} />
                <span className={styles.selectionCount}>
                  {selectedCount} candidate{selectedCount !== 1 ? 's' : ''} selected
                </span>
                <button
                  className={styles.clearSelectionBtn}
                  onClick={handleClearSelection}
                >
                  Clear selection
                </button>
              </div>
            )}
            <div className={styles.bulkActions}>
              <Button
                variant="brand-ghost"
                size="sm"
                disabled={selectedCount === 0}
                onClick={() => setCloseModalOpen(true)}
              >
                Bulk Reject
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={selectedCount === 0}
                onClick={() => setMoveModalOpen(true)}
              >
                Move Stage
              </Button>
            </div>
          </div>
        </div>

        {/* Row 2: stage chips (left) + sort chip (right) */}
        <div className={styles.filterRow2}>
          <div className={styles.stageChips}>
            {(['all', ...STAGE_ORDER] as const).map((s) => (
              <button
                key={s}
                className={`${styles.stageChip} ${stageFilter === s ? styles.stageChipActive : ''}`}
                onClick={() => {
                  setStageFilter(s);
                  setPage(1);
                }}
              >
                {s === 'all' ? 'All' : s}{' '}
                <span className={styles.stageChipCount}>
                  {stageCounts[s]}
                </span>
              </button>
            ))}
          </div>
          <button
            className={styles.sortChip}
            onClick={() =>
              showToast({ message: 'Sort options — Coming in V1.', type: 'info' })
            }
          >
            Newest
            <IconChevronDown size={12} />
          </button>
        </div>
      </div>

      {/* Candidate table */}
      {filtered.length === 0 ? (
        <div className={styles.emptyPipeline}>
          <IconUsers size={32} style={{ color: 'var(--text-disabled)' }} />
          <p className={styles.emptyPipelineText}>
            {search || stageFilter !== 'all'
              ? 'No candidates match the current filters.'
              : 'No applications for this vacancy yet.'}
          </p>
          {(search || stageFilter !== 'all') && (
            <button
              className={styles.emptyPipelineClear}
              onClick={() => {
                setSearch('');
                setStageFilter('all');
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHead}>
                  <th className={`${styles.th} ${styles.thCheck}`}>
                    <Checkbox
                      checked={allPageSelected}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className={`${styles.th} ${styles.thCandidate}`}>
                    Candidate
                  </th>
                  <th className={`${styles.th} ${styles.thStatus}`}>
                    Status
                  </th>
                  <th className={`${styles.th} ${styles.thStage}`}>
                    Stage
                  </th>
                  <th className={`${styles.th} ${styles.thScore}`}>
                    Score
                  </th>
                  <th className={`${styles.th} ${styles.thActivity}`}>
                    Last Activity
                  </th>
                  <th className={`${styles.th} ${styles.thActions}`} />
                </tr>
              </thead>
              <tbody>
                {pageItems.map((c) => {
                  const app = c.applications.find(
                    (a) => a.vacancyId === vacancyId,
                  )!;
                  const selected = selectedIds.has(c.id);
                  const dotsOpen = dotsOpenId === c.id;

                  return (
                    <tr
                      key={c.id}
                      className={`${styles.tr} ${selected ? styles.trSelected : ''}`}
                    >
                      {/* Checkbox */}
                      <td className={`${styles.td} ${styles.tdCheck}`}>
                        <Checkbox
                          checked={selected}
                          onChange={() => toggleOne(c.id)}
                        />
                      </td>

                      {/* Candidate */}
                      <td className={`${styles.td} ${styles.tdCandidate}`}>
                        <div className={styles.candidateCell}>
                          <Avatar
                            initials={getAvatarInitials(c.name)}
                            size="sm"
                            color="brand"
                          />
                          <div className={styles.candidateInfo}>
                            <span className={styles.candidateName}>
                              {c.name}
                            </span>
                            <span className={styles.candidateEmail}>
                              {c.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className={styles.td}>
                        <StatusBadge status={app.status} />
                      </td>

                      {/* Stage */}
                      <td className={styles.td}>
                        <StageCell stage={app.stage} />
                      </td>

                      {/* Score */}
                      <td className={styles.td}>
                        <ScoreCell score={app.score} />
                      </td>

                      {/* Last Activity */}
                      <td className={`${styles.td} ${styles.tdActivity}`}>
                        <span className={styles.activityEvent}>
                          {app.lastActivity.event}
                        </span>
                        <span className={styles.activityMeta}>
                          {app.lastActivity.timeAgo}
                          {app.lastActivity.by !== 'system' && (
                            <> &bull; {app.lastActivity.by}</>
                          )}
                          {app.lastActivity.by === 'system' && (
                            <>
                              {' '}
                              &bull;{' '}
                              <em className={styles.activitySystem}>system</em>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className={`${styles.td} ${styles.tdActions}`}>
                        <div
                          className={styles.dotsMenuWrap}
                          ref={dotsOpen ? dotsRef : null}
                        >
                          <button
                            className={styles.dotsBtn}
                            onClick={() =>
                              setDotsOpenId(dotsOpen ? null : c.id)
                            }
                            aria-label="More actions"
                          >
                            <IconDots size={16} />
                          </button>
                          {dotsOpen && (
                            <div className={styles.dotsDropdown}>
                              <button
                                className={styles.dotsItem}
                                onClick={() => {
                                  setDotsOpenId(null);
                                  navigate(`/r/applications/${c.id}`, { state: { vacancyId: id } });
                                }}
                              >
                                View application
                              </button>
                              {!isClosed && (
                                <>
                                  <button
                                    className={styles.dotsItem}
                                    onClick={() => {
                                      setDotsOpenId(null);
                                      setSelectedIds(new Set([c.id]));
                                      setMoveModalOpen(true);
                                    }}
                                  >
                                    Move to next stage
                                  </button>
                                  <button
                                    className={`${styles.dotsItem} ${styles.dotsItemDanger}`}
                                    onClick={() => {
                                      setDotsOpenId(null);
                                      setSelectedIds(new Set([c.id]));
                                      setCloseModalOpen(true);
                                    }}
                                  >
                                    Close application
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <span className={styles.paginationInfo}>
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
                {filtered.length} candidates
              </span>
              <div className={styles.paginationBtns}>
                <button
                  className={styles.paginationBtn}
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`${styles.paginationBtn} ${page === i + 1 ? styles.paginationBtnActive : ''}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className={styles.paginationBtn}
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <CloseApplicationsModal
        open={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        selectedCandidates={selectedCandidates}
        vacancyTitle={vacancyTitle}
        onConfirm={handleCloseConfirm}
      />
      <MoveStageModal
        open={moveModalOpen}
        onClose={() => setMoveModalOpen(false)}
        initialCandidates={selectedCandidates}
        vacancyId={vacancyId}
        vacancyTitle={vacancyTitle}
        onConfirm={handleMoveConfirm}
      />
    </div>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────

export default function RecruiterVacancyDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'pipeline'>(
    'overview',
  );
  const [dotsMenuOpen, setDotsMenuOpen] = useState(false);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dotsMenuOpen) return;
    function handler(e: MouseEvent) {
      if (dotsRef.current && !dotsRef.current.contains(e.target as Node)) {
        setDotsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dotsMenuOpen]);

  const vacancy = RECRUITER_VACANCIES.find((v) => v.id === id);
  const detail = VACANCY_DETAILS.find((d) => d.vacancyId === id);

  const pipelineCandidates = useMemo(
    () =>
      PIPELINE_CANDIDATES.filter((c) =>
        c.applications.some((a) => a.vacancyId === id),
      ),
    [id],
  );

  if (!vacancy) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundCard}>
          <IconAlertCircle size={32} style={{ color: 'var(--state-error-text)' }} />
          <p className={styles.notFoundTitle}>Vacancy not found</p>
          <p className={styles.notFoundBody}>
            This vacancy may have been removed or the link is incorrect.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/r/vacancies')}
          >
            Back to vacancies
          </Button>
        </div>
      </div>
    );
  }

  const isOverdue =
    vacancy.status === 'need-action' &&
    vacancy.expectedDecision !== null &&
    new Date(vacancy.expectedDecision) < new Date();

  const isClosed = vacancy.status === 'not-active';

  const overdueBy =
    isOverdue && vacancy.expectedDecision ? daysAgo(vacancy.expectedDecision) : 0;

  const vacancyStatusCfg =
    VACANCY_STATUS_CONFIG[vacancy.status] ?? VACANCY_STATUS_CONFIG.active;

  const overviewDetail: VacancyDetail | null = detail ?? null;

  return (
    <div className={styles.page}>
      {/* Back nav */}
      <button className={styles.back} onClick={() => navigate('/r/vacancies')}>
        <IconArrowLeft size={15} />
        Job Vacancies
      </button>

      <div className={styles.scrollArea}>
        {/* Overdue callout */}
        {isOverdue && (
          <div className={styles.calloutAmber}>
            <IconAlertTriangle size={16} className={styles.calloutIcon} />
            <div className={styles.calloutContent}>
              <span className={styles.calloutText}>
                Expected decision date passed{' '}
                <strong>{overdueBy} day{overdueBy !== 1 ? 's' : ''} ago</strong>.
                Candidates are waiting for a decision.
              </span>
              <div className={styles.calloutActions}>
                <button
                  className={styles.calloutActionBtn}
                  onClick={() =>
                    showToast({
                      message: 'Set new date — Coming in V1.',
                      type: 'info',
                    })
                  }
                >
                  Set new date
                </button>
                <button
                  className={`${styles.calloutActionBtn} ${styles.calloutActionBtnPrimary}`}
                  onClick={() => {
                    setActiveTab('pipeline');
                    showToast({
                      message: 'Move candidates to Final Review — Coming in V1.',
                      type: 'info',
                    });
                  }}
                >
                  Move to Final Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Closed callout */}
        {isClosed && (
          <div className={styles.calloutBlue}>
            <IconInfoCircle size={16} className={styles.calloutIcon} />
            <div className={styles.calloutContent}>
              <span className={styles.calloutText}>
                <strong>This vacancy is closed.</strong> No new applications
                can be received. Candidate data is still accessible.
              </span>
            </div>
          </div>
        )}

        {/* Header card */}
        <div className={styles.headerCard}>
          <div className={styles.headerLeft}>
            <div className={styles.titleRow}>
              <h1 className={styles.jobTitle}>{vacancy.title}</h1>
              <span className={`${styles.vacancyStatusBadge} ${vacancyStatusCfg.cssClass}`}>
                {vacancyStatusCfg.label}
              </span>
            </div>
            <div className={styles.metaRow}>
              {detail && (
                <>
                  <span className={styles.metaItem}>
                    <IconMapPin size={13} />
                    {vacancy.locationWorkMode}
                  </span>
                  <span className={styles.metaDot}>·</span>
                  <span className={styles.metaItem}>
                    <IconBriefcase size={13} />
                    {detail.type}
                  </span>
                  <span className={styles.metaDot}>·</span>
                  <span className={styles.metaItem}>
                    {detail.level}
                  </span>
                  <span className={styles.metaDot}>·</span>
                  <span className={styles.metaItem}>
                    <IconUsers size={13} />
                    {detail.positions} position{detail.positions !== 1 ? 's' : ''}
                  </span>
                  <span className={styles.metaDot}>·</span>
                  <span className={styles.metaItem}>
                    <IconCurrencyDollar size={13} />
                    {detail.salaryRange}
                  </span>
                </>
              )}
              {!detail && (
                <span className={styles.metaItem}>
                  <IconMapPin size={13} />
                  {vacancy.locationWorkMode}
                </span>
              )}
            </div>
            {detail && (
              <div className={styles.dateRow}>
                <span className={styles.dateItem}>
                  <IconCalendarEvent size={13} />
                  Opened {formatDate(detail.openedDate)}
                </span>
                <span className={styles.dateDot}>·</span>
                <span
                  className={`${styles.dateItem} ${isOverdue ? styles.dateItemOverdue : ''}`}
                >
                  Decision by {formatDate(detail.decisionByDate)}
                  {isOverdue && (
                    <span className={styles.overdueTag}>Overdue</span>
                  )}
                </span>
              </div>
            )}
          </div>
          <div className={styles.headerActions}>
            {!isClosed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/r/vacancies/${vacancy.id}/edit`)}
              >
                <IconEdit size={14} />
                Edit vacancy
              </Button>
            )}
            <div className={styles.dotsMenuWrapHeader} ref={dotsRef}>
              <button
                className={styles.dotsButtonHeader}
                onClick={() => setDotsMenuOpen((v) => !v)}
                aria-label="More options"
              >
                <IconDots size={16} />
              </button>
              {dotsMenuOpen && (
                <div className={styles.dotsDropdownHeader}>
                  {!isClosed && (
                    <button
                      className={`${styles.dotsItem} ${styles.dotsItemDanger}`}
                      onClick={() => {
                        setDotsMenuOpen(false);
                        showToast({
                          message: 'Close vacancy — Coming in V1.',
                          type: 'info',
                        });
                      }}
                    >
                      Close vacancy
                    </button>
                  )}
                  <button
                    className={styles.dotsItem}
                    onClick={() => {
                      setDotsMenuOpen(false);
                      showToast({
                        message: 'Duplicate vacancy — Coming in V1.',
                        type: 'info',
                      });
                    }}
                  >
                    Duplicate vacancy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs card */}
        <div className={styles.tabsCard}>
          <div className={styles.tabsNav}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'pipeline' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('pipeline')}
            >
              Pipeline ({pipelineCandidates.length})
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'overview' ? (
              overviewDetail ? (
                <OverviewTab detail={overviewDetail} />
              ) : (
                <div className={styles.noDetail}>
                  <p>Overview data not available for this vacancy.</p>
                </div>
              )
            ) : (
              <PipelineTab
                vacancyId={vacancy.id}
                vacancyTitle={vacancy.title}
                isClosed={isClosed}
                candidates={pipelineCandidates}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
