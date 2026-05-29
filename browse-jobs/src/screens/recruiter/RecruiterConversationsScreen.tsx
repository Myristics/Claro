import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconSearch,
  IconSparkles,
  IconPin,
  IconChevronDown,
  IconMessage2,
  IconArrowsSort,
} from '@tabler/icons-react';
import { useStore } from '../../store/useStore';
import styles from './RecruiterConversationsScreen.module.css';

// ── Types ──────────────────────────────────────────────────────

type FilterKey = 'all' | 'unread' | 'pending';
type SortOrder = 'newest' | 'oldest';

// ── Constants ──────────────────────────────────────────────────

const PINNED_IDS = ['conv-general', 'conv-1'];

const FILTER_LABELS: Record<FilterKey, string> = {
  all: 'All',
  unread: 'Unread',
  pending: 'Pending',
};

// ── Helpers ────────────────────────────────────────────────────

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function getLastPreview(messages: { role: string; content: string }[], maxLen = 100): string {
  if (messages.length === 0) return '';
  const last = messages[messages.length - 1];
  return last.content.length > maxLen ? last.content.slice(0, maxLen) + '…' : last.content;
}

// ── Component ──────────────────────────────────────────────────

export default function RecruiterConversationsScreen() {
  const navigate = useNavigate();
  const conversations = useStore((s) => s.conversations);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOrder>('newest');

  const pinnedConvs = useMemo(
    () =>
      PINNED_IDS.map((id) => conversations.find((c) => c.id === id)).filter(
        Boolean,
      ) as typeof conversations,
    [conversations],
  );

  const gridConvs = useMemo(() => {
    let list = conversations.filter((c) => !PINNED_IDS.includes(c.id));

    if (filter === 'unread') list = list.filter((c) => c.unread);
    if (filter === 'pending') list = list.filter((c) => c.messages.length === 0);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.jobTitle.toLowerCase().includes(q) || c.company.toLowerCase().includes(q),
      );
    }

    return [...list].sort((a, b) => {
      const d = new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
      return sort === 'newest' ? d : -d;
    });
  }, [conversations, filter, search, sort]);

  return (
    <div className={styles.page}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>AI Chats</h1>
        <p className={styles.pageSubtitle}>Candidate conversations with Claro AI</p>
      </div>

      {/* ── Filter bar (fixed, below description) ──────────────── */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <IconSearch size={14} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search conversations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search conversations"
          />
        </div>
        <div className={styles.filterChips}>
          {(Object.keys(FILTER_LABELS) as FilterKey[]).map((f) => (
            <button
              key={f}
              className={`${styles.filterChip} ${filter === f ? styles.filterChipActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
          <button
            className={styles.sortChip}
            onClick={() => setSort((s) => (s === 'newest' ? 'oldest' : 'newest'))}
          >
            <IconArrowsSort size={13} />
            {sort === 'newest' ? 'Newest' : 'Oldest'}
            <IconChevronDown size={13} />
          </button>
        </div>
      </div>

      <div className={styles.scrollArea}>
        <div className={styles.inner}>

          {/* ── PINNED ──────────────────────────────────────────── */}
          {pinnedConvs.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>
                <IconPin size={12} />
                PINNED
              </div>
              <div className={styles.pinnedRow}>
                {pinnedConvs.map((conv) => (
                  <div
                    key={conv.id}
                    className={styles.pinnedCard}
                    onClick={() => navigate(`/r/conversations/${conv.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ')
                        navigate(`/r/conversations/${conv.id}`);
                    }}
                  >
                    <div className={styles.cardTopRow}>
                      <span className={styles.cardTitle}>{conv.jobTitle || 'General'}</span>
                      <span className={styles.cardTimestamp}>
                        {formatRelativeTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    {conv.company && (
                      <div className={styles.cardContext}>{conv.company}</div>
                    )}
                    {conv.messages.length > 0 && (
                      <div className={styles.cardLastMsg}>
                        "{getLastPreview(conv.messages, 80)}"
                      </div>
                    )}
                    <div className={styles.cardMeta}>
                      <IconMessage2 size={11} />
                      <span>
                        {conv.messages.length} message
                        {conv.messages.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Card grid ────────────────────────────────────────── */}
          {gridConvs.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrap}>
                <IconSparkles size={22} />
              </div>
              <p className={styles.emptyTitle}>No conversations</p>
              <p className={styles.emptySub}>
                {filter !== 'all'
                  ? 'No conversations match this filter.'
                  : 'Candidate conversations will appear here.'}
              </p>
            </div>
          ) : (
            <div className={styles.cardGrid}>
              {gridConvs.map((conv) => (
                <div
                  key={conv.id}
                  className={`${styles.convCard} ${conv.unread ? styles.convCardUnread : ''}`}
                  onClick={() => navigate(`/r/conversations/${conv.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                      navigate(`/r/conversations/${conv.id}`);
                  }}
                >
                  <div className={styles.cardTopRow}>
                    <span className={styles.cardTitle}>{conv.jobTitle || 'General'}</span>
                    <span className={styles.cardTimestamp}>
                      {formatRelativeTime(conv.lastMessageAt)}
                    </span>
                  </div>
                  {conv.company && (
                    <div className={styles.cardContext}>{conv.company}</div>
                  )}
                  {conv.messages.length > 0 && (
                    <div className={styles.cardLastMsg}>
                      "{getLastPreview(conv.messages, 100)}"
                    </div>
                  )}
                  <div className={styles.cardMeta}>
                    <IconMessage2 size={11} />
                    <span>
                      {conv.messages.length} message
                      {conv.messages.length !== 1 ? 's' : ''}
                    </span>
                    {conv.unread && (
                      <span className={styles.unreadBadge}>Unread</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
