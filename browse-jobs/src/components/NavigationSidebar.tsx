type NavItemProps = {
  icon: string;
  label: string;
  active?: boolean;
  badge?: number;
};

function NavItem({ icon, label, active = false, badge }: NavItemProps) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer w-full ${
        active ? 'bg-brand-primary-alpha-3' : 'hover:bg-neutral-alpha-3'
      }`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <i
          className={`${icon} text-base ${
            active ? 'text-brand-primary' : 'text-neutral-alpha-9'
          }`}
          style={{ fontSize: '16px' }}
        />
        <span
          className={`text-sm leading-5 whitespace-nowrap ${
            active ? 'text-brand-primary font-normal' : 'text-neutral-alpha-9 font-normal'
          }`}
        >
          {label}
        </span>
      </div>
      {badge !== undefined && (
        <div className="bg-brand-primary-alpha-3 flex items-center justify-center rounded-full w-[18px] h-[18px] p-1">
          <span className="text-[10px] font-bold text-brand-primary leading-none">
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}

export default function NavigationSidebar() {
  return (
    <div
      className="flex flex-col bg-panel border-r border-neutral-alpha-6 h-full"
      style={{ width: '220px', flexShrink: 0 }}
    >
      {/* Logo Header */}
      <div className="border-b border-neutral-alpha-6 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            {/* Claro Logo */}
            <div className="flex items-start">
              <span
                className="font-emphasis font-bold text-brand-primary-dark leading-none"
                style={{ fontSize: '22px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700 }}
              >
                Claro
              </span>
              <span
                className="text-brand-primary-dark font-bold leading-none"
                style={{ fontSize: '8px', marginTop: '2px', marginLeft: '1px' }}
              >
                ®
              </span>
            </div>
            <span className="text-[12px] text-neutral-alpha-11 leading-4 tracking-[0.04px]">
              Transparent Hiring
            </span>
          </div>
          {/* Notification Bell */}
          <button className="bg-brand-primary-alpha-3 rounded flex items-center justify-center w-6 h-6 hover:opacity-80">
            <i className="ri-notification-3-line text-brand-primary" style={{ fontSize: '16px' }} />
          </button>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-1">
        <NavItem icon="ri-briefcase-line" label="Browse Jobs" active />
        <NavItem icon="ri-file-text-line" label="Applications" />
        <NavItem icon="ri-sparkling-2-line" label="AI Conversations" />
        <NavItem icon="ri-user-line" label="Profile" />
      </div>

      {/* User Footer */}
      <div className="border-t border-neutral-alpha-6 px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="bg-brand-primary-alpha-3 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
            <span
              className="text-brand-primary-dark font-medium text-sm leading-5"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              AA
            </span>
          </div>
          {/* Name & Role */}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm text-text leading-5 whitespace-nowrap">Ahmad Azza</span>
            <span className="text-[12px] text-neutral-alpha-11 leading-4 tracking-[0.04px]">
              Candidate
            </span>
          </div>
          {/* Settings */}
          <button className="flex items-center justify-center w-4 h-4 hover:opacity-70">
            <i className="ri-settings-3-line text-neutral-alpha-9" style={{ fontSize: '16px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
