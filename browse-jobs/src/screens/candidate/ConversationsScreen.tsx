import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconSearch,
  IconSortDescending,
  IconRefresh,
} from '@tabler/icons-react';
import { useStore } from '../../store/useStore';
import { JOBS } from '../../data/mockData';
import type { Conversation } from '../../store/types';
import styles from './ConversationsScreen.module.css';

// ── Helpers ────────────────────────────────────────────────────────────────

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return 'last week';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function getQuotedPreview(conv: Conversation): string {
  const last = conv.messages[conv.messages.length - 1];
  if (!last) return '';
  const text = last.content.trim();
  const preview = text.length > 90 ? text.slice(0, 90) + '…' : text;
  return `"${preview}"`;
}

// ── FAB ────────────────────────────────────────────────────────────────────

function ChatFab({ onClick }: { onClick?: () => void }) {
  return (
    <button className={styles.fab} onClick={onClick} aria-label="Open AI chat">
      <IconRefresh size={22} />
    </button>
  );
}

// ── Conversation card ──────────────────────────────────────────────────────

interface EnrichedConv extends Conversation {
  location?: string;
}

function ConvCard({ conv, wide = false }: { conv: EnrichedConv; wide?: boolean }) {
  const navigate = useNavigate();
  const preview = getQuotedPreview(conv);

  return (
    <div
      className={`${styles.card} ${wide ? styles.cardWide : ''}`}
      onClick={() => navigate(`/conversations/${conv.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/conversations/${conv.id}`)}
    >
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>{conv.jobTitle}</span>
        <span className={styles.cardTime}>{formatRelativeTime(conv.lastMessageAt)}</span>
      </div>
      {conv.company && (
        <span className={styles.cardCompany}>
          {conv.company}{conv.location ? ` • ${conv.location}` : ''}
        </span>
      )}
      {preview && <p className={styles.cardPreview}>{preview}</p>}
      <span className={styles.cardCount}>{conv.messages.length} messages</span>
    </div>
  );
}

// ── Pinned conversation IDs ────────────────────────────────────────────────

/** IDs of conversations that always appear pinned at the top, in order. */
const PINNED_IDS = ['conv-general', 'conv-1'];

// ── Main screen ────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  'When will I hear back?',
  'How do I read my insight report?',
];

export default function ConversationsScreen() {
  const conversations = useStore((s) => s.conversations);
  const applications = useStore((s) => s.applications);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Enrich conversations with job location
  const enriched: EnrichedConv[] = conversations.map((conv) => {
    const app = applications.find((a) => a.id === conv.applicationId);
    const job = JOBS.find((j) => j.id === app?.jobId);
    return { ...conv, location: job?.location };
  });

  const pinned = PINNED_IDS
    .map((id) => enriched.find((c) => c.id === id))
    .filter(Boolean) as EnrichedConv[];
  const perApp = enriched.filter((c) => !PINNED_IDS.includes(c.id));

  const q = search.trim().toLowerCase();
  const filteredPinned = q
    ? pinned.filter(
        (c) =>
          c.jobTitle.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q),
      )
    : pinned;
  const filteredPerApp = q
    ? perApp.filter(
        (c) =>
          c.jobTitle.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q),
      )
    : perApp;

  const bySorted = (arr: EnrichedConv[]) =>
    [...arr].sort(
      (a, b) =>
        new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
    );

  // ── Empty state ──────────────────────────────────────────────────────────
  if (conversations.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyCentered}>
          <div className={styles.emptyCard}>
            <div className={styles.emptyIcon}>
              <IconRefresh size={24} />
            </div>
            <h2 className={styles.emptyTitle}>Hi! I'm here to help.</h2>
            <p className={styles.emptyBody}>
              Ask me anything about your applications, assessments, or next steps in the hiring
              process. Open the chat bubble at the bottom right to start
            </p>
            <div className={styles.suggestionRow}>
              {SUGGESTIONS.map((s) => (
                <button key={s} className={styles.suggestionChip}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <ChatFab onClick={() => navigate('/conversations')} />
      </div>
    );
  }

  // ── Default list ─────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>AI Chats</h1>
        <p className={styles.subtitle}>
          A record of your past conversations, organized by application. To start a new
          conversation, use the chat bubble at the bottom right of any page.
        </p>
      </div>

      {/* Search + sort */}
      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>
            <IconSearch size={14} />
          </span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by role, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className={styles.sortBtn}>
          <IconSortDescending size={14} />
          Newest
        </button>
      </div>

      {/* Scrollable content */}
      <div className={styles.body}>
        {filteredPinned.length > 0 && (
          <section className={styles.section}>
            <p className={styles.sectionLabel}>PINNED</p>
            {filteredPinned.length === 1 ? (
              <ConvCard conv={filteredPinned[0]} wide />
            ) : (
              <div className={styles.pinnedRow}>
                {filteredPinned.map((c) => (
                  <ConvCard key={c.id} conv={c} />
                ))}
              </div>
            )}
          </section>
        )}

        {filteredPerApp.length > 0 && (
          <section className={styles.section}>
            <p className={styles.sectionLabel}>PER APPLICATION</p>
            <div className={styles.cardGrid}>
              {bySorted(filteredPerApp).map((c) => (
                <ConvCard key={c.id} conv={c} />
              ))}
            </div>
          </section>
        )}
      </div>

      <ChatFab onClick={() => navigate('/conversations')} />
    </div>
  );
}
