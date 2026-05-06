import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import OpportunityCard from '../components/OpportunityCard';
import FilterBar from '../components/FilterBar';

export default function ListingsPage() {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category_id: '',
        dept_id: '',
        opp_mode: '',
        is_paid: ''
    });
    const filtersRef = useRef(filters);

    async function fetchOpportunities(currentFilters) {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (currentFilters.category_id) params.append('category_id', currentFilters.category_id);
            if (currentFilters.dept_id) params.append('dept_id', currentFilters.dept_id);
            if (currentFilters.opp_mode) params.append('opp_mode', currentFilters.opp_mode);
            if (currentFilters.is_paid !== '') params.append('is_paid', currentFilters.is_paid);

            const response = await axios.get(`/api/search?${params.toString()}`);
            setOpportunities(response.data.data);
        } catch (err) {
            setError('Failed to load opportunities. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOpportunities(filters);
    }, []);

    function handleFilterChange(key, value) {
        const newFilters = { ...filtersRef.current, [key]: value };
        filtersRef.current = newFilters;
        setFilters(newFilters);
    }

    function handleSearch() {
        fetchOpportunities(filtersRef.current);
    }

    const today = new Date();

    const filtered = opportunities.filter(opp => {
        const deadlinePassed = new Date(opp.deadline) < today;
        if (deadlinePassed) return false;
        return (
            opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            opp.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div>
            {/* Hero Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #1e2a4a 0%, #2d3d6e 60%, #1e3a5f 100%)',
                padding: '48px 24px 56px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative circles */}
                <div style={{
                    position: 'absolute', top: -60, right: -60,
                    width: 220, height: 220,
                    borderRadius: '50%',
                    background: 'rgba(245,158,11,0.08)',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute', bottom: -40, left: '30%',
                    width: 160, height: 160,
                    borderRadius: '50%',
                    background: 'rgba(79,70,229,0.12)',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute', top: 20, left: -40,
                    width: 120, height: 120,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.04)',
                    pointerEvents: 'none'
                }} />

                <div className="max-w-7xl mx-auto relative">
                    <div className="fade-up">
                        <p style={{
                            fontSize: '0.75rem',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: '#fbbf24',
                            fontWeight: 600,
                            marginBottom: 10
                        }}>
                            Campus Opportunity Aggregator
                        </p>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                            fontWeight: 700,
                            color: '#ffffff',
                            lineHeight: 1.2,
                            marginBottom: 10
                        }}>
                            Discover Your Next<br />
                            <span style={{ color: '#fbbf24' }}>Big Opportunity</span>
                        </h1>
                        <p style={{
                            color: 'rgba(255,255,255,0.55)',
                            fontSize: '0.95rem',
                            maxWidth: 480,
                            lineHeight: 1.6
                        }}>
                            Internships, scholarships, hackathons and more — all in one place for NUST students.
                        </p>
                    </div>

                    {/* Stats row */}
                    {!loading && !error && (
                        <div className="fade-up fade-up-delay-1 flex gap-6 mt-6 flex-wrap">
                            {[
                                { label: 'Opportunities', value: opportunities.length },
                                { label: 'Showing', value: filtered.length },
                            ].map(stat => (
                                <div key={stat.label} style={{
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: 10,
                                    padding: '8px 16px',
                                    backdropFilter: 'blur(8px)'
                                }}>
                                    <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '1.1rem' }}>
                                        {stat.value}
                                    </span>
                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginLeft: 6 }}>
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6 fade-up fade-up-delay-2">
                    <FilterBar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onSearch={handleSearch}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                    />
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
                    </div>
                )}

                {error && (
                    <div style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        borderRadius: 12,
                        padding: '14px 18px',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">🔍</p>
                        <p style={{ color: '#6b7280', fontSize: '1.1rem', fontWeight: 500 }}>No opportunities found</p>
                        <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: 4 }}>Try adjusting your filters</p>
                    </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-up fade-up-delay-3">
                        {filtered.map(opp => (
                            <OpportunityCard key={opp.opp_id} opportunity={opp} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}