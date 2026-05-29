/**
 * BrowseJobsScreen — re-authored from Figma node 40:626
 * Visual source: figma.com/design/VlpM9cWClIQ2Z9NXDG4XPN?node-id=40-626
 *
 * States:
 *  default       — 2-col job card grid
 *  loading       — skeleton cards
 *  error         — 3-layer error callout
 *  empty         — no jobs at all
 *  search-empty  — search returns no results
 *  filter-empty  — active filters return no results
 */

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  IconSearch,
  IconChevronDown,
  IconBriefcase,
  IconFilterOff,
  IconRefresh,
  IconAlertCircle,
  IconCoins,
  IconClock,
  IconUsers,
  IconClipboard,
  IconArrowRight,
  IconSortDescending,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import { JOBS } from '../../data/mockData';
import { Skeleton } from '../../components/ds';
import type { AssessmentType, Job } from '../../store/types';
import styles from './BrowseJobsScreen.module.css';

// ── Constants ──────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const ROLE_OPTIONS = ['All', 'Full-time', 'Part-time', 'Contract', 'Freelance'] as const;
const EXPERIENCE_OPTIONS = ['All', 'Entry-level', 'Mid-level', 'Senior'] as const;
const SORT_OPTIONS = ['Relevance', 'Newest', 'Closing soon'] as const;

/** Label shown in the "Includes:" badge row — matches Figma card labels */
const ASSESSMENT_LABEL: Record<AssessmentType, string> = {
  cognitive:   'Simulation',
  personality: 'Personality',
  technical:   'Technical',
  interview:   'AI Interview',
};

// ── Helpers ────────────────────────────────────────────────────────────────

/** "Rp 8.000.000 – Rp 12.000.000"  →  "IDR 8M - 12M" */
function formatSalary(range: string): string {
  const parts = range.split('–').map(p => p.trim());
  const toShort = (s: string) => {
    const n = parseInt(s.replace(/[^\d]/g, ''), 10);
    if (n >= 1_000_000) return `${n / 1_000_000}M`;
    if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
    return `${n}`;
  };
  if (parts.length === 2) return `IDR ${toShort(parts[0])} - ${toShort(parts[1])}`;
  return range;
}

/** ISO date  →  "Closes in N days" (or "Closed") */
function closingLabel(iso: string): string {
  const diff = Math.ceil(
    (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff <= 0) return 'Closed';
  if (diff === 1) return 'Closes in 1 day';
  return `Closes in ${diff} days`;
}

function getLocationOptions(): string[] {
  const seen = new Set<string>();
  const list: string[] = ['All'];
  for (const j of JOBS) {
    const city = j.location.split(',')[0].trim();
    if (!seen.has(city)) { seen.add(city); list.push(city); }
  }
  return list;
}

function getIndustryOptions(): string[] {
  const seen = new Set<string>();
  const list: string[] = ['All'];
  for (const j of JOBS) {
    if (!seen.has(j.industry)) { seen.add(j.industry); list.push(j.industry); }
  }
  return list;
}

// ── FilterChip component ───────────────────────────────────────────────────

type FilterChipProps = {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  alignDropdown?: 'left' | 'right';
};

function FilterChip({ label, options, value, onChange, alignDropdown = 'left' }: FilterChipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = value !== 'All';

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className={styles.chipWrapper}>
      <button
        className={`${styles.chip} ${isActive ? styles.chipActive : ''}`}
        onClick={() => setOpen(o => !o)}
        type="button"
      >
        <span>{isActive ? value : label}</span>
        <span className={styles.chipIconRight}><IconChevronDown size={12} /></span>
      </button>

      {open && (
        <div className={`${styles.chipDropdown} ${alignDropdown === 'right' ? styles.chipDropdownRight : ''}`}>
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              className={`${styles.chipOption} ${value === opt ? styles.chipOptionActive : ''}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── SortChip component ─────────────────────────────────────────────────────

function SortChip({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className={styles.chipWrapper}>
      <button
        className={`${styles.chip} ${value !== 'Relevance' ? styles.chipActive : ''}`}
        onClick={() => setOpen(o => !o)}
        type="button"
      >
        <span className={styles.chipIconLeft}><IconSortDescending size={12} /></span>
        <span>{value}</span>
      </button>

      {open && (
        <div className={`${styles.chipDropdown} ${styles.chipDropdownRight}`}>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt}
              type="button"
              className={`${styles.chipOption} ${value === opt ? styles.chipOptionActive : ''}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── SkeletonCard ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      {/* Header row */}
      <div className={styles.skeletonHeaderRow}>
        <Skeleton width={48} height={48} />
        <div className={styles.skeletonTitleBlock}>
          <Skeleton height={16} width="62%" />
          <Skeleton height={14} width="38%" />
        </div>
        <Skeleton width={90} height={24} />
      </div>
      {/* Info row */}
      <Skeleton height={14} width="68%" />
      {/* Badge row */}
      <div className={styles.skeletonBadgeRow}>
        <Skeleton width={88} height={20} />
        <Skeleton width={110} height={20} />
        <Skeleton width={72} height={20} />
      </div>
      {/* Includes row */}
      <div className={styles.skeletonIncludesRow}>
        <Skeleton width={58} height={20} />
        <Skeleton width={82} height={20} />
        <Skeleton width={32} height={20} />
      </div>
    </div>
  );
}

// ── JobCard ────────────────────────────────────────────────────────────────

function JobCard({ job }: { job: Job }) {
  // Show max 2 assessment badges + overflow count
  const visible = job.includes.slice(0, 2);
  const overflow = job.includes.length - 2;

  return (
    <Link to={`/jobs/${job.id}`} className={styles.jobCard}>

      {/* ── Header: logo + title + "View details" ── */}
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <div
            className={styles.logoContainer}
            style={{ background: job.companyColor, borderColor: job.companyColor }}
          >
            <span className={styles.logoInitials}>{job.companyLogoInitials}</span>
          </div>
          <div className={styles.titleContainer}>
            <p className={styles.jobTitle}>{job.title}</p>
            <p className={styles.companyName}>{job.company}</p>
          </div>
        </div>
        <div className={styles.viewDetailsBtn}>
          View details
          <IconArrowRight size={14} />
        </div>
      </div>

      {/* ── Info row: Type • Location • Work mode ── */}
      <div className={styles.infoRow}>
        <span className={styles.infoText}>{job.type}</span>
        <span className={styles.infoSep}>•</span>
        <span className={styles.infoText}>{job.location}</span>
        <span className={styles.infoSep}>•</span>
        <span className={styles.infoText}>{job.workMode}</span>
      </div>

      {/* ── Badge row: salary | days | positions ── */}
      <div className={styles.badgeRow}>
        <span className={`${styles.badge} ${styles.badgeSalary}`}>
          <IconCoins size={12} />
          {formatSalary(job.salaryRange)}
        </span>
        <span className={`${styles.badge} ${styles.badgeBlue}`}>
          <IconClock size={12} />
          Approx. {job.processingDays} days
        </span>
        <span className={`${styles.badge} ${styles.badgeBlue}`}>
          <IconUsers size={12} />
          {job.positions} Position{job.positions !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Includes row: assessment types + closing date ── */}
      <div className={styles.includesRow}>
        <span className={styles.includesLabel}>Includes:</span>
        <div className={styles.includesBadges}>
          {visible.map(type => (
            <span key={type} className={`${styles.badge} ${styles.badgeGray}`}>
              <IconClipboard size={12} />
              {ASSESSMENT_LABEL[type]}
            </span>
          ))}
          {overflow > 0 && (
            <span className={`${styles.badge} ${styles.badgeGray}`}>+{overflow}</span>
          )}
        </div>
        <span className={styles.closingDate}>{closingLabel(job.closingDate)}</span>
      </div>

    </Link>
  );
}

// ── Pagination component ───────────────────────────────────────────────────

type PaginationProps = {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
};

function Pagination({ page, totalPages, onPage }: PaginationProps) {
  // Build page number list: always show first, last, current ±1, with ellipsis
  const pages: (number | '…')[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  return (
    <div className={styles.pagination}>
      <div className={styles.paginationControls}>
        <button
          className={styles.pageBtn}
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <IconChevronLeft size={15} />
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className={styles.pageEllipsis}>…</span>
          ) : (
            <button
              key={p}
              className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
              onClick={() => onPage(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          className={styles.pageBtn}
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <IconChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

type PageStatus = 'default' | 'loading' | 'error';

export default function BrowseJobsScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawState = searchParams.get('state');
  const pageStatus: PageStatus =
    rawState === 'loading' || rawState === 'error' ? rawState : 'default';

  const [search,     setSearch]     = useState('');
  const [role,       setRole]       = useState('All');
  const [location,   setLocation]   = useState('All');
  const [industry,   setIndustry]   = useState('All');
  const [experience, setExperience] = useState('All');
  const [sortBy,     setSortBy]     = useState('Relevance');
  const [page,       setPage]       = useState(1);

  const LOCATION_OPTIONS = useMemo(getLocationOptions, []);
  const INDUSTRY_OPTIONS = useMemo(getIndustryOptions, []);

  const hasSearch = search.trim().length > 0;
  const hasFilter = role !== 'All' || location !== 'All' || industry !== 'All' || experience !== 'All';

  const filteredJobs = useMemo<Job[]>(() => {
    if (pageStatus !== 'default') return [];

    let list = JOBS.filter(j => {
      if (!j.isOpen) return false;
      const q = search.trim().toLowerCase();
      if (q && !j.title.toLowerCase().includes(q) && !j.company.toLowerCase().includes(q)) return false;
      if (role       !== 'All' && j.type             !== role)       return false;
      if (location   !== 'All' && !j.location.startsWith(location)) return false;
      if (industry   !== 'All' && j.industry         !== industry)   return false;
      if (experience !== 'All' && j.experienceLevel  !== experience) return false;
      return true;
    });

    if (sortBy === 'Newest')       list = [...list].sort((a, b) => new Date(b.postedAt).getTime()     - new Date(a.postedAt).getTime());
    if (sortBy === 'Closing soon') list = [...list].sort((a, b) => new Date(a.closingDate).getTime()  - new Date(b.closingDate).getTime());
    return list;
  }, [search, role, location, industry, experience, sortBy, pageStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);

  // Reset to page 1 whenever filters or search change
  useEffect(() => { setPage(1); }, [search, role, location, industry, experience, sortBy]);

  const pageJobs = useMemo(
    () => filteredJobs.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filteredJobs, safePage],
  );

  const goToPage = useCallback((p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Chunk into rows of 2 for the Figma 2-col grid
  const rows = useMemo(() => {
    const out: Job[][] = [];
    for (let i = 0; i < pageJobs.length; i += 2) out.push(pageJobs.slice(i, i + 2));
    return out;
  }, [pageJobs]);

  function clearAll() {
    setSearch('');
    setRole('All');
    setLocation('All');
    setIndustry('All');
    setExperience('All');
  }

  // ── Body ────────────────────────────────────────────────────

  function renderBody() {

    // ── Loading ──────────────────────────────────────────────
    if (pageStatus === 'loading') {
      return (
        <div className={styles.jobListings}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.jobRow}>
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ))}
        </div>
      );
    }

    // ── Error — 3-layer pattern (CLAUDE.md §10) ──────────────
    if (pageStatus === 'error') {
      return (
        <div className={styles.stateCenter}>
          <div className={styles.stateBox}>
            <div className={`${styles.stateIcon} ${styles.stateIconError}`}>
              <IconAlertCircle size={28} />
            </div>
            <p className={styles.stateTitle}>Could not load job listings</p>
            <p className={styles.stateBody}>
              There may be a temporary issue with our service. Try refreshing the page. If the problem continues, please try again later.
            </p>
            <button className={styles.stateBtnPrimary} onClick={() => navigate('/jobs')}>
              <IconRefresh size={15} />
              Refresh page
            </button>
          </div>
        </div>
      );
    }

    // ── Empty states ─────────────────────────────────────────

    if (filteredJobs.length === 0) {

      // Search + filter both active → no match
      if (hasSearch && hasFilter) {
        return (
          <div className={styles.stateCenter}>
            <div className={styles.stateBox}>
              <div className={`${styles.stateIcon} ${styles.stateIconBrand}`}>
                <IconFilterOff size={28} />
              </div>
              <p className={styles.stateTitle}>No roles match your search and filters</p>
              <p className={styles.stateBody}>
                Try a broader search term or removing some active filters to see more results.
              </p>
              <div className={styles.stateActions}>
                <button className={styles.stateBtnGhost} onClick={() => setSearch('')}>Clear search</button>
                <button className={styles.stateBtnPrimary} onClick={clearAll}>Clear all filters</button>
              </div>
            </div>
          </div>
        );
      }

      // Search active, no filter → search no match
      if (hasSearch) {
        return (
          <div className={styles.stateCenter}>
            <div className={styles.stateBox}>
              <div className={`${styles.stateIcon} ${styles.stateIconBrand}`}>
                <IconSearch size={28} />
              </div>
              <p className={styles.stateTitle}>No roles match "{search.trim()}"</p>
              <p className={styles.stateBody}>
                Try a broader search term or browse all open positions to see what&rsquo;s available.
              </p>
              <button className={styles.stateBtnPrimary} onClick={() => setSearch('')}>
                Clear search
              </button>
            </div>
          </div>
        );
      }

      // Filter active, no search → filter no match
      if (hasFilter) {
        return (
          <div className={styles.stateCenter}>
            <div className={styles.stateBox}>
              <div className={`${styles.stateIcon} ${styles.stateIconBrand}`}>
                <IconBriefcase size={28} />
              </div>
              <p className={styles.stateTitle}>No roles match the active filters</p>
              <p className={styles.stateBody}>
                Adjust or remove some filters to see more open positions.
              </p>
              <button className={styles.stateBtnPrimary} onClick={clearAll}>
                Clear filters
              </button>
            </div>
          </div>
        );
      }

      // No jobs at all (empty mock — shouldn't happen in practice)
      return (
        <div className={styles.stateCenter}>
          <div className={styles.stateBox}>
            <div className={`${styles.stateIcon} ${styles.stateIconBrand}`}>
              <IconBriefcase size={28} />
            </div>
            <p className={styles.stateTitle}>No open positions right now</p>
            <p className={styles.stateBody}>
              New roles are added regularly. Check back soon or set up alerts in your profile.
            </p>
          </div>
        </div>
      );
    }

    // ── Default — 2-col job grid ─────────────────────────────
    return (
      <>
        <div className={styles.jobListings}>
          {rows.map((row, i) => (
            <div key={i} className={styles.jobRow}>
              {row.map(job => <JobCard key={job.id} job={job} />)}
              {/* Fill empty slot on odd-count results */}
              {row.length === 1 && <div className={styles.jobRowSpacer} />}
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <Pagination
            page={safePage}
            totalPages={totalPages}
            onPage={goToPage}
          />
        )}
      </>
    );
  }

  // ── Full render ────────────────────────────────────────────

  return (
    <div className={styles.page}>
      <div className={styles.mainContent}>

        {/* ── Page header ── */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Browse Jobs</h1>
          <p className={styles.pageSubtitle}>
            Find a role and see exactly what hiring will look like before you apply.
          </p>
        </div>

        {/* ── Filter bar ── */}
        <div className={styles.filterBar}>
          <div className={styles.filterBarLeft}>
            {/* Search field */}
            <div className={styles.searchField}>
              <span className={styles.searchIconWrap}><IconSearch size={18} /></span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search by role, company..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Filter chips */}
            <div className={styles.filterChips}>
              <FilterChip label="Role"       options={ROLE_OPTIONS}       value={role}       onChange={setRole} />
              <FilterChip label="Location"   options={LOCATION_OPTIONS}   value={location}   onChange={setLocation} />
              <FilterChip label="Industry"   options={INDUSTRY_OPTIONS}   value={industry}   onChange={setIndustry} />
              <FilterChip label="Experience" options={EXPERIENCE_OPTIONS} value={experience} onChange={setExperience} />
            </div>
          </div>

          {/* Sort chip (right-aligned) */}
          <SortChip value={sortBy} onChange={setSortBy} />
        </div>

        {/* ── Body ── */}
        {renderBody()}

      </div>
    </div>
  );
}
