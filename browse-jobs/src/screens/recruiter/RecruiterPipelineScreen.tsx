import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconSearch,
  IconChevronDown,
  IconDots,
  IconUsersGroup,
  IconInbox,
  IconX,
  IconRefresh,
  IconMessageChatbot,
} from '@tabler/icons-react';
import { useToast } from '../../store/useToast';
import {
  PIPELINE_CANDIDATES,
  RECRUITER_VACANCIES,
} from '../../data/mockData';
import type { PipelineCandidateStatus, PipelineCandidate, PipelineApplication } from '../../data/mockData';
import styles from './RecruiterPipelineScreen.module.css';

// ── Constants ──────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

// ── Status badge config ────────────────────────────────────────────────────

const STATUS_LABEL: Record<PipelineCandidateStatus, string> = {
  'waiting-for-review': 'Waiting for review',
  'in-progress': 'In progress',
  'shortlisted': 'Shortlisted',
  'offer-sent': 'Offer Sent',
};

const STATUS_CSS: Record<PipelineCandidateStatus, string> = {
  'waiting-for-review': styles.badgeWaitingReview,
  'in-progress': styles.badgeInProgress,
  'shortlisted': styles.badgeShortlisted,
  'offer-sent': styles.badgeOfferSent,
};

const ALL_STATUSES: PipelineCandidateStatus[] = [
  'waiting-for-review',
  'in-progress',
  'shortlisted',
  'offer-sent',
];

function StatusBadge({ status }: { status: PipelineCandidateStatus }) {
  return (
    <span className={`${styles.badge} ${STATUS_CSS[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

// ── Applied-For cell with "+N more" tooltip ────────────────────────────────

function AppliedForCell({
  candidate,
  selectedVacancyId,
  onSelectVacancy,
  tooltipOpen,
  onToggleTooltip,
}: {
  candidate: PipelineCandidate;
  selectedVacancyId: string;
  onSelectVacancy: (id: string) => void;
  tooltipOpen: boolean;
  onToggleTooltip: () => void;
}) {
  const cellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tooltipOpen) return;
    function handleOutside(e: MouseEvent) {
      if (cellRef.current && !cellRef.current.contains(e.target as Node)) {
        onToggleTooltip();
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [tooltipOpen, onToggleTooltip]);

  const displayed = candidate.applications.find((a) => a.vacancyId === selectedVacancyId) ?? candidate.applications[0];
  const extra = candidate.applications.length - 1;

  return (
    <div ref={cellRef} className={styles.appliedForCell}>
      {/* Title row: role name + "+N more" chip on same line */}
      <div className={styles.appliedForTitleRow}>
        <span className={styles.appliedForTitle}>{displayed.title}</span>

        {extra > 0 && (
          <div className={styles.moreChipWrap}>
            <button
              className={styles.moreChip}
              onClick={(e) => {
                e.stopPropagation();
                onToggleTooltip();
              }}
            >
              +{extra} more
            </button>
            {tooltipOpen && (
              <div className={styles.tooltip}>
                {candidate.applications.map((a) => (
                  <button
                    key={a.vacancyId}
                    className={`${styles.tooltipItem} ${a.vacancyId === selectedVacancyId ? styles.tooltipItemActive : ''}`}
                    onClick={() => {
                      onSelectVacancy(a.vacancyId);
                      onToggleTooltip();
                    }}
                  >
                    <span className={styles.tooltipItemTitle}>{a.title}</span>
                    <span className={styles.tooltipItemMeta}>{a.locationWorkMode}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Location / work-mode below */}
      <span className={styles.appliedForMeta}>{displayed.locationWorkMode}</span>
    </div>
  );
}

// ── Dropdown component ─────────────────────────────────────────────────────

function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | 'all';
  options: { key: T | 'all'; label: string }[];
  onChange: (val: T | 'all') => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const activeLabel = options.find((o) => o.key === value)?.label ?? label;

  return (
    <div ref={wrapRef} className={styles.dropdownWrap}>
      <button
        className={`${styles.chip} ${value !== 'all' ? styles.chipActive : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        {activeLabel}
        <IconChevronDown size={13} />
      </button>
      {open && (
        <div className={styles.dropdown}>
          {options.map((opt) => (
            <button
              key={opt.key}
              className={`${styles.dropdownItem} ${value === opt.key ? styles.dropdownItemActive : ''}`}
              onClick={() => {
                onChange(opt.key);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────

export default function RecruiterPipelineScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PipelineCandidateStatus | 'all'>('all');
  const [vacancyFilter, setVacancyFilter] = useState<string | 'all'>('all');
  const [page, setPage] = useState(1);
  const [tooltipCandidateId, setTooltipCandidateId] = useState<string | null>(null);
  // tracks which vacancy is displayed per candidate row (defaults to appliedFor[0])
  const [selectedVacancy, setSelectedVacancy] = useState<Record<string, string>>({});

  const candidates = PIPELINE_CANDIDATES;
  const activeOrNotActiveVacancies = RECRUITER_VACANCIES.filter(
    (v) => v.status === 'active' || v.status === 'not-active',
  );

  // ── Empty state: no vacancies at all ────────────────────────────────────
  if (candidates.length === 0 && activeOrNotActiveVacancies.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.stateCentered}>
          <div className={styles.stateCard}>
            <div className={`${styles.stateIconWrap} ${styles.stateIconTeal}`}>
              <IconUsersGroup size={28} />
            </div>
            <h2 className={styles.stateTitle}>No candidates yet</h2>
            <p className={styles.stateBody}>
              Candidates will appear here once you have an active vacancy. Create and publish a
              vacancy to start receiving applications.
            </p>
            <button className={styles.btnPrimary} onClick={() => navigate('/r/vacancies/new')}>
              Create New Vacancy
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Vacancy active, waiting for applications ─────────────────────────────
  if (candidates.length === 0 && RECRUITER_VACANCIES.some((v) => v.status === 'active')) {
    return (
      <div className={styles.page}>
        <PipelineHeader />
        <PipelineFilterBar
          search=""
          onSearch={() => {}}
          statusFilter="all"
          onStatusFilter={() => {}}
          vacancyFilter="all"
          onVacancyFilter={() => {}}
          onSort={() => {}}
          disabled
        />
        <div className={styles.stateCentered}>
          <div className={styles.stateCard}>
            <div className={`${styles.stateIconWrap} ${styles.stateIconTeal}`}>
              <IconInbox size={28} />
            </div>
            <h2 className={styles.stateTitle}>Waiting for applications</h2>
            <p className={styles.stateBody}>
              Your vacancy is live — candidates will appear here as they apply. This usually takes
              a few hours after publishing.
            </p>
          </div>
        </div>
        <FabButton />
      </div>
    );
  }

  // ── Filter + search ──────────────────────────────────────────────────────
  const filtered = candidates.filter((c) => {
    if (statusFilter !== 'all' && !c.applications.some((a) => a.status === statusFilter)) return false;
    if (vacancyFilter !== 'all' && !c.applications.some((a) => a.vacancyId === vacancyFilter)) return false;
    const q = search.trim().toLowerCase();
    if (q) {
      const matchName = c.name.toLowerCase().includes(q);
      const matchEmail = c.email.toLowerCase().includes(q);
      const matchRole = c.applications.some((a) => a.title.toLowerCase().includes(q));
      if (!matchName && !matchEmail && !matchRole) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleSearch(val: string) {
    setSearch(val);
    setPage(1);
  }

  function handleStatusFilter(val: PipelineCandidateStatus | 'all') {
    setStatusFilter(val);
    setPage(1);
  }

  function handleVacancyFilter(val: string | 'all') {
    setVacancyFilter(val);
    setPage(1);
  }

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
    setVacancyFilter('all');
    setPage(1);
  }

  function toggleTooltip(id: string) {
    setTooltipCandidateId((prev) => (prev === id ? null : id));
  }

  // ── Normal table view ────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <PipelineHeader />
      <PipelineFilterBar
        search={search}
        onSearch={handleSearch}
        statusFilter={statusFilter}
        onStatusFilter={handleStatusFilter}
        vacancyFilter={vacancyFilter}
        onVacancyFilter={handleVacancyFilter}
        onSort={() => showToast({ message: 'Sorting — coming soon.' })}
        disabled={false}
      />

      <div className={styles.tableWrap}>
        <div className={styles.tableCard}>
          {/* Table head */}
          <div className={styles.tableHead}>
            <div className={`${styles.tableHeaderCell} ${styles.colCandidate}`}>Candidate</div>
            <div className={`${styles.tableHeaderCell} ${styles.colAppliedFor}`}>Applied For</div>
            <div className={`${styles.tableHeaderCell} ${styles.colStatus}`}>Status</div>
            <div className={`${styles.tableHeaderCell} ${styles.colActivity}`}>Last Activity</div>
            <div className={`${styles.tableHeaderCell} ${styles.colAction}`}></div>
          </div>

          {/* Rows */}
          {pageItems.length === 0 ? (
            <div className={styles.tableEmpty}>
              <div className={styles.tableEmptyInner}>
                <p className={styles.tableEmptyTitle}>No candidates match your search</p>
                <button className={styles.btnGhost} onClick={clearFilters}>
                  Clear all filters
                </button>
              </div>
            </div>
          ) : (
            pageItems.map((c) => {
              const activeVacancyId = selectedVacancy[c.id] ?? c.applications[0].vacancyId;
              const displayApp: PipelineApplication =
                c.applications.find((a) => a.vacancyId === activeVacancyId) ?? c.applications[0];

              return (
                <div key={c.id} className={styles.tableRow}>
                  {/* Candidate */}
                  <div className={`${styles.tableCell} ${styles.colCandidate}`}>
                    <span className={styles.candidateName}>{c.name}</span>
                    <span className={styles.candidateEmail}>{c.email}</span>
                  </div>

                  {/* Applied For */}
                  <div className={`${styles.tableCell} ${styles.colAppliedFor}`}>
                    <AppliedForCell
                      candidate={c}
                      selectedVacancyId={activeVacancyId}
                      onSelectVacancy={(vacancyId) =>
                        setSelectedVacancy((prev) => ({ ...prev, [c.id]: vacancyId }))
                      }
                      tooltipOpen={tooltipCandidateId === c.id}
                      onToggleTooltip={() => toggleTooltip(c.id)}
                    />
                  </div>

                  {/* Status — reflects the currently displayed application */}
                  <div className={`${styles.tableCell} ${styles.colStatus}`}>
                    <StatusBadge status={displayApp.status} />
                  </div>

                  {/* Last Activity — reflects the currently displayed application */}
                  <div className={`${styles.tableCell} ${styles.colActivity}`}>
                    <span className={styles.activityEvent}>{displayApp.lastActivity.event}</span>
                    <span className={styles.activityMeta}>
                      {displayApp.lastActivity.timeAgo}
                      {displayApp.lastActivity.by === 'system' ? (
                        <>
                          {' • by '}
                          <em className={styles.activitySystem}>system</em>
                        </>
                      ) : (
                        ` • by ${displayApp.lastActivity.by}`
                      )}
                    </span>
                  </div>

                  {/* Action */}
                  <div className={`${styles.tableCell} ${styles.colAction}`}>
                    <button
                      className={styles.dotsBtn}
                      onClick={() => navigate(`/r/applications/${c.id}`)}
                      aria-label="Options"
                    >
                      <IconDots size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Footer */}
          <div className={styles.tableFooter}>
            <span className={styles.footerCount}>
              Showing {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}{' '}
              candidate{filtered.length !== 1 ? 's' : ''}
            </span>
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                aria-label="Previous page"
              >
                ‹
              </button>
              <span className={styles.pageLabel}>
                Page {safePage} of {totalPages}
              </span>
              <button
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      <FabButton />
    </div>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────

function PipelineHeader() {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.headerLeft}>
        <h1 className={styles.pageTitle}>Candidate Pipeline</h1>
        <p className={styles.pageSubtitle}>
          Manage all your active and draft hiring roles in one place.
        </p>
      </div>
    </div>
  );
}

function PipelineFilterBar({
  search,
  onSearch,
  statusFilter,
  onStatusFilter,
  vacancyFilter,
  onVacancyFilter,
  onSort,
  disabled,
}: {
  search: string;
  onSearch: (val: string) => void;
  statusFilter: PipelineCandidateStatus | 'all';
  onStatusFilter: (val: PipelineCandidateStatus | 'all') => void;
  vacancyFilter: string | 'all';
  onVacancyFilter: (val: string | 'all') => void;
  onSort: () => void;
  disabled: boolean;
}) {
  const statusOptions: { key: PipelineCandidateStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All Status' },
    ...ALL_STATUSES.map((s) => ({ key: s as PipelineCandidateStatus | 'all', label: STATUS_LABEL[s] })),
  ];

  const vacancyOptions: { key: string | 'all'; label: string }[] = [
    { key: 'all', label: 'All Vacancies' },
    ...RECRUITER_VACANCIES.filter((v) => v.status === 'active' || v.status === 'not-active').map(
      (v) => ({ key: v.id, label: v.title }),
    ),
  ];

  return (
    <div className={styles.filterBar}>
      {/* Search */}
      <div className={styles.searchWrap}>
        <IconSearch size={14} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by name, email or role..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          disabled={disabled}
        />
      </div>

      {/* Right-side chips */}
      <div className={styles.chipRow}>
        {disabled ? (
          <>
            <button className={styles.chip} disabled>
              All Status <IconChevronDown size={13} />
            </button>
            <button className={styles.chip} disabled>
              All Vacancies <IconChevronDown size={13} />
            </button>
            <button className={styles.chip} disabled>
              ⇵ Last Activity
            </button>
          </>
        ) : (
          <>
            <FilterDropdown
              label="All Status"
              value={statusFilter}
              options={statusOptions}
              onChange={onStatusFilter}
            />
            <FilterDropdown
              label="All Vacancies"
              value={vacancyFilter}
              options={vacancyOptions as { key: string | 'all'; label: string }[]}
              onChange={onVacancyFilter}
            />
            <button className={styles.chip} onClick={onSort}>
              ⇵ Last Activity
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function FabButton() {
  const { showToast } = useToast();
  return (
    <button
      className={styles.fab}
      aria-label="Open AI chat"
      onClick={() => showToast({ message: 'AI chat — use the chat bubble from any page.' })}
    >
      <IconMessageChatbot size={20} />
    </button>
  );
}

// ── Error variant ──────────────────────────────────────────────────────────

export function RecruiterPipelineErrorScreen() {
  const { showToast } = useToast();

  return (
    <div className={styles.page}>
      <PipelineHeader />
      <PipelineFilterBar
        search=""
        onSearch={() => {}}
        statusFilter="all"
        onStatusFilter={() => {}}
        vacancyFilter="all"
        onVacancyFilter={() => {}}
        onSort={() => {}}
        disabled
      />
      <div className={styles.stateCentered}>
        <div className={styles.stateCard}>
          <div className={`${styles.stateIconWrap} ${styles.stateIconRed}`}>
            <IconX size={26} strokeWidth={2.5} />
          </div>
          <h2 className={styles.stateTitle}>Candidate pipeline could not be loaded</h2>
          <p className={styles.stateBody}>
            There may be a temporary issue on our end. Your data has not been affected. Try
            refreshing the page. If the problem continues,{' '}
            <button
              className={styles.inlineLink}
              onClick={() => showToast({ message: 'Use the AI chat bubble for help.' })}
            >
              ask AI for help.
            </button>
          </p>
          <button className={styles.refreshBtn} onClick={() => window.location.reload()}>
            <IconRefresh size={15} />
            Refresh page
          </button>
        </div>
      </div>
    </div>
  );
}
