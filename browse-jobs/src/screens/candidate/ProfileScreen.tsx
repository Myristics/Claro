import { useState } from 'react';
import {
  IconFileDescription,
  IconUpload,
  IconReplace,
  IconEye,
  IconShieldCheck,
  IconDownload,
  IconTrash,
  IconChevronDown,
  IconRefresh,
} from '@tabler/icons-react';
import { useToast } from '../../store/useToast';
import styles from './ProfileScreen.module.css';

// ── Profile tab ────────────────────────────────────────────

function ProfileTab() {
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('Ahmad Azza');
  const [email, setEmail] = useState('azza@webrocket.app');
  const [phone, setPhone] = useState('+62 812 3456 7890');
  const [location, setLocation] = useState('Jakarta, Indonesia');
  const [currentRole, setCurrentRole] = useState('UI/UX Designer Intern');
  const [yearsExp, setYearsExp] = useState('1-2 years');
  const [hasCV, setHasCV] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState('https://johndoe.framer.website');
  const [company, setCompany] = useState('Rakamin Academy');
  const [noticePeriod, setNoticePeriod] = useState('1 month');

  function handleSave() {
    showToast({ message: 'Profile saved.' });
  }

  return (
    <>
      {/* ── Section 1: Personal information ─────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Personal information</span>
          <span className={styles.sectionSubtitle}>
            Basic contact details shown to recruiters when you apply.
          </span>
        </div>

        {/* Photo row */}
        <div className={styles.photoRow}>
          <div className={styles.avatar}>AA</div>
          <div className={styles.photoMeta}>
            <span className={styles.photoLabel}>Profile Photo</span>
            <span className={styles.photoHint}>
              Optional. Recommended: square image, at least 200×200 px.
            </span>
            <div className={styles.photoActions}>
              <button className={styles.btnGhost}>Upload photo</button>
              <button className={styles.btnPlain}>Remove photo</button>
            </div>
          </div>
        </div>

        {/* Form grid */}
        <div className={styles.formGrid}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Full name</label>
            <input
              className={styles.input}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Phone</label>
            <input
              className={styles.input}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Location</label>
            <input
              className={styles.input}
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Current role</label>
            <input
              className={styles.input}
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Years of experience</label>
            <div className={styles.selectWrap}>
              <select
                className={styles.select}
                value={yearsExp}
                onChange={(e) => setYearsExp(e.target.value)}
              >
                <option>Less than 1 year</option>
                <option>1-2 years</option>
                <option>2-5 years</option>
                <option>5-10 years</option>
                <option>10+ years</option>
              </select>
              <IconChevronDown size={14} className={styles.chevron} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Resume & portfolio ───────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Resume &amp; portfolio</span>
          <span className={styles.sectionSubtitle}>
            Your resume and portfolio links — reused automatically when you apply to new roles.
          </span>
        </div>

        {/* CV row */}
        <div className={styles.cvRow}>
          <IconFileDescription size={20} className={styles.cvIcon} />
          {hasCV ? (
            <div className={styles.cvInfo}>
              <span className={styles.cvFileName}>John_Doe_Resume_2026.pdf</span>
              <span className={styles.cvMeta}>Uploaded 8 May 2026 · 1.2 MB</span>
            </div>
          ) : (
            <div className={styles.cvInfo}>
              <span className={styles.cvFileName}>CV</span>
              <span className={styles.cvMeta}>Upload your CV here for your applications</span>
            </div>
          )}
          <div className={styles.cvActions}>
            {hasCV ? (
              <>
                <button
                  className={styles.btnGhost}
                  onClick={() => setHasCV(false)}
                  title="Replace CV"
                >
                  <IconReplace size={14} />
                  Replace
                </button>
                <button className={styles.btnIconGhost} title="Preview CV">
                  <IconEye size={16} />
                </button>
              </>
            ) : (
              <button
                className={styles.btnIconGhost}
                onClick={() => setHasCV(true)}
                title="Upload CV"
              >
                <IconUpload size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Portfolio URL */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Portfolio URL{' '}
            <span className={styles.labelOptional}>(optional)</span>
          </label>
          <input
            className={styles.input}
            type="url"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
          />
        </div>

        {/* 2-col grid: company + notice period */}
        <div className={styles.formGrid}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Current / last company{' '}
              <span className={styles.labelOptional}>(optional)</span>
            </label>
            <input
              className={styles.input}
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Notice period</label>
            <div className={styles.selectWrap}>
              <select
                className={styles.select}
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
              >
                <option>Immediately</option>
                <option>1 week</option>
                <option>2 weeks</option>
                <option>1 month</option>
                <option>2 months</option>
                <option>3 months</option>
              </select>
              <IconChevronDown size={14} className={styles.chevron} />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className={styles.saveRow}>
          <button className={styles.btnPrimary} onClick={handleSave}>
            Save changes
          </button>
        </div>
      </div>
    </>
  );
}

// ── Privacy & Data tab ─────────────────────────────────────

function PrivacyTab() {
  const { showToast } = useToast();

  return (
    <div className={styles.privacyContent}>
      {/* Info box */}
      <div className={styles.infoBox}>
        <div className={styles.infoBoxHeader}>
          <IconShieldCheck size={16} className={styles.infoBoxIcon} />
          <span className={styles.infoBoxTitle}>How Claro handles your data</span>
        </div>
        <p className={styles.infoBoxBody}>
          Claro complies with Indonesia's Personal Data Protection Law (UU PDP No. 27/2022). Your
          assessment results are never shared as raw scores — only as qualitative insights you can
          interpret. Your profile data is only visible to recruiters at companies where you have
          actively applied.
        </p>
        <a href="#" className={styles.infoBoxLink}>
          Read our full privacy policy →
        </a>
      </div>

      {/* Download row */}
      <div className={styles.actionCard}>
        <div className={styles.actionCardLeft}>
          <IconFileDescription size={20} className={styles.actionCardIcon} />
          <div className={styles.actionCardText}>
            <span className={styles.actionCardTitle}>Download your data</span>
            <span className={styles.actionCardDesc}>
              Get a copy of everything Claro has about you — profile, applications, assessment
              results, and chat history.
            </span>
          </div>
        </div>
        <button
          className={styles.btnDownload}
          onClick={() => showToast({ message: 'Download started.' })}
        >
          <IconDownload size={14} />
          Download
        </button>
      </div>

      {/* Account divider */}
      <div className={styles.sectionDivider}>
        <span className={styles.sectionDividerLabel}>Account</span>
        <hr className={styles.sectionDividerLine} />
      </div>

      {/* Delete row */}
      <div className={styles.actionCard}>
        <div className={styles.actionCardLeft}>
          <div className={styles.actionCardText}>
            <span className={styles.actionCardTitle}>Delete your account</span>
            <span className={styles.actionCardDesc}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </span>
          </div>
        </div>
        <button
          className={styles.btnDanger}
          onClick={() =>
            showToast({ message: 'To delete your account, please contact support.' })
          }
        >
          <IconTrash size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}

// ── Main screen ────────────────────────────────────────────

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy'>('profile');
  const { showToast } = useToast();

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Profile</h1>
        <p className={styles.pageSubtitle}>
          Information you provide here is reusable across all your applications — fill it in once,
          then quickly apply to any role.
        </p>
      </div>

      {/* Tab bar */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === 'profile' ? styles.tabActive : styles.tabInactive}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'privacy' ? styles.tabActive : styles.tabInactive}`}
          onClick={() => setActiveTab('privacy')}
        >
          Privacy &amp; Data
        </button>
      </div>

      {/* Tab content */}
      <div className={styles.tabContent}>
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'privacy' && <PrivacyTab />}
      </div>

      {/* FAB */}
      <button
        className={styles.fab}
        aria-label="Open AI chat"
        onClick={() =>
          showToast({ message: 'AI chat is available from the bubble on any page.' })
        }
      >
        <IconRefresh size={20} color="#fff" />
      </button>
    </div>
  );
}
