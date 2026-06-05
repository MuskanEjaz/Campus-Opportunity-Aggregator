import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import OpportunityCard from '../components/OpportunityCard';
import FilterBar from '../components/FilterBar';

const CATEGORY_NAMES = {
    '1': 'Internships', '2': 'Scholarships', '3': 'Hackathons',
    '4': 'Research',    '5': 'Courses',       '6': 'Exchange Programs',
    '7': 'Competitions','8': 'Workshops',
};

const CATEGORY_ICONS = {
    'Internships': '💼', 'Scholarships': '🎓', 'Hackathons': '⚡',
    'Research': '🔬', 'Courses': '📚', 'Exchange Programs': '✈️',
    'Competitions': '🏆', 'Workshops': '🛠️',
};

function SkeletonCard() {
    return (
        <div style={{
            background: 'linear-gradient(145deg, #17153a 0%, #120f2e 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20, padding: '20px', display: 'flex',
            flexDirection: 'column', gap: 14,
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="shimmer" style={{ width: 90, height: 22, borderRadius: 100 }} />
                <div className="shimmer" style={{ width: 60, height: 22, borderRadius: 100 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="shimmer" style={{ width: '85%', height: 16, borderRadius: 6 }} />
                <div className="shimmer" style={{ width: '60%', height: 12, borderRadius: 6 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div className="shimmer" style={{ width: '100%', height: 11, borderRadius: 4 }} />
                <div className="shimmer" style={{ width: '75%', height: 11, borderRadius: 4 }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                <div className="shimmer" style={{ width: 80, height: 22, borderRadius: 8 }} />
                <div className="shimmer" style={{ width: 70, height: 22, borderRadius: 8 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="shimmer" style={{ width: 80, height: 22, borderRadius: 100 }} />
                <div className="shimmer" style={{ width: 50, height: 14, borderRadius: 4 }} />
            </div>
        </div>
    );
}

const darkShimmerStyle = `
@keyframes shimmerDark {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
}
.shimmer {
    background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.05) 75%);
    background-size: 1200px 100%;
    animation: shimmerDark 1.6s infinite;
}
@keyframes cardEnter {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}
.card-enter {
    animation: cardEnter 0.45s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes listBounce {
    0%, 100% { transform: translateY(0px)   scale(1);    opacity: 0.55; }
    40%       { transform: translateY(-55px) scale(1.09); opacity: 0.90; }
    70%       { transform: translateY(-25px) scale(0.97); opacity: 0.75; }
}
@keyframes listDriftA {
    0%   { transform: translate(0,0)      scale(1);    opacity: 0.55; }
    30%  { transform: translate(50px,-60px) scale(1.10); opacity: 0.90; }
    65%  { transform: translate(-30px,35px) scale(0.93); opacity: 0.70; }
    100% { transform: translate(0,0)      scale(1);    opacity: 0.55; }
}
.hero-glow-1 {
    position: absolute; top: -80px; right: 5%;
    width: 450px; height: 450px; border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.24) 0%, rgba(99,102,241,0.10) 40%, transparent 68%);
    animation: listDriftA 10s ease-in-out infinite;
    pointer-events: none; filter: blur(2px);
}
.hero-glow-2 {
    position: absolute; bottom: -70px; left: 8%;
    width: 350px; height: 350px; border-radius: 50%;
    background: radial-gradient(circle, rgba(167,139,250,0.20) 0%, transparent 65%);
    animation: listDriftA 15s ease-in-out infinite 3s;
    pointer-events: none; filter: blur(1px);
}
.hero-glow-3 {
    position: absolute; top: 28%; left: 38%;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%);
    animation: listBounce 7s ease-in-out infinite 1.5s;
    pointer-events: none;
}
`;

export default function ListingsPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const initFilters = {
        category_id: searchParams.get('category_id') || '',
        dept_id:     searchParams.get('dept_id')     || '',
        opp_mode:    searchParams.get('opp_mode')    || '',
        is_paid:     searchParams.get('is_paid')     || '',
    };

    const [opportunities, setOpportunities] = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters,    setFilters]    = useState(initFilters);
    const filtersRef = useRef(initFilters);

    async function fetchOpportunities(currentFilters) {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (currentFilters.category_id) params.append('category_id', currentFilters.category_id);
            if (currentFilters.dept_id)     params.append('dept_id',     currentFilters.dept_id);
            if (currentFilters.opp_mode)    params.append('opp_mode',    currentFilters.opp_mode);
            if (currentFilters.is_paid !== '') params.append('is_paid',  currentFilters.is_paid);

            const response = await api.get(`/api/search?${params.toString()}`);
            setOpportunities(response.data.data || []);
        } catch (err) {
            setError('Failed to load opportunities. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOpportunities(filtersRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleFilterChange(key, value) {
        const newFilters = { ...filtersRef.current, [key]: value };
        filtersRef.current = newFilters;
        setFilters(newFilters);
    }

    function handleSearch() {
        fetchOpportunities(filtersRef.current);
    }

    function clearCategoryFilter() {
        const newFilters = { ...filtersRef.current, category_id: '' };
        filtersRef.current = newFilters;
        setFilters(newFilters);
        setSearchParams({});
        fetchOpportunities(newFilters);
    }

    const today = new Date();
    const filtered = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return opportunities.filter(opp => {
            if (new Date(opp.deadline) < today) return false;
            if (!q) return true;
            return (
                opp.title.toLowerCase().includes(q) ||
                opp.description.toLowerCase().includes(q) ||
                (opp.organization || '').toLowerCase().includes(q)
            );
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [opportunities, searchTerm]);

    const activeCategory = filters.category_id ? CATEGORY_NAMES[filters.category_id] : null;
    const categoryIcon   = activeCategory ? CATEGORY_ICONS[activeCategory] : null;

    return (
        <div style={{ background: '#0d0b23', minHeight: '100vh' }}>
            <style>{darkShimmerStyle}</style>

            {/* ── Hero Banner ── */}
            <div style={{
                background: 'linear-gradient(135deg, #0f0e2b 0%, #1e1b4b 55%, #312e81 100%)',
                padding: '52px 24px 64px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Large drifting background orbs */}
                <div className="hero-glow-1" />
                <div className="hero-glow-2" />
                <div className="hero-glow-3" />
                {/* Small bouncing particles */}
                <div className="lp-ball lp-ball-1" />
                <div className="lp-ball lp-ball-2" />
                <div className="lp-ball lp-ball-3" />
                <div className="lp-ball lp-ball-4" />
                <div className="lp-ball lp-ball-5" />
                <div className="lp-ball lp-ball-6" />
                <div className="hero-grid" />

                <div className="max-w-7xl mx-auto relative">
                    <div className="fade-up">
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                background: 'rgba(245,158,11,0.15)',
                                border: '1px solid rgba(245,158,11,0.30)',
                                borderRadius: 100, padding: '5px 14px',
                                fontSize: '0.72rem', fontWeight: 700,
                                color: '#fbbf24', letterSpacing: '0.08em', textTransform: 'uppercase',
                            }}>
                                <span className="pulse-dot" style={{
                                    width: 6, height: 6, borderRadius: '50%',
                                    background: '#fbbf24', display: 'inline-block',
                                }} />
                                Campus Opportunity Aggregator · NUST
                            </span>
                        </div>

                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                            fontWeight: 800, color: '#fff',
                            lineHeight: 1.15, marginBottom: 14,
                        }}>
                            {activeCategory ? (
                                <>
                                    {categoryIcon && <span style={{ marginRight: 10 }}>{categoryIcon}</span>}
                                    {activeCategory}{' '}
                                    <span className="grad-text">Opportunities</span>
                                </>
                            ) : (
                                <>Find Your Edge —{' '}
                                    <span className="grad-text">Browse Every Opportunity</span>
                                </>
                            )}
                        </h1>

                        <p style={{
                            color: 'rgba(255,255,255,0.52)', fontSize: '1rem',
                            maxWidth: 540, lineHeight: 1.65,
                        }}>
                            {activeCategory
                                ? `All ${activeCategory.toLowerCase()} opportunities verified and curated for NUST students.`
                                : 'Internships at top companies, global scholarships, hackathons with big prizes — all in one place.'}
                        </p>
                    </div>

                    {/* Chips row */}
                    <div className="fade-up fade-up-delay-1" style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                        {activeCategory && (
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                background: 'rgba(245,158,11,0.15)',
                                border: '1px solid rgba(245,158,11,0.35)',
                                borderRadius: 100, padding: '7px 16px',
                            }}>
                                <span style={{ color: '#fbbf24', fontSize: '0.82rem', fontWeight: 600 }}>
                                    Filtered: {activeCategory}
                                </span>
                                <button
                                    onClick={clearCategoryFilter}
                                    style={{
                                        background: 'rgba(255,255,255,0.12)', border: 'none',
                                        color: '#fff', cursor: 'pointer',
                                        width: 18, height: 18, borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.75rem', lineHeight: 1, padding: 0,
                                    }}
                                    title="Clear filter"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {!loading && !error && (
                            <>
                                {[
                                    { label: 'Total fetched', value: opportunities.length, color: '#a78bfa' },
                                    { label: 'Showing',       value: filtered.length,      color: '#34d399' },
                                ].map(stat => (
                                    <div key={stat.label} style={{
                                        background: 'rgba(255,255,255,0.07)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: 12, padding: '8px 18px',
                                        backdropFilter: 'blur(10px)',
                                        display: 'flex', alignItems: 'baseline', gap: 6,
                                    }}>
                                        <span style={{ color: stat.color, fontWeight: 800, fontSize: '1.15rem' }}>{stat.value}</span>
                                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{stat.label}</span>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Main content ── */}
            <div style={{ background: '#0d0b23' }}>
                <div className="max-w-7xl mx-auto px-4 py-8">

                    {/* FilterBar sits flush with the dark bg */}
                    <div className="mb-8 fade-up fade-up-delay-2">
                        <FilterBar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onSearch={handleSearch}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                        />
                    </div>

                    {/* Loading skeletons */}
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    )}

                    {/* Error state */}
                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.10)',
                            border: '1px solid rgba(239,68,68,0.30)',
                            color: '#fca5a5', borderRadius: 14,
                            padding: '16px 20px', fontSize: '0.875rem',
                            display: 'flex', alignItems: 'center', gap: 10,
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                            {error}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && filtered.length === 0 && (
                        <div style={{
                            textAlign: 'center', padding: '80px 20px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                        }}>
                            <div style={{
                                width: 72, height: 72, borderRadius: '50%',
                                background: 'rgba(109,40,217,0.15)',
                                border: '1px solid rgba(167,139,250,0.20)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '2rem', marginBottom: 4,
                            }}>
                                🔍
                            </div>
                            <p style={{ color: '#e2e0ff', fontSize: '1.1rem', fontWeight: 600 }}>
                                No opportunities found
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' }}>
                                Try adjusting your filters or search term
                            </p>
                            {(activeCategory || searchTerm) && (
                                <button
                                    onClick={() => { clearCategoryFilter(); setSearchTerm(''); }}
                                    style={{
                                        marginTop: 8, background: 'rgba(109,40,217,0.20)',
                                        border: '1px solid rgba(167,139,250,0.30)',
                                        color: '#c4b5fd', borderRadius: 10,
                                        padding: '8px 20px', fontSize: '0.85rem',
                                        fontWeight: 600, cursor: 'pointer',
                                    }}
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* Results grid */}
                    {!loading && !error && filtered.length > 0 && (
                        <>
                            {/* Section label */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                marginBottom: 20,
                            }}>
                                <div style={{
                                    height: 1, flex: 1,
                                    background: 'linear-gradient(90deg, rgba(167,139,250,0.25), transparent)',
                                }} />
                                <span style={{
                                    color: 'rgba(167,139,250,0.6)', fontSize: '0.75rem',
                                    fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                                </span>
                                <div style={{
                                    height: 1, flex: 1,
                                    background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.25))',
                                }} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filtered.map((opp, idx) => (
                                    <div key={opp.opp_id} className="card-enter" style={{ animationDelay: `${Math.min(idx * 0.06, 0.6)}s` }}>
                                        <OpportunityCard opportunity={opp} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
