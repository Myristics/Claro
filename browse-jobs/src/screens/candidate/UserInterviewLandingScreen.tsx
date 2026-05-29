import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IconCalendar,
  IconVideo,
  IconClock,
  IconLanguage,
  IconLink,
  IconCopy,
  IconCheck,
  IconLogout,
  IconMessageChatbot,
} from '@tabler/icons-react';
import { JOBS } from '../../data/mockData';
import { useStore } from '../../store/useStore';
import styles from './UserInterviewLandingScreen.module.css';

// ── Mock interview data ────────────────────────────────────────────────────
// In production this would come from the store / API

const INTERVIEW_DATE     = '18 May 2026';
const INTERVIEW_TIME     = '10:00 WIB';
const INTERVIEW_DATETIME = `${INTERVIEW_DATE}, ${INTERVIEW_TIME}`;
const MEETING_LINK       = 'meet.google.com/abc-defg-hij';

const MEETING_DETAILS = [
  { icon: 'calendar', label: 'Date and time', value: INTERVIEW_DATETIME },
  { icon: 'clock',    label: 'Duration',       value: '~45 minutes' },
  { icon: 'video',    label: 'Format',         value: 'Video call via Google Meet' },
  { icon: 'language', label: 'Language',       value: 'Bahasa Indonesia' },
] as const;

const INTERVIEWER = {
  name:     'Ranti Ajah',
  title:    'HC Manager • Tokopedia',
  bio:      'Ranti leads people experience at Tokopedia and has been part of the hiring team for over 5 years.',
  initials: 'RA',
};

// ── Icon helper ───────────────────────────────────────────────────────────

function DetailIcon({ kind }: { kind: typeof MEETING_DETAILS[number]['icon'] }) {
  const props = { size: 24, strokeWidth: 1.5 };
  if (kind === 'calendar') return <IconCalendar {...props} />;
  if (kind === 'clock')    return <IconClock {...props} />;
  if (kind === 'video')    return <IconVideo {...props} />;
  return <IconLanguage {...props} />;
}

// ── Main screen ───────────────────────────────────────────────────────────

export default function UserInterviewLandingScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const application = useStore((s) => s.applications.find((a) => a.id === id));
  const job = application ? JOBS.find((j) => j.id === application.jobId) : null;
  const jobLabel = job ? `${job.title} at ${job.company}` : '';

  function handleCopy() {
    navigator.clipboard.writeText(MEETING_LINK).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.page}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.headerLabel}>Applying for:</span>
          <span className={styles.headerJob}>{jobLabel}</span>
        </div>
        <button
          className={styles.saveExitBtn}
          onClick={() => navigate(`/applications/${id}`)}
        >
          Save and exit
          <IconLogout size={16} strokeWidth={1.5} />
        </button>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className={styles.body}>
        <div className={styles.inner}>
          <div className={styles.card}>
            <div className={styles.cardBody}>

              {/* Title block */}
              <div className={styles.titleBlock}>
                <h1 className={styles.title}>Ready for your user interview?</h1>
                <p className={styles.subtitle}>
                  A conversation between you and our team to understand more about your
                  background and discuss what working at {job?.company ?? 'the company'} would look like.
                </p>
              </div>

              {/* Meeting details */}
              <div className={styles.section}>
                <div className={styles.detailsBox}>
                  <p className={styles.detailsTitle}>Meeting details</p>
                  <div className={styles.detailsGrid}>
                    {MEETING_DETAILS.map((item) => (
                      <div key={item.label} className={styles.detailItem}>
                        <div className={styles.detailIconWrap}>
                          <DetailIcon kind={item.icon} />
                        </div>
                        <div className={styles.detailText}>
                          <span className={styles.detailLabel}>{item.label}</span>
                          <span className={styles.detailValue}>{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Meeting link */}
              <div className={styles.section}>
                <div className={styles.linkCard}>
                  <div className={styles.linkLeft}>
                    <IconLink size={24} strokeWidth={1.5} className={styles.linkIcon} />
                    <div className={styles.linkInfo}>
                      <span className={styles.linkLabel}>Meeting link</span>
                      <span className={styles.linkUrl}>{MEETING_LINK}</span>
                    </div>
                  </div>
                  <div className={styles.linkActions}>
                    <button className={styles.copyBtn} onClick={handleCopy}>
                      {copied
                        ? <IconCheck size={16} strokeWidth={2} />
                        : <IconCopy size={16} strokeWidth={1.5} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      className={styles.joinBtn}
                      onClick={() => window.open(`https://${MEETING_LINK}`, '_blank')}
                    >
                      <IconVideo size={16} strokeWidth={1.5} />
                      Join
                    </button>
                  </div>
                </div>
              </div>

              {/* You'll meet with */}
              <div className={styles.section}>
                <p className={styles.sectionHeading}>You'll meet with</p>
                <div className={styles.interviewerRow}>
                  <div className={styles.avatar}>
                    <span className={styles.avatarInitials}>{INTERVIEWER.initials}</span>
                  </div>
                  <div className={styles.interviewerInfo}>
                    <span className={styles.interviewerName}>{INTERVIEWER.name}</span>
                    <span className={styles.interviewerTitle}>{INTERVIEWER.title}</span>
                    <p className={styles.interviewerBio}>{INTERVIEWER.bio}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* ── Card footer — reschedule ─────────────────────────────── */}
            <div className={styles.cardFooter}>
              <div className={styles.rescheduleLeft}>
                <IconCalendar size={24} strokeWidth={1.5} className={styles.rescheduleIcon} />
                <div className={styles.rescheduleText}>
                  <span className={styles.rescheduleTitle}>Need to reschedule?</span>
                  <span className={styles.rescheduleBody}>
                    Requests can be made up to 24 hours before the meeting.
                  </span>
                </div>
              </div>
              <button className={styles.rescheduleBtn}>Request Reschedule</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Page footer ─────────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <IconCalendar size={24} strokeWidth={1.5} className={styles.footerIcon} />
          <span className={styles.footerLabel}>Interview:</span>
          <span className={styles.footerDate}>{INTERVIEW_DATETIME}</span>
        </div>
        <button className={styles.addCalBtn}>Add to calendar</button>
      </footer>

      {/* ── Floating AI chat button ──────────────────────────────────────── */}
      <button
        className={styles.chatFab}
        onClick={() => navigate('/conversations')}
        aria-label="Open AI chat"
      >
        <IconMessageChatbot size={24} strokeWidth={1.5} />
      </button>

    </div>
  );
}
