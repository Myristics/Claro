type ChipProps = {
  label: string;
  hasLeadingIcon?: boolean;
};

function Chip({ label, hasLeadingIcon = false }: ChipProps) {
  return (
    <button className="flex items-center gap-1 h-8 px-3 py-1 rounded-full border border-[#e8e8e8] bg-surface text-[#646464] text-sm leading-5 whitespace-nowrap hover:border-neutral-alpha-8 transition-colors">
      {hasLeadingIcon && (
        <i className="ri-sort-desc text-[#646464]" style={{ fontSize: '12px' }} />
      )}
      <span>{label}</span>
      <i className="ri-arrow-down-s-line text-[#646464]" style={{ fontSize: '12px' }} />
    </button>
  );
}

export default function FilterBar() {
  return (
    <div className="flex items-center justify-between">
      {/* Left: Search + filter chips */}
      <div className="flex items-center gap-2">
        {/* Search input */}
        <div className="flex items-center h-8 bg-surface border border-neutral-alpha-8 rounded px-1 w-[500px]">
          <div className="flex items-center justify-center px-1 h-full flex-shrink-0">
            <i className="ri-search-line text-neutral-alpha-9" style={{ fontSize: '20px' }} />
          </div>
          <div className="flex-1 px-1 h-full flex items-center">
            <span className="text-sm text-neutral-alpha-9 leading-5 whitespace-nowrap select-none">
              Search by role, company...
            </span>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1">
          <Chip label="Role" />
          <Chip label="Location" />
          <Chip label="Industry" />
          <Chip label="Experience" />
        </div>
      </div>

      {/* Right: Sort chip */}
      <Chip label="Relevance" hasLeadingIcon />
    </div>
  );
}
