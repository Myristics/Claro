import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconPlus,
  IconSearch,
  IconSortDescending,
  IconDots,
  IconBriefcase,
  IconFilterOff,
  IconX,
  IconRefresh,
} from '@tabler/icons-react';
import { useToast } from '../../store/useToast';
import { RECRUITER_VACANCIES } from '../../data/mockData';
import type { VacancyStatus, RecruiterVacancy } from '../../data/mockData';
import styles from './RecruiterVacanciesScreen.module.css';

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDecisionDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function daysUntil(iso: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86400000);
}

// ── Status badge ───────────────────────────────────────────────────────────

const STATUS_LABEL: Record<VacancyStatus, string> = {
  'active': 'Active',
  'need-action': 'Need Action',
  'not-active': 'Not Active',
  'draft': 'Draft',
};

const STATUS_CSS: Record<VacancyStatus, string> = {
  'active': styles.badgeActive,
  'need-action': styles.badgeNeedAction,
  'not-active': styles.badgeNotActive,
  'draft': styles.badgeDraft,
};

function StatusBadge({ status }: { status: VacancyStatus }) {
  return (
    <span className={`${styles.badge} ${STATUS_CSS[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

// ── Filter types ───────────────────────────────────────────────────────────

type FilterKey = 'all' | VacancyStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'need-action', label: 'Need Action' },
  { key: 'not-active', label: 'Not Active' },
  { key: 'draft', label: 'Draft' },
];

const PAGE_SIZE = 10;

// ── Main screen ────────────────────────────────────────────────────────────

export default function RecruiterVacanciesScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [page, setPage] = useState(1);

  // Use mock vacancies (in a real app this would come from the store / API)
  const vacancies = RECRUITER_VACANCIES;

  // Counts per status for chip labels
  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = { all: 0, active: 0, 'need-action': 0, 'not-active': 0, draft: 0 };
    vacancies.forEach((v) => {
      c.all++;
      c[v.status]++;
    });
    return c;
  }, [vacancies]);

  // Filter + search
  const filtered = useMemo(() => {
    let list: RecruiterVacancy[] = vacancies;
    if (activeFilter !== 'all') list = list.filter((v) => v.status === activeFilter);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((v) => v.title.toLowerCase().includes(q));
    return list;
  }, [vacancies, activeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleFilterChange(key: FilterKey) {
    setActiveFilter(key);
    setPage(1);
  }

  function handleSearch(val: string) {
    setSearch(val);
    setPage(1);
  }

  // ── Empty state (no vacancies at all) ────────────────────────────────────
  if (vacancies.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.stateCentered}>
          <div className={styles.stateCard}>
            <div className={`${styles.stateIconWrap} ${styles.stateIconTeal}`}>
              <IconBriefcase size={28} />
            </div>
            <h2 className={styles.stateTitle}>No vacancies yet</h2>
            <p className={styles.stateBody}>
              Create your first vacancy to start receiving applications and managing candidates in one place.
            </p>
            <button className={styles.btnPrimary} onClick={() => navigate('/r/vacancies/new')}>
              <IconPlus size={16} />
              Create New Vacancy
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Header + filter bar (shared by table, no-draft, error states) ─────────
  const header = (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Job Vacancies</h1>
          <p className={styles.pageSubtitle}>All candidates across your active vacancies in one place.</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => navigate('/r/vacancies/new')}>
          <IconPlus size={16} />
          Create new vacancy
        </button>
      </div>

      <div className={styles.filterBar}>
        {/* Search */}
        <div className={styles.searchWrap}>
          <IconSearch size={14} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by vacancy name..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Status chips */}
        <div className={styles.chipRow}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`${styles.chip} ${activeFilter === f.key ? styles.chipActive : ''}`}
              onClick={() => handleFilterChange(f.key)}
            >
              {f.label} {counts[f.key]}
            </button>
          ))}
        </div>

        {/* Sort */}
        <button
          className={styles.sortBtn}
          onClick={() => showToast({ message: 'Sorting — coming soon.' })}
        >
          <IconSortDescending size={14} />
          Last Activity
        </button>
      </div>
    </>
  );

  // ── No-draft state (filter=draft, 0 results) ──────────────────────────────
  if (activeFilter === 'draft' && filtered.length === 0) {
    return (
      <div className={styles.page}>
        {header}
        <div className={styles.stateCentered}>
          <div className={styles.stateCard}>
            <div className={`${styles.stateIconWrap} ${styles.stateIconTeal}`}>
              <IconFilterOff size={28} />
            </div>
            <h2 className={styles.stateTitle}>No draft vacancies</h2>
            <p className={styles.stateBody}>
              Vacancies saved as draft will appear here. Switch to All to see your full list.
            </p>
            <div className={styles.stateActions}>
              <button className={styles.btnGhost} onClick={() => handleFilterChange('all')}>
                View All Vacancy
              </button>
              <button className={styles.btnPrimary} onClick={() => navigate('/r/vacancies/new')}>
                <IconPlus size={16} />
                Create New Vacancy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Normal table view ──────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {header}

      <div className={styles.tableWrap}>
        <div className={styles.tableCard}>
          {/* Table header */}
          <div className={styles.tableHead}>
            <div className={`${styles.tableHeaderCell} ${styles.colVacancy}`}>Vacancy</div>
            <div className={`${styles.tableHeaderCell} ${styles.colStatus}`}>Status</div>
            <div className={`${styles.tableHeaderCell} ${styles.colDecision}`}>Expected Decision</div>
            <div className={`${styles.tableHeaderCell} ${styles.colActivity}`}>Last Activity</div>
            <div className={`${styles.tableHeaderCell} ${styles.colAction}`}></div>
          </div>

          {/* Rows */}
          {pageItems.length === 0 ? (
            <div className={styles.tableEmpty}>
              <IconFilterOff size={20} />
              <span>No matching vacancies</span>
            </div>
          ) : (
            pageItems.map((v) => {
              const days = v.expectedDecision ? daysUntil(v.expectedDecision) : null;
              const showDecision = v.expectedDecision !== null && (v.status === 'active' || v.status === 'need-action');
              return (
                <div key={v.id} className={styles.tableRow}>
                  <div className={`${styles.tableCell} ${styles.colVacancy}`}>
                    <span className={styles.vacancyTitle}>{v.title}</span>
                    <span className={styles.vacancyMeta}>{v.locationWorkMode}</span>
                  </div>
                  <div className={`${styles.tableCell} ${styles.colStatus}`}>
                    <StatusBadge status={v.status} />
                  </div>
                  <div className={`${styles.tableCell} ${styles.colDecision}`}>
                    {showDecision && v.expectedDecision ? (
                      <>
                        <span className={styles.decisionDate}>{formatDecisionDate(v.expectedDecision)}</span>
                        {days !== null && days > 0 && (
                          <span className={styles.decisionCountdown}>Decision in {days} days</span>
                        )}
                      </>
                    ) : (
                      <span className={styles.decisionDash}>—</span>
                    )}
                  </div>
                  <div className={`${styles.tableCell} ${styles.colActivity}`}>
                    <span className={styles.activityEvent}>{v.lastActivity.event}</span>
                    <span className={styles.activityMeta}>
                      {v.lastActivity.timeAgo}
                      {v.lastActivity.by !== 'no action taken'
                        ? ` • by ${v.lastActivity.by}`
                        : ` • ${v.lastActivity.by}`}
                    </span>
                  </div>
                  <div className={`${styles.tableCell} ${styles.colAction}`}>
                    <button
                      className={styles.dotsBtn}
                      onClick={() => navigate(`/r/vacancies/${v.id}`)}
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
              Showing {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} vacanc{filtered.length !== 1 ? 'ies' : 'y'}
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
              <span className={styles.pageLabel}>Page {safePage} of {totalPages}</span>
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

      {/* FAB */}
      <button
        className={styles.fab}
        aria-label="Open AI chat"
        onClick={() => showToast({ message: 'AI chat — use the chat bubble from any page.' })}
      >
        <IconRefresh size={20} />
      </button>
    </div>
  );
}

// ── Error variant (exported separately so it can be used as the error boundary fallback) ──
export function RecruiterVacanciesErrorScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = { all: 0, active: 0, 'need-action': 0, 'not-active': 0, draft: 0 };
    RECRUITER_VACANCIES.forEach((v) => { c.all++; c[v.status]++; });
    return c;
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Job Vacancies</h1>
          <p className={styles.pageSubtitle}>All candidates across your active vacancies in one place.</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => navigate('/r/vacancies/new')}>
          <IconPlus size={16} />
          Create new vacancy
        </button>
      </div>
      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <IconSearch size={14} className={styles.searchIcon} />
          <input type="text" className={styles.searchInput} placeholder="Search by vacancy name..." disabled />
        </div>
        <div className={styles.chipRow}>
          {FILTERS.map((f) => (
            <button key={f.key} className={`${styles.chip} ${f.key === 'all' ? styles.chipActive : ''}`} disabled>
              {f.label} {counts[f.key]}
            </button>
          ))}
        </div>
        <button className={styles.sortBtn} disabled>
          <IconSortDescending size={14} />
          Last Activity
        </button>
      </div>
      <div className={styles.stateCentered}>
        <div className={styles.stateCard}>
          <div className={`${styles.stateIconWrap} ${styles.stateIconRed}`}>
            <IconX size={26} strokeWidth={2.5} />
          </div>
          <h2 className={styles.stateTitle}>Your vacancies could not be loaded</h2>
          <p className={styles.stateBody}>
            There may be a temporary issue on our end. Your vacancy data has not been affected.
            Try refreshing the page. If the problem continues,{' '}
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
