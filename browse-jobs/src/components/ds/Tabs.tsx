import React from 'react';

interface Tab {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
  children?: React.ReactNode;
  /** Makes each tab button grow equally to fill the full tab-bar width */
  stretch?: boolean;
}

export function Tabs({ tabs, active, onChange, children, stretch = false }: TabsProps) {
  return (
    <div>
      <div
        role="tablist"
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          gap: 0,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => onChange(tab.key)}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--brand)' : '2px solid transparent',
                marginBottom: '-1px',
                fontFamily: 'var(--font-base)',
                fontSize: 'var(--text-base)',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'color 0.15s ease, border-color 0.15s ease',
                whiteSpace: 'nowrap',
                outline: 'none',
                ...(stretch && { flex: 1, textAlign: 'center' }),
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = `2px solid var(--brand)`;
                e.currentTarget.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {children !== undefined && (
        <div role="tabpanel" style={{ paddingTop: 'var(--space-4)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default Tabs;
