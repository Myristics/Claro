import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  IconArrowLeft,
  IconCircleX,
  IconAlertCircle,
  IconSparkles,
  IconUserCircle,
  IconBriefcase,
  IconMessageChatbot,
} from '@tabler/icons-react';
import { useStore } from '../../store/useStore';
import { JOBS } from '../../data/mockData';
import { Text, Heading, Button, Callout } from '../../components/ds';
import styles from './ApplicationClosedScreen.module.css';

// ── Variant determination ──────────────────────────────────

type ClosureVariant = 'with-insight' | 'with-reason' | 'without-reason';

function getVariant(insightUnlocked: boolean, rejectionReason?: string): ClosureVariant {
  if (insightUnlocked) return 'with-insight';
  if (rejectionReason) return 'with-reason';
  return 'without-reason';
}

// ── What's next items ──────────────────────────────────────

const NEXT_ITEMS = [
  {
    icon: IconUserCircle,
    title: 'Update your profile',
    description: 'Keep your details current to make future applications faster and more relevant.',
  },
  {
    icon: IconBriefcase,
    title: 'Browse similar roles',
    description: 'Discover other open positions that match your skills and experience.',
  },
  {
    icon: IconMessageChatbot,
    title: 'Ask AI for feedback',
    description: 'Get personalised suggestions on how to strengthen your profile for next time.',
  },
];

// ── Main screen ────────────────────────────────────────────

export default function ApplicationClosedScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const application = useStore((s) => s.applications.find((a) => a.id === id));
  const job = application ? JOBS.find((j) => j.id === application.jobId) : undefined;

  // ── Not found ──────────────────────────────────────────────

  if (!application || !job) {
    return (
      <div className={styles.page}>
        <button className={styles.back} onClick={() => navigate('/applications')}>
          <IconArrowLeft size={16} />
          Back to applications
        </button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8) var(--space-7)', maxWidth: 520, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--space-4)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--state-error-bg)', color: 'var(--state-error-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconAlertCircle size={32} />
            </div>
            <p style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Application not found</p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
              This application may have been removed or the link may be incorrect.
            </p>
            <Button variant="primary" onClick={() => navigate('/applications')}>
              Back to my applications
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const variant = getVariant(application.insightUnlocked, application.rejectionReason);

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(`/applications/${id}`)}>
        <IconArrowLeft size={16} />
        Back to application
      </button>

      <div className={styles.wrap}>
        <div className={styles.inner}>

          {/* ── Top card ────────────────────────────────────── */}
          <div className={styles.topCard}>
            <div className={styles.closedIconWrap}>
              <IconCircleX size={36} />
            </div>

            <div className={styles.topCardBody}>
              <Heading as="h1" size="3xl" weight="bold">
                Application Closed
              </Heading>

              <p className={styles.topCardText}>
                Thank you for applying for {job.title} at {job.company}.
              </p>

              <p className={styles.topCardText}>
                After careful consideration, {job.company} has decided to move forward with other
                candidates for this role. We appreciate the time you invested in this process.
              </p>

              {/* With-reason: show rejection reason from hiring team */}
              {variant === 'with-reason' && application.rejectionReason && (
                <div style={{ textAlign: 'left', width: '100%' }}>
                  <Callout variant="info">
                    <Text as="p" size="sm" weight="semibold" color="secondary" style={{ marginBottom: 'var(--space-1)' }}>
                      From the hiring team:
                    </Text>
                    <Text as="p" size="sm" color="secondary" style={{ lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
                      {application.rejectionReason}
                    </Text>
                  </Callout>
                </div>
              )}

              {/* With-insight: show rejection reason too if available */}
              {variant === 'with-insight' && application.rejectionReason && (
                <div style={{ textAlign: 'left', width: '100%' }}>
                  <Callout variant="info">
                    <Text as="p" size="sm" weight="semibold" color="secondary" style={{ marginBottom: 'var(--space-1)' }}>
                      From the hiring team:
                    </Text>
                    <Text as="p" size="sm" color="secondary" style={{ lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
                      {application.rejectionReason}
                    </Text>
                  </Callout>
                </div>
              )}

              {/* CTAs */}
              <div className={styles.topCardActions}>
                {variant === 'with-insight' ? (
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/applications/${id}/insight`)}
                  >
                    <IconSparkles size={15} />
                    View my insight report
                  </Button>
                ) : (
                  <Link to="/jobs" style={{ textDecoration: 'none' }}>
                    <Button variant="primary">
                      Browse open positions
                    </Button>
                  </Link>
                )}
                {variant !== 'with-insight' && (
                  <Button variant="ghost" onClick={() => navigate(`/applications/${id}`)}>
                    View application details
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* ── Insight teaser (with-insight only) ──────────── */}
          {variant === 'with-insight' && (
            <div className={styles.insightCard}>
              <div className={styles.insightIconWrap}>
                <IconSparkles size={20} />
              </div>
              <div className={styles.insightCardBody}>
                <Text size="base" weight="semibold" color="brand">
                  Your Insight Report is ready
                </Text>
                <Text as="p" size="sm" color="secondary" style={{ margin: 0, lineHeight: 'var(--leading-relaxed)' }}>
                  Your full assessment results and a personalised development breakdown are ready.
                </Text>
                <div style={{ marginTop: 'var(--space-2)' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/applications/${id}/insight`)}
                  >
                    View Insight Report
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ── What's next ──────────────────────────────────── */}
          <div className={styles.nextSection}>
            <p className={styles.nextSectionTitle}>What&apos;s next?</p>
            <div className={styles.nextList}>
              {NEXT_ITEMS.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.title} className={styles.nextItem}>
                    <div className={styles.nextItemIconWrap}>
                      <ItemIcon size={18} />
                    </div>
                    <div className={styles.nextItemBody}>
                      <Text size="sm" weight="semibold" color="primary">
                        {item.title}
                      </Text>
                      <Text as="p" size="sm" color="secondary" style={{ margin: 0, lineHeight: 'var(--leading-relaxed)' }}>
                        {item.description}
                      </Text>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
