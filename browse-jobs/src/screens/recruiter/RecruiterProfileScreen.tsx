import { useState } from 'react';
import {
  IconBuildingSkyscraper,
  IconShield,
  IconFileText,
  IconDownload,
  IconTrash,
} from '@tabler/icons-react';
import { useToast } from '../../store/useToast';
import { Button, Avatar, Tabs, TextField } from '../../components/ds';
import styles from './RecruiterProfileScreen.module.css';

// ── Form state ──────────────────────────────────────────────────

interface ProfileForm {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
}

// ── Main screen ─────────────────────────────────────────────────

export default function RecruiterProfileScreen() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState<ProfileForm>({
    fullName: 'Ranti Ajah',
    email: 'ranti.ajah@rakamin.ac.id',
    phone: '+62 812 3456 7890',
    jobTitle: 'HC Manager',
  });

  function set<K extends keyof ProfileForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>My Profile</h1>
        <p className={styles.pageSubtitle}>Manage your personal information and account settings.</p>
      </div>

      {/* ── Tab bar ── */}
      <div className={styles.tabsBar}>
        <Tabs
          tabs={[
            { key: 'profile', label: 'Profile' },
            { key: 'privacy', label: 'Privacy & Data' },
          ]}
          active={activeTab}
          onChange={setActiveTab}
          stretch
        />
      </div>

      {/* ── Scroll area ── */}
      <div className={styles.scrollArea}>
        <div className={styles.inner}>

          {/* ────────── Profile tab ────────── */}
          {activeTab === 'profile' && (
            <>
              {/* Card: Personal information */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Personal information</h2>
                  <p className={styles.cardSubtitle}>Update your name, email, and contact details.</p>
                </div>

                <div className={styles.photoRow}>
                  <Avatar
                    initials="RA"
                    size="lg"
                    color="brand"
                    style={{ width: 96, height: 96, fontSize: 'var(--text-3xl)' }}
                  />
                  <div className={styles.photoInfo}>
                    <span className={styles.photoLabel}>Profile Photo</span>
                    <span className={styles.photoDesc}>JPG, GIF or PNG. Max size of 800K</span>
                  </div>
                  <div className={styles.photoBtns}>
                    <Button
                      variant="brand-ghost"
                      size="sm"
                      onClick={() => showToast({ message: 'Upload coming soon.', type: 'info' })}
                    >
                      Upload photo
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => showToast({ message: 'Photo removed.', type: 'info' })}
                    >
                      Remove photo
                    </Button>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <TextField
                    label="Full name"
                    value={form.fullName}
                    onChange={(e) => set('fullName', e.target.value)}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                  />
                  <TextField
                    label="Phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                  />
                  <TextField
                    label="Job Title"
                    value={form.jobTitle}
                    onChange={(e) => set('jobTitle', e.target.value)}
                  />
                </div>

                <div className={styles.saveBar}>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => showToast({ message: 'Profile updated.', type: 'success' })}
                  >
                    Save changes
                  </Button>
                </div>
              </div>

              {/* Card: Company */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Company</h2>
                  <p className={styles.cardSubtitle}>Your organization details are managed by your admin.</p>
                </div>
                <div className={styles.companyCallout}>
                  <IconBuildingSkyscraper size={20} className={styles.companyIcon} />
                  <div className={styles.companyInfo}>
                    <span className={styles.companyName}>Rakamin Academy</span>
                    <span className={styles.companyManaged}>Managed by your organization admin</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ────────── Privacy & Data tab ────────── */}
          {activeTab === 'privacy' && (
            <>
              {/* Info callout */}
              <div className={styles.infoCallout}>
                <div className={styles.infoCalloutTop}>
                  <IconShield size={16} className={styles.infoCalloutIcon} />
                  <span className={styles.infoCalloutHeading}>How Claro handles your data</span>
                </div>
                <p className={styles.infoCalloutBody}>
                  We collect and process data to power your recruitment experience. All information
                  is stored securely and is never sold to third parties.
                </p>
                <button
                  className={styles.privacyLink}
                  onClick={() => showToast({ message: 'Opening privacy policy…', type: 'info' })}
                >
                  Read our full privacy policy →
                </button>
              </div>

              {/* Download data card */}
              <div className={styles.actionCard}>
                <div className={styles.actionCardLeft}>
                  <IconFileText size={18} className={styles.actionCardIcon} />
                  <div className={styles.actionCardText}>
                    <span className={styles.actionCardTitle}>Download your data</span>
                    <span className={styles.actionCardSub}>
                      Get a copy of all data Claro holds about you.
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    showToast({ message: 'Preparing your data export…', type: 'info' })
                  }
                >
                  <IconDownload size={14} />
                  Download
                </Button>
              </div>

              {/* Account section divider */}
              <div className={styles.sectionDivider}>
                <span className={styles.sectionLabel}>Account</span>
                <div className={styles.sectionLine} />
              </div>

              {/* Delete account card */}
              <div className={styles.deleteCard}>
                <div className={styles.actionCardLeft}>
                  <div className={styles.actionCardText}>
                    <span className={styles.deleteTitle}>Delete your account</span>
                    <span className={styles.actionCardSub}>
                      Permanently remove your account and all associated data.
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    showToast({
                      message: 'Please contact support to delete your account.',
                      type: 'info',
                    })
                  }
                >
                  <IconTrash size={14} />
                  Delete
                </Button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
