export type JobCardData = {
  id: string;
  title: string;
  company: string;
  logoUrl?: string;
  logoInitials?: string;
  type: string;
  location: string;
  workMode: string;
  salary: string;
  processingTime: string;
  positions: number;
  includes: string[];
  closingText: string;
};

type BadgeProps = {
  icon: string;
  label: string;
  color: 'mint' | 'blue' | 'neutral';
};

function Badge({ icon, label, color }: BadgeProps) {
  const colorMap = {
    mint: { bg: 'bg-mint-alpha-3', text: 'text-mint-alpha-11' },
    blue: { bg: 'bg-blue-alpha-3', text: 'text-blue-alpha-11' },
    neutral: { bg: 'bg-neutral-alpha-3', text: 'text-neutral-alpha-11' },
  };
  const { bg, text } = colorMap[color];
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${bg}`}
    >
      <i className={`${icon} ${text}`} style={{ fontSize: '12px' }} />
      <span className={`text-[12px] font-medium leading-4 tracking-[0.04px] whitespace-nowrap ${text}`}>
        {label}
      </span>
    </span>
  );
}

type IncludeBadgeProps = { label: string };
function IncludeBadge({ label }: IncludeBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-alpha-3">
      <i className="ri-clipboard-line text-neutral-alpha-11" style={{ fontSize: '12px' }} />
      <span className="text-[12px] font-medium leading-4 tracking-[0.04px] text-neutral-alpha-11 whitespace-nowrap">
        {label}
      </span>
    </span>
  );
}

export default function JobCard({ job }: { job: JobCardData }) {
  return (
    <div className="flex flex-col gap-2 bg-panel border border-neutral-alpha-6 rounded-lg p-4 overflow-hidden h-full">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Logo */}
          <div className="border border-neutral-alpha-8 rounded p-1 flex-shrink-0 w-12 h-12 flex items-center justify-center overflow-hidden">
            {job.logoUrl ? (
              <img
                src={job.logoUrl}
                alt={`${job.company} logo`}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-xs font-bold text-neutral-alpha-11">
                {job.logoInitials ?? job.company.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          {/* Title + Company */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="text-base font-bold text-text leading-6 tracking-[0px] whitespace-nowrap truncate">
              {job.title}
            </p>
            <p className="text-sm text-text leading-5 whitespace-nowrap">
              {job.company}
            </p>
          </div>
        </div>
        {/* View details button */}
        <button className="flex items-center gap-1 h-6 px-2 rounded bg-brand-primary-surface border border-brand-primary-alpha-7 text-brand-primary-dark text-[12px] font-medium leading-4 tracking-[0.04px] whitespace-nowrap flex-shrink-0 hover:opacity-80 transition-opacity">
          View details
          <i className="ri-arrow-right-long-line" style={{ fontSize: '14px' }} />
        </button>
      </div>

      {/* Type • Location • WorkMode */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-sm text-text leading-5">{job.type} •</span>
        <span className="text-sm text-text leading-5">{job.location} •</span>
        <span className="text-sm text-text leading-5">{job.workMode}</span>
      </div>

      {/* Salary / Time / Positions badges */}
      <div className="flex items-center gap-1 flex-wrap">
        <Badge icon="ri-cash-line" label={job.salary} color="mint" />
        <Badge icon="ri-time-line" label={`Approx. ${job.processingTime}`} color="blue" />
        <Badge
          icon="ri-group-line"
          label={`${job.positions} Position${job.positions > 1 ? 's' : ''}`}
          color="blue"
        />
      </div>

      {/* Includes row */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-sm text-text leading-5 flex-shrink-0">Includes:</span>
        <div className="flex items-center gap-1 flex-wrap flex-1 min-w-0">
          {job.includes.slice(0, 2).map((inc) => (
            <IncludeBadge key={inc} label={inc} />
          ))}
          {job.includes.length > 2 && (
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-neutral-alpha-3 text-[12px] font-medium text-neutral-alpha-11 leading-4">
              +{job.includes.length - 2}
            </span>
          )}
        </div>
        <span className="text-sm text-neutral-alpha-9 leading-5 whitespace-nowrap flex-shrink-0 ml-auto">
          {job.closingText}
        </span>
      </div>
    </div>
  );
}
