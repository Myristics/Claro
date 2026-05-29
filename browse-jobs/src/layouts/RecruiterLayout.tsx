import { useRef, useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  IconBriefcase,
  IconUsers,
  IconSparkles,
  IconUser,
  IconBell,
  IconSettings,
  IconArrowsLeftRight,
  IconBellCog,
  IconLogout,
} from '@tabler/icons-react';
import { Avatar } from '../components/ds';
import { useStore } from '../store/useStore';
import { useToast } from '../store/useToast';
import styles from './RecruiterLayout.module.css';

const NAV_ITEMS = [
  { to: '/r/vacancies',     label: 'Job Vacancies',       Icon: IconBriefcase, end: true },
  { to: '/r/pipeline',      label: 'Candidate Pipeline',  Icon: IconUsers,     end: true },
  { to: '/r/conversations', label: 'AI Conversations',    Icon: IconSparkles,  end: true },
  { to: '/r/profile',       label: 'My Profile',          Icon: IconUser,      end: true },
] as const;

export default function RecruiterLayout() {
  const setActiveView = useStore((s) => s.setActiveView);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [gearOpen, setGearOpen] = useState(false);
  const gearRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!gearOpen) return;
    const handler = (e: MouseEvent) => {
      if (gearRef.current && !gearRef.current.contains(e.target as Node)) {
        setGearOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [gearOpen]);

  function handleSwitchToCandidate() {
    setGearOpen(false);
    setActiveView('candidate');
    navigate('/jobs');
  }

  return (
    <div className={styles.root}>
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className={styles.sidebar}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.logo}>
              <span className={styles.logoMark}>
                Claro<sup>°</sup>
              </span>
              <span className={styles.logoSubtitle}>Transparent Hiring</span>
            </div>
            <button className={styles.bellBtn} aria-label="Notifications">
              <IconBell size={18} />
            </button>
          </div>
          <span className={styles.pill}>Rakamin Academy</span>
        </div>

        {/* Nav */}
        <nav className={styles.nav} aria-label="Recruiter navigation">
          {NAV_ITEMS.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className={styles.footer}>
          <Avatar initials="RA" size="md" color="brand" />
          <div className={styles.footerInfo}>
            <span className={styles.footerName}>Ranti Ajah</span>
            <span className={styles.footerRole}>HC Manager</span>
          </div>
          {/* Gear button with dropdown */}
          <div ref={gearRef} className={styles.gearWrapper}>
            <button
              className={`${styles.settingsBtn} ${gearOpen ? styles.settingsBtnActive : ''}`}
              aria-label="Settings"
              onClick={() => setGearOpen(o => !o)}
            >
              <IconSettings size={16} />
            </button>

            {gearOpen && (
              <div className={styles.gearDropdown}>
                <button className={styles.gearOption} onClick={handleSwitchToCandidate}>
                  <IconArrowsLeftRight size={14} />
                  Switch to Candidate
                </button>
                <button
                  className={styles.gearOption}
                  onClick={() => {
                    setGearOpen(false);
                    showToast({ message: 'Notification settings — coming in V1.' });
                  }}
                >
                  <IconBellCog size={14} />
                  Notification settings
                </button>
                <div className={styles.gearDivider} />
                <button
                  className={`${styles.gearOption} ${styles.gearOptionDanger}`}
                  onClick={() => {
                    setGearOpen(false);
                    showToast({ message: 'Sign out — coming in V1.' });
                  }}
                >
                  <IconLogout size={14} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────── */}
      <main className={styles.main}>
        <Outlet />
      </main>

    </div>
  );
}
