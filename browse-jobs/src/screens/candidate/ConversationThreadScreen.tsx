import { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IconArrowLeft,
  IconRefresh,
  IconX,
} from '@tabler/icons-react';
import { useStore } from '../../store/useStore';
import { useToast } from '../../store/useToast';
import styles from './ConversationThreadScreen.module.css';

// ── Helpers ────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatGroupLabel(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ── FAB ────────────────────────────────────────────────────────────────────

function ChatFab({ onClick }: { onClick: () => void }) {
  return (
    <button className={styles.fab} onClick={onClick} aria-label="Open AI chat">
      <IconRefresh size={22} />
    </button>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────

export default function ConversationThreadScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const conversations = useStore((s) => s.conversations);
  const conv = conversations.find((c) => c.id === id);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conv?.messages.length]);

  const fabAction = () =>
    showToast({ message: 'Use the AI chat bubble on any page to continue.' });

  // ── Error state (conversation not found) ──────────────────────────────────
  if (!conv) {
    return (
      <div className={styles.page}>
        <div className={styles.topbar}>
          <button
            className={styles.backBtn}
            onClick={() => navigate('/conversations')}
            aria-label="Back"
          >
            <IconArrowLeft size={18} />
          </button>
          <span className={styles.topbarTitle}>
            <span className={styles.topbarAbout}>Conversation about: </span>
            <strong className={styles.topbarJob}>Unknown</strong>
          </span>
        </div>

        <div className={styles.stateCentered}>
          <div className={styles.stateCard}>
            <div className={styles.errorIconWrap}>
              <IconX size={22} strokeWidth={2.5} />
            </div>
            <h2 className={styles.stateTitle}>This conversation could not be loaded</h2>
            <p className={styles.stateBody}>
              There may be a temporary issue retrieving your results.
              Try refreshing the page. If the problem continues,{' '}
              <button
                className={styles.inlineLink}
                onClick={fabAction}
              >
                ask AI for help.
              </button>
            </p>
            <button
              className={styles.refreshBtn}
              onClick={() => window.location.reload()}
            >
              <IconRefresh size={15} />
              Refresh page
            </button>
          </div>
        </div>

        <ChatFab onClick={fabAction} />
      </div>
    );
  }

  // ── Normal thread view ────────────────────────────────────────────────────
  const messages = conv.messages;
  const jobTitle = conv.jobTitle;
  const company = conv.company;

  return (
    <div className={styles.page}>
      {/* ── Topbar ────────────────────────────────────────────── */}
      <div className={styles.topbar}>
        <button
          className={styles.backBtn}
          onClick={() => navigate('/conversations')}
          aria-label="Back"
        >
          <IconArrowLeft size={18} />
        </button>
        <span className={styles.topbarTitle}>
          <span className={styles.topbarAbout}>Conversation about: </span>
          <strong className={styles.topbarJob}>
            {jobTitle}{company ? ` at ${company}` : ''}
          </strong>
        </span>
      </div>

      {/* ── Messages ──────────────────────────────────────────── */}
      <div className={styles.messagesArea}>
        {/* Date group header */}
        {messages.length > 0 && (
          <div className={styles.dateLabel}>
            {formatGroupLabel(messages[0].timestamp)}
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`${styles.messageRow} ${isUser ? styles.messageRowUser : styles.messageRowAi}`}
            >
              {!isUser && (
                <div className={styles.aiAvatar}>
                  <IconRefresh size={14} />
                </div>
              )}
              <div className={styles.bubbleGroup}>
                <div
                  className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAi}`}
                >
                  {msg.content}
                </div>
                <span
                  className={`${styles.timestamp} ${isUser ? styles.timestampUser : ''}`}
                >
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Continue card ─────────────────────────────────────── */}
      <div className={styles.continueCard}>
        <div className={styles.continueText}>
          <span className={styles.continueTitle}>
            Want to continue this conversation?
          </span>
          <span className={styles.continueSub}>
            Open the chat bubble from any page to pick up where you left off.
          </span>
        </div>
        <button className={styles.openChatBtn} onClick={fabAction}>
          <IconRefresh size={15} />
          Open in chat
        </button>
      </div>

      <ChatFab onClick={fabAction} />
    </div>
  );
}
