import NavigationSidebar from './NavigationSidebar';
import FilterBar from './FilterBar';
import JobCard, { type JobCardData } from './JobCard';

// Logo image assets from Figma (valid for 7 days from design export)
const sunriseBakeryLogo = 'https://www.figma.com/api/mcp/asset/e86ff072-b133-46cc-acf7-4c5a4be411dd';
const greenfieldFarmLogo = 'https://www.figma.com/api/mcp/asset/36ec5942-841d-4a7f-9c27-093a93234f52';

const JOBS: JobCardData[] = [
  {
    id: '1',
    title: 'Head Pastry Chef',
    company: 'Sunrise Bakery',
    logoUrl: sunriseBakeryLogo,
    type: 'Fulltime',
    location: 'Bandung',
    workMode: 'On-site',
    salary: 'IDR 10M - 15M',
    processingTime: '10 days',
    positions: 1,
    includes: ['Simulation', 'Personality', 'Interview'],
    closingText: 'Closes in 3 days',
  },
  {
    id: '2',
    title: 'Farm Operations Manager',
    company: 'Greenfield Farm',
    logoUrl: greenfieldFarmLogo,
    type: 'Part-time',
    location: 'Yogyakarta',
    workMode: 'On-site',
    salary: 'IDR 4M - 6M',
    processingTime: '20 days',
    positions: 1,
    includes: ['Simulation', 'Personality', 'Interview'],
    closingText: 'Closes in 5 days',
  },
  {
    id: '3',
    title: 'Supply Chain Specialist',
    company: 'Green Leaf Organic',
    logoInitials: 'GL',
    type: 'Full-time',
    location: 'Yogyakarta',
    workMode: 'Hybrid',
    salary: 'IDR 8M - 12M',
    processingTime: '15 days',
    positions: 2,
    includes: ['Technical', 'Personality', 'Interview'],
    closingText: 'Closes in 3 days',
  },
  {
    id: '4',
    title: 'Guest Experience Lead',
    company: 'Blue Horizon',
    logoInitials: 'BH',
    type: 'Full-time',
    location: 'Jakarta',
    workMode: 'On-site',
    salary: 'IDR 5M - 7M',
    processingTime: '7 days',
    positions: 1,
    includes: ['Simulation', 'Personality', 'Interview'],
    closingText: 'Closes in 10 days',
  },
  {
    id: '5',
    title: 'Agricultural Data Scientist',
    company: 'Greenfield Farm',
    logoUrl: greenfieldFarmLogo,
    type: 'Contract',
    location: 'Yogyakarta',
    workMode: 'Hybrid',
    salary: 'IDR 15M - 22M',
    processingTime: '14 days',
    positions: 2,
    includes: ['Technical', 'Cognitive', 'Interview'],
    closingText: 'Closes in 8 days',
  },
  {
    id: '6',
    title: 'Digital Archive Specialist',
    company: 'Maplewood Library',
    logoInitials: 'ML',
    type: 'Part-time',
    location: 'Toronto',
    workMode: 'Remote',
    salary: 'IDR 35M - 50M',
    processingTime: '10 days',
    positions: 1,
    includes: ['Technical', 'Personality', 'Interview'],
    closingText: 'Closes in 12 days',
  },
  {
    id: '7',
    title: 'Customer Service Representative',
    company: 'Ocean View Hotel',
    logoInitials: 'OV',
    type: 'Contract',
    location: 'Miami',
    workMode: 'On-site',
    salary: 'IDR 120M - 150M',
    processingTime: '14 days',
    positions: 1,
    includes: ['Cognitive', 'Personality', 'Interview'],
    closingText: 'Closes in 3 days',
  },
  {
    id: '8',
    title: 'Accountant',
    company: 'Airbnb',
    logoInitials: 'AB',
    type: 'Contract',
    location: 'San Francisco',
    workMode: 'Remote',
    salary: 'IDR 75M - 110M',
    processingTime: '21 days',
    positions: 2,
    includes: ['Cognitive', 'Personality', 'Interview'],
    closingText: 'Closes in 2 weeks',
  },
  {
    id: '9',
    title: 'Product Designer',
    company: 'Tokopedia',
    logoInitials: 'TP',
    type: 'Full-time',
    location: 'Surabaya',
    workMode: 'On-site',
    salary: 'IDR 6M - 9M',
    processingTime: '14 days',
    positions: 1,
    includes: ['Technical', 'Personality', 'Interview'],
    closingText: 'Closes in 7 days',
  },
  {
    id: '10',
    title: 'Content Strategy Analyst',
    company: 'Netflix',
    logoInitials: 'NF',
    type: 'Full-time',
    location: 'Jakarta',
    workMode: 'Remote',
    salary: 'IDR 70M - 100M',
    processingTime: '10 days',
    positions: 1,
    includes: ['Technical', 'Personality', 'Interview'],
    closingText: 'Closes in 14 days',
  },
];

export default function BrowseJobs() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8f8f8]">
      <NavigationSidebar />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 max-w-[1220px]">
          {/* Page Header */}
          <div className="flex flex-col gap-2 mb-6">
            <h1 className="text-[20px] font-bold text-text leading-7 tracking-[-0.08px]">
              Browse Jobs
            </h1>
            <p className="text-sm text-text leading-5">
              Find a role and see exactly what hiring will look like before you apply.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="mb-6">
            <FilterBar />
          </div>

          {/* Job Grid */}
          <div className="grid grid-cols-2 gap-6">
            {JOBS.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: '#01959f' }}
      >
        <i className="ri-chat-ai-line text-white" style={{ fontSize: '20px' }} />
      </button>
    </div>
  );
}
