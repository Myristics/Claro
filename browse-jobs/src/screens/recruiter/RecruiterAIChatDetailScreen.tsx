import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IconArrowLeft,
  IconSparkles,
  IconRefresh,
  IconMessages,
  IconX,
} from '@tabler/icons-react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ds';
import styles from './RecruiterAIChatDetailScreen.module.css';

// ── Helpers ────────────────────────────────────────────────────

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ── Sub-components ─────────────────────────────────────────────

function ChatHeader({
  title,
  onBack,
}: {
  title?: string;
  onBack: () => void;
}) {
  return (
    <div className={styles.header}>
      <button className={styles.backBtn} onClick={onBack} aria-label="Back to conversations">
        <IconArrowLeft size={18} />
      </button>
      {title && (
        <div className={styles.headerMeta}>
          <span className={styles.headerAbout}>Conversation about:</span>
          <span className={styles.headerTitle}>{title}</span>
        </div>
      )}
    </div>
  );
}

function ChatFooter() {
  return (
    <div className={styles.footer}>
      <div className={styles.footerInner}>
        <p className={styles.footerText}>Want to continue this conversation?</p>
        <Button
          variant="brand-ghost"
          size="sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <IconMessages size={15} />
          Open in chat
        </Button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────

export default function RecruiterAIChatDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const conversations = useStore((s) => s.conversations);
  const conversation = conversations.find((c) => c.id === id);

  const msgsWithDates = useMemo(() => {
    if (!conversation || conversation.messages.length === 0) return [];
    let prevDate = '';
    return conversation.messages.map((msg) => {
      const dateLabel = formatDateLabel(msg.timestamp);
      const showDate = dateLabel !== prevDate;
      if (showDate) prevDate = dateLabel;
      return { ...msg, showDate, dateLabel };
    });
  }, [conversation]);

  const onBack = () => navigate('/r/conversations');

  // ── Error state: conversation not found ──────────────────────
  if (!conversation) {
    return (
      <div className={styles.page}>
        <ChatHeader onBack={onBack} />
        <div className={styles.stateCenter}>
          <div className={styles.stateCard}>
            <div className={styles.errorIconWrap}>
              <IconX size={30} />
            </div>
            <p className={styles.stateTitle}>This conversation could not be loaded</p>
            <p className={styles.stateBody}>
              There was a problem retrieving this conversation. You can{' '}
              <button
                className={styles.stateLink}
                onClick={onBack}
              >
                ask AI for help.
              </button>
            </p>
            <Button
              variant="brand-ghost"
              size="sm"
              onClick={() => window.location.reload()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <IconRefresh size={15} />
              Refresh page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty state: no messages yet ─────────────────────────────
  if (conversation.messages.length === 0) {
    return (
      <div className={styles.page}>
        <ChatHeader title={conversation.jobTitle} onBack={onBack} />
        <div className={styles.stateCenter}>
          <div className={styles.stateCard}>
            <div className={styles.emptyIconWrap}>
              <IconSparkles size={30} />
            </div>
            <p className={styles.stateTitle}>Hi! I'm here to help.</p>
            <p className={styles.stateBody}>
              Ask me anything about this candidate's application, their assessment results, or what to
              expect next.
            </p>
            <div className={styles.exampleBadges}>
              <span className={styles.exampleBadge}>What stage is this candidate at?</span>
              <span className={styles.exampleBadge}>How did they perform in assessment?</span>
              <span className={styles.exampleBadge}>What should I consider before deciding?</span>
            </div>
          </div>
        </div>
        <ChatFooter />
      </div>
    );
  }

  // ── Normal chat view ─────────────────────────────────────────
  return (
    <div className={styles.page}>
      <ChatHeader title={conversation.jobTitle} onBack={onBack} />

      <div className={styles.messagesArea}>
        <div className={styles.messagesInner}>
          {msgsWithDates.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id}>
                {msg.showDate && (
                  <div className={styles.dateLabel}>{msg.dateLabel}</div>
                )}
                <div
                  className={`${styles.msgGroup} ${
                    isUser ? styles.msgGroupUser : styles.msgGroupAi
                  }`}
                >
                  <div
                    className={`${styles.messageRow} ${
                      isUser ? styles.messageRowUser : styles.messageRowAi
                    }`}
                  >
                    {!isUser && (
                      <div className={styles.aiAvatar}>
                        <IconSparkles size={15} />
                      </div>
                    )}
                    <div
                      className={`${styles.bubble} ${
                        isUser ? styles.bubbleUser : styles.bubbleAi
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                  <div
                    className={`${styles.timestamp} ${
                      isUser ? styles.timestampUser : styles.timestampAi
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ChatFooter />
    </div>
  );
}
