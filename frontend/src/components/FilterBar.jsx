export default function FilterBar({ filters, onFilterChange, onSearch, searchTerm, onSearchChange }) {
    const selectClass = `
        border border-white/20 rounded-xl px-4 py-2.5 text-sm font-medium
        bg-white/10 text-white placeholder-white/50 backdrop-blur-sm
        focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/40
        transition cursor-pointer appearance-none
    `.trim();

    return (
        <div style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.13)',
            borderRadius: 20,
            padding: '18px 20px',
        }}>
            <div className="flex flex-col md:flex-row gap-3 flex-wrap items-stretch">
                {/* Search input */}
                <div className="flex-1 relative" style={{ minWidth: 200 }}>
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by title, org, or keyword…"
                        value={searchTerm}
                        onChange={e => onSearchChange(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && onSearch()}
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.10)',
                            border: '1px solid rgba(255,255,255,0.18)',
                            borderRadius: 12,
                            padding: '10px 14px 10px 36px',
                            fontSize: '0.875rem',
                            color: '#fff',
                            outline: 'none',
                        }}
                        className="focus:ring-2 focus:ring-amber-400/50 transition placeholder:text-white/40"
                    />
                </div>

                {/* Filters row */}
                <div className="flex gap-2 flex-wrap">
                    {[
                        {
                            key: 'category_id', label: 'Category',
                            options: [
                                { v: '', l: 'All Categories' },
                                { v: '1', l: 'Internship' }, { v: '2', l: 'Scholarship' },
                                { v: '3', l: 'Hackathon' },  { v: '4', l: 'Research' },
                                { v: '5', l: 'Course' },     { v: '6', l: 'Exchange Program' },
                                { v: '7', l: 'Competition' },{ v: '8', l: 'Workshop' },
                            ],
                        },
                        {
                            key: 'opp_mode', label: 'Mode',
                            options: [
                                { v: '', l: 'All Modes' },
                                { v: 'remote', l: 'Remote' },
                                { v: 'on-campus', l: 'On-Campus' },
                                { v: 'hybrid', l: 'Hybrid' },
                            ],
                        },
                        {
                            key: 'is_paid', label: 'Stipend',
                            options: [
                                { v: '', l: 'Paid & Unpaid' },
                                { v: '1', l: 'Paid Only' },
                                { v: '0', l: 'Unpaid Only' },
                            ],
                        },
                        {
                            key: 'dept_id', label: 'Department',
                            options: [
                                { v: '', l: 'All Departments' },
                                { v: '1', l: 'Computer Science' },
                                { v: '2', l: 'Business Admin' },
                                { v: '3', l: 'Electrical Eng.' },
                                { v: '4', l: 'Media Studies' },
                                { v: '5', l: 'Mathematics' },
                                { v: '6', l: 'Psychology' },
                                { v: '7', l: 'Biotechnology' },
                                { v: '8', l: 'Chemistry' },
                                { v: '9', l: 'Mechanical Eng.' },
                                { v: '10', l: 'Aerospace Eng.' },
                            ],
                        },
                    ].map(({ key, options }) => (
                        <div key={key} className="relative">
                            <select
                                value={filters[key]}
                                onChange={e => onFilterChange(key, e.target.value)}
                                className={selectClass}
                                style={{ paddingRight: 32, minWidth: 140 }}
                            >
                                {options.map(o => (
                                    <option key={o.v} value={o.v}
                                        style={{ background: '#1e1b4b', color: '#fff' }}>
                                        {o.l}
                                    </option>
                                ))}
                            </select>
                            {/* chevron */}
                            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                                style={{ color: 'rgba(255,255,255,0.5)' }}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    ))}

                    {/* Search button */}
                    <button
                        onClick={onSearch}
                        style={{
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            border: 'none',
                            borderRadius: 12,
                            padding: '10px 22px',
                            color: '#1a1035',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 4px 14px rgba(245,158,11,0.35)',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(245,158,11,0.45)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(245,158,11,0.35)'; }}
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}
